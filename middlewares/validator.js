const { body } = require('express-validator');
const { validationResult } = require('express-validator');


exports.isValidId = (req,res,next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }else{
        return next();
    }

}
exports.validateSignUp =[body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Please enter a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and max 64 characters').isLength({min: 8, max:64})];

exports.validateLogin = [body('email', 'Please enter a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and max 64 characters').isLength({min: 10, max:64})];

exports.validateResult = (req, res, next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    }
    else{
        return next();
    }
}

exports.validateContent = [body('detail', 'detail cannot be empty').notEmpty().trim().escape(),
body('detail', 'Details have to be at least 10 characters.').isLength(min = 8).trim().escape()];