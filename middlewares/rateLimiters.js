const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
    windowMs: 60*1000,
    max: 3,
   // message: 'Too many login attempts, please try again in 1 minute'
   handler: (req, res, next) => {
        let err = new Error('Too many login attempts, please try again in 1 minute');
        err.status = 429;
        return next(err);
    }
});