
// Require Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a Mongoose schema and model

const PriceSchema = new Schema({
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Price', PriceSchema);