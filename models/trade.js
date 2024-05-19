const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tradeSchema = new Schema({
    title: {type: String, required: [true, 'Title is required']},
    category: {type: String, required: [true, 'Category is required']},
    author: {type: Schema.Types.ObjectId,ref: 'User'},
    detail: {type: String, required: [true, 'Detail is required'], minLength: [8, 'the details of the car must be at least 10 characters']},
    status: {type: String, required: [true, 'Status is required']},
    image: {type: String, required: [true, 'Image is required']}

},
{timestamps: true}

);

const categorySchema = new Schema({
    category:  {type: String}
});

//new trade offer model status is pending as  default it can be changed to accepted or rejected
const newTradeOfferSchema = new Schema({
    tradeId: {type: Schema.Types.ObjectId, ref: 'Trade'},
    userId: {type: Schema.Types.ObjectId, required:[true, 'User id is required'], ref: 'User'},
    title: {type: String, required: [true, 'Title is required'], ref: 'Trade.title'},
    category: {type: String, required: [true, 'Category is required'], ref: 'Trade.category'},
    status: {type: String, required: [true, 'Status is required'], ref: 'Trade.status'},
}, {timestamps: true});


// collection name should be trades
module.exports.newTrade = mongoose.model("tradecollection", tradeSchema);
module.exports.newCategory = mongoose.model("Category",categorySchema);
module.exports.newTradeOffer = mongoose.model("TradeOffer",newTradeOfferSchema);
