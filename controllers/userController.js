const userModel = require('../models/user')
const trade = require('../models/trade');
const watchlist = require('../models/watchlist');
const { model } = require('mongoose');



exports.new = (req,res)=>{
        res.render('./user/new');
}

exports.create = (req,res,next)=>{
        let user = new userModel(req.body) 
        user.save()//insert the document to the database
       .then(user=> res.redirect('/users/login'))
       .catch((err)=>{
           if(err.name === 'ValidationError' ) {
               req.flash('error', err.message);  
               return res.redirect('/users/new');
           }
   
           if(err.code === 11000) {
               req.flash('error', 'Email has been used');  
               return res.redirect('/users/new');
           }
           
           next(err);
           } )
}

exports.getUserLogin = (req,res)=>{
  
    res.render('./user/login');
    
}


exports.login = (req, res, next)=>{
   
        let email = req.body.email;
        let password = req.body.password;
        userModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                console.log('wrong email address');
                req.flash('error', 'wrong email address');  
                res.redirect('/users/login');
            } else {
                user.comparePassword(password)
                .then(result=>{
                    if(result) {
                        req.session.user = user._id;
                        req.flash('success', 'You have successfully logged in');
                        res.redirect('/users/profile');
                     }else {
                    req.flash('error', 'wrong password');      
                    res.redirect('/users/login');
                }
            });       
            }
                
        })
        .catch(err => next(err));
   
   
}


exports.profile = (req, res, next)=>{
    let id = req.session.user;
    console.log('id on user controller');
    console.log(id);
    Promise.all([
        userModel.findById(id),
        trade.newTrade.find({author: id}).populate('author'),
        watchlist.newWatch.find({userId: id}).populate('tradeId')
    ])
    .then(results=>{
        const [user, trades, watchlist] = results;
        res.render('./user/profile', {user, trades, watchlist})
    })
    .catch(err=>next(err));
};



exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };