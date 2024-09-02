const Price = require('../models/Price');
const axios = require('axios');

// Function to fetch Ethereum price
async function fetchEthereumPrice() {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
        const ethPrice = response.data.ethereum.inr;

        // Save the price to the database
        const updatedPrice = await Price.findOneAndUpdate(
            {},
            { price: ethPrice, timestamp: new Date() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // console.log(`Saved Ethereum price: ₹${ethPrice}`);
        console.log(`Saved Ethereum price: ₹${updatedPrice.price}`);
    } catch (error) {
        console.error('Error fetching Ethereum price:', error);
    }
}

module.exports = fetchEthereumPrice;