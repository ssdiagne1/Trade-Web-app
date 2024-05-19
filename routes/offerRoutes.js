const express = require('express');
const router = express.Router();
const controller = require('../controllers/tradeController');
const {isLoggedIn,isAuthor} = require('../middlewares/auth')
const {isValidId} = require('../middlewares/validator')
const {validateContent,validateResult} = require('../middlewares/validator');

//GET /trades/:id/trade: display a form allowing the user to select an item they want to trade and make an offer for the item with the ID specified in the URL.
router.get('/:id/trade', isLoggedIn, controller.trade);


//POST /trades/:id/trade: handle the form submission and create a new trade offer in the database with the appropriate details.
router.post('/:id/trade', isLoggedIn, validateContent, validateResult, controller.createTrade);

//GET /trades/trades/:id/offers: display a list of all trade offers for the item with the ID specified in the URL.
router.get('/:id/offers', isLoggedIn, controller.showOffers);

//GET /trades/trades/:id/offers/:offerId: display the details of a specific trade offer for the item with the ID specified in the URL.
router.get('/:id/offers/:offerId', isLoggedIn, controller.showOffer);

//PUT /trades/trades/:id/offers/:offerId: allow the user to accept or decline a trade offer for the item with the ID specified in the URL.
router.put('/:id/offers/:offerId', isLoggedIn, controller.updateOffer);
module.exports = router;