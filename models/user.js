const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'Name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true,'Email is required'],
        unique: [true, 'this email address has been used']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
});

//replace the password with a hash of the password before saving in the database
userSchema.pre('save', function(next){
    let user = this;
    if (!user.isModified('password')){
        return next();
    }
    bcrypt.hash(user.password,10)
    .then(hash=>{
        user.password = hash;
        next();
    })
    .catch(err=>{     
        next(err);
    });
});


//compare the password with the hash in the database using a method
userSchema.methods.comparePassword = function(loginPassword, next){
    let user = this;
    return bcrypt.compare(loginPassword, user.password)
   
};

module.exports = mongoose.model('User', userSchema);