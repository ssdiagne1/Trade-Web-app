const express = require('express');
const router = express.Router();
const controller = require('../controllers/tradeController');
const {isLoggedIn,isAuthor} = require('../middlewares/auth')
const {isValidId} = require('../middlewares/validator')
const {validateContent,validateResult} = require('../middlewares/validator');


//Get /trades: send all trades to the user

router.get('/', controller.index);

//GET /trades/new: send html form for creating a new trade

router.get('/new',isLoggedIn, controller.new);

//GET /trades/new: send html form for more info about our trade website

router.get('/about', controller.about);

//POST /trades: create a new trade
router.post('/', isLoggedIn,validateContent, validateResult, controller.create);


//GET /trades/id: send details of trade identified by id
router.get('/:id', isValidId, controller.show);

//GET /trades/id/edit: send html form for editing an existing trade
router.get('/:id/edit', isValidId, isLoggedIn, isAuthor, controller.edit);

//PUT /trades/id: update the trade identified by id 
router.put('/:id', isValidId, isLoggedIn, isAuthor,  validateContent, validateResult, controller.update);

//DELETE /trades/id: delete the trade identified by id
router.delete('/:id', isValidId, isLoggedIn, isAuthor, controller.delete);

// POST /trades/:id/watch: add trade identified by id to user's watchlist
router.post('/:id', isLoggedIn, controller.watch);

// POST /trades/:id/unwatch: remove trade identified by id from user's watchlist
router.delete('/:id', isValidId, isLoggedIn, controller.unwatch);



module.exports = router;