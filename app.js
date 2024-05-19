//require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const tradeRoutes = require('./routes/tradeRoutes');
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

//create app
const app = express();

//configure app
let port = 5000;
let host = 'localhost';
app.set('view engine','ejs');

//connect to database
mongoose.connect('mongodb://127.0.0.1/milestone',{useNewUrlParser:true, useUnifiedTopology:true})
.then(() =>{
    console.log('Connected to database');
    app.listen(port,host,()=>{
        console.log('Server is running on port',port);
    })
})
.catch((err)=>{
    console.log(err.message);
});

//mount middleware

app.use(
    session({
        secret: "dkfnjkf754sjkdnf",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb://127.0.0.1/milestone'}),
        cookie: {maxAge: 60*60*1000}
        })
);

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.static('public'));

app.use(express.urlencoded({extended:true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
//set up routes
app.get('/',(req,res)=>{
    res.render('index');
});



app.use('/trades', tradeRoutes); 
app.use('/users',userRoutes);
//error handling
app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);

});

app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', {error: err});
});


