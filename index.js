const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
const createTransaction = require('./controllers/TransactionController');

const connectDB = require('./config/db_conn');
const fetchEthereumPrice = require('./controllers/PriceController');
const Price = require('./models/Price');

// connect to database
connectDB();

// api key from .env file
const apikey = process.env.API_KEY;

app.get('/api/transactions', async (req, res) => {
    const fetch = (await import('node-fetch')).default;

    // get address from request
    const address = req.query.address;

    if (!address) {
        res.send('Address is required').status(400);
    }

    console.log(`Fetching data for address: ${address}`);

    // fetch data from etherscan api
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${apikey}`;

    const response = await fetch(url);

    const data = await response.json();

    // create transaction
    const transaction = await createTransaction(address, data["result"]);

    // return data
    res.send(data);
});

// Schedule the price fetch every 10 minutes
setInterval(fetchEthereumPrice, 10 * 60 * 1000);

// Endpoint to fetch stored prices from the database
app.get('/api/prices', async (req, res) => {
    try {
        const prices = await Price.find().sort({ timestamp: -1 });
        res.json(prices);
    } catch (error) {
        res.status(500).send('Error fetching prices');
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

// Fetch the price immediately when the server starts
fetchEthereumPrice();