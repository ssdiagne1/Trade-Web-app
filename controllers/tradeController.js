const model  = require('../models/trade.js');
const watchlist = require('../models/watchlist.js');
const { Error } = require('mongoose');


exports.index = (req, res, next) => {
  Promise.all([
    model.newCategory.find(),
    model.newTrade.find()
  ])
    .then(([categories, trades]) => {
      res.render('./trade/trades', { trades: trades, categories: categories });
    })
    .catch((err) => next(err));
};



//GET /trades/new: send html form for creating a new trade

exports.new = (req,res)=>{
    res.render('./trade/newTrade');
};


exports.about = (req,res)=>{
    res.render('./trade/about');
};
//POST /trades: create a new trade
exports.create = (req,res,next)=>{
    let trade = new model.newTrade(req.body)
    let categories = new model.newCategory(req.body)
    let cat = trade.category
    trade.author = req.session.user
    model.newCategory.findOne({category:cat})
    .then((cat)=>{
       if(cat){
        console.log("This category already exists"+cat)
       }else{
        categories.save()
        .then()
        .catch()
       }
    })
    .catch()
    trade.save()
    .then((trade)=>{
        console.log(trade);
         res.redirect("/trades")
    })
    .catch(err=>{
        if(err.name ==="ValidationError")
        err.status = 400
        next(err);
    })
   
    
}


//GET /trades/id: send details of trade identified by id
exports.show =(req,res, next)=>{
    // res.send('send the trade with id '+ req.params.id);
    let id = req.params.id;
    model.newTrade.findById(id).populate('author')
    .then(trade=>{
        if(trade){
            res.render('./trade/trade',{trade})
            }else{
                let err = new Error ("Cannot find trade with id "+ id)
                err.status = 404;
                next(err)
            }
    })
    .catch(err=>next(err))
   
};

//GET /trades/id/edit: send html form for editing an existing trade
exports.edit = (req,res,next)=>{
    let id = req.params.id;
    
    model.newTrade.findById(id)
    .then(trade=>{
        if(trade){
            res.render('./trade/edit',{trade})
            }else{
                let err = new Error ("Cannot find trade with id "+ id)
                err.status = 404;
                next(err)
            }
    })
    .catch(err=>next(err))
}

//PUT /trades/id: update the trade identified by id 
exports.update = (req,res,next)=>{
    let  trade =  req.body
     let id = req.params.id
  
     model.newTrade.findByIdAndUpdate(id,trade,{useFindAndModify:false, runValidators: true})
     .then(trade=>{
         if(trade){
         res.redirect('/trades/'+id)
         }else{
             let err = new Error ("Cannot find story with id "+ id)
             err.status = 404;
             next(err)
         }
     })
     .catch(err=>{
         if(err.name ==="ValidationError")
         err.status = 400
         next(err);
     })
    
 }

//DELETE /trades/id: delete the trade identified by id

exports.delete = (req,res,next)=>{

    let id = req.params.id
        model.newTrade.findByIdAndDelete(id,{useFindAndModify:false, runValidators: true})
        .then(trade=>{
            if(trade){
            res.redirect('/users/profile')
            }else{
                let err = new Error ("Cannot find trade with id "+ id)
                err.status = 404;
                next(err)
            }
        })
        .catch(err=>{
            if(err.name ==="ValidationError")
            err.status = 400
            next(err);
        })

}



exports.watch = (req,res,next)=>{
    let id = req.params.id
    //retrieve trade from id'
    let trade = model.newTrade.findById(id)
    //retrive trade using id from url and get the trade from the database
    trade.then(trade=>{
        if(trade){
            console.log('watch info')
            watch = new watchlist.newWatch({id:trade._id, userId:req.session.user, title:trade.title, category:trade.category, status:trade.status})
            console.log(watch)

            watch.save()
            .then(watch=>{
                if(watch){
                res.redirect('/trades/'+id)
                }else{
                    let err = new Error ("Cannot find trade with id "+ id)
                    err.status = 404;
                    next(err)
                }
            })
            .catch(err=>{
                if(err.name ==="ValidationError")
                err.status = 400
                next(err);
            })


        }else{
            let err = new Error ("Cannot find trade with id "+ id)
            err.status = 404;
            next(err)
        }

    })


}


//function to unwatch trades using the newWatch model
exports.unwatch = (req,res,next)=>{
  let id = req.params.id
  let trade = model.newTrade.findById(id)
  trade.then(trade=>{
      if(trade){

      watchlist.newWatch.findOneAndDelete(id,{useFindAndModify:false, runValidators: true})
      .then(watch=>{
          if(watch)
              res.redirect('users/profile')
          else{
              let err = new Error ("Cannot find trade with id "+ id)
              err.status = 404;
              next(err)
          }
      })
      .catch(err=>{
          if(err.name ==="ValidationError")
          err.status = 400
          next(err);
      })
  }
 
  else{
      let err = new Error ("Cannot find trade watchlist with id "+ id)
      err.status = 404;
      next(err)
  }
})
}


// GET /trades/:id/offer - render a form allowing the user to make an offer for the item with the specified ID.
exports.newTradeOffer = (req, res, next) => {
    let id = req.params.id;
    model.newTrade.findById(id)
      .then(trade => {
        if (trade) {
          res.render('./trade/newTradeOffer', { trade });
        } else {
          let err = new Error("Cannot find trade with id " + id);
          err.status = 404;
          next(err);
        }
      })
      .catch(err => next(err));
  };

// POST /trades/:id/offer - handle the form submission and create a new trade offer in the database.
exports.createTradeOffer = (req, res, next) => {
    let id = req.params.id;
    let offer = new model.newTradeOffer(req.body);
    offer.trade = id;
    offer.user = req.session.user;
    offer.save()
      .then(offer => {
        res.redirect(`/trades/${id}/offers`);
      })
      .catch(err => {
        if (err.name === "ValidationError")
          err.status = 400;
        next(err);
      });
  };

  
// GET /trades/:id/offers - display a list of all trade offers for the item with the specified ID.
exports.viewTradeOffers = (req, res, next) => {
    let id = req.params.id;
    model.newTrade.findById(id)
      .populate('offers')
      .then(trade => {
        if (trade) {
          res.render('./trade/tradeOffers', { trade });
        } else {
          let err = new Error("Cannot find trade with id " + id);
          err.status = 404;
          next(err);
        }
      })
      .catch(err => next(err));
  };

  
// GET /trades/:id/offers/:offerId - display the details of a specific trade offer for the item with the specified ID.
exports.viewTradeOffer = (req, res, next) => {
    let offerId = req.params.offerId;
    model.newTradeOffer.findById(offerId)
      .populate('trade')
      .then(offer => {
        if (offer) {
          res.render('./trade/tradeOffer', { offer });
        } else {
          let err = new Error("Cannot find trade offer with id " + offerId);
          err.status = 404;
          next(err);
        }
      })
      .catch(err => next(err));
  };

  
// PUT /trades/:id/offers/:offerId - allow the user to accept or decline a specific trade offer for the item with the specified ID.
exports.updateTradeOffer = (req, res, next) => {
    let offerId = req.params.offerId;
    let status = req.body.status;
    model.newTradeOffer.findByIdAndUpdate(offerId, { status: status }, { useFindAndModify: false, runValidators: true })
      .then(offer => {
        if (offer) {
          res.redirect(`/trades/${offer.trade}/offers/${offerId}`);
        } else {
          let err = new Error("Cannot find trade offer with id " + offerId);
          err.status = 404;
          next(err);
        }
      })
      .catch(err => {
        if (err.name === "ValidationError")
          err.status = 400;
        next(err);
        });
    };
  
