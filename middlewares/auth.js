const model = require('../models/trade');
//check if user is a guest
exports.isGuest = (req,res,next)=>{
    if(!req.session.user)
    return next();
    else{
        req.flash("error", "you are already logged in")
        return res.redirect('/users/profile')
    }
}

//check if user is authenticate

exports.isLoggedIn = (req,res,next)=>{
    if(req.session.user)
    return next();
    else{
        req.flash("error", "you need to login first")
        return res.redirect('/users/login')
    }
}

//check if user author of the story
exports.isAuthor = (req,res,next)=>{
  let id =  req.params.id;
  model.newTrade.findById(id)
  .then(trade=>{
    if(trade){
        console.log(trade.author)
        console.log(req.session.user)
        if(trade.author == req.session.user){
            return next();
        }else{
            let err = new Error('Unauthorized access to this page');
            err.status = 401;
            return next(err);
        }
    }
  })
  .catch(err=>next(err))
}