const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
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
    const address = req?.query?.address;

    if (!address) {
        return res.send('Address is required').status(400);
    }

    console.log(`Fetching data for address: ${address}`);

    // fetch data from etherscan api
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${apikey}`;

    const response = await fetch(url);

    const data = await response.json();

    // create transaction if the address is not there otherwise update it
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

// Endpoint to fetch the latest price from the database
app.get('/api/expenses', async (req, res) => {
    try {
        const price = await Price.findOne().sort({ timestamp: -1 });
        const fetch = (await import('node-fetch')).default;



        if (!req.query.address) {
            return res.send('Address is required').status(400);
        }

        // get address from request
        const address = req?.query?.address;

        console.log(`Fetching data for address: ${address}`);

        // fetch data from etherscan api
        const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${apikey}`;

        const response = await fetch(url);

        const data = await response.json();

        // create transaction if the address is not there otherwise update it
        const transaction = await createTransaction(address, data["result"]);

        let calc = 0.0;

        for (let i = 0; i < transaction.result.length; i++) {
            calc += parseFloat(transaction.result[i].gasUsed) * parseFloat(transaction.result[i].gasPrice) / 1e18;
        }

        return res.send({
            price: price.price,
            expenses: calc
        });
    } catch (error) {
        res.status(500).send('Error fetching Expenses');
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to Crypto Expense Tracker API');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

// Fetch the price immediately when the server starts
fetchEthereumPrice();