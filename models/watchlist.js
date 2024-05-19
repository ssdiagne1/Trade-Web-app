const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const watchlistSchema = new Schema({
    tradeId: {type: Schema.Types.ObjectId, ref: 'Trade'},
    userId: {type: Schema.Types.ObjectId, required:[true, 'User id is required'], ref: 'User'},
    title: {type: String, required: [true, 'Title is required'], ref: 'Trade.title'},
    category: {type: String, required: [true, 'Category is required'], ref: 'Trade.category'},
    status: {type: String, required: [true, 'Status is required'], ref: 'Trade.status'},
}, {timestamps: true});

module.exports.newWatch = mongoose.model("Watchlist",watchlistSchema);