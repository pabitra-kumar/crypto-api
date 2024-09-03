# Project Overview:

### The Site is available at https://crypto-api-zoiu.onrender.com/

## Task 1: 
Developed an API using Node.js to fetch crypto transactions of a user using the Etherscan API and stored these transactions in MongoDB.
## Task 2: 
Implemented a system to fetch the Ethereum price every 10 minutes using the CoinGecko API and stored it in the database.
## Task 3: 
Created a GET API that allows a user to input their address and retrieve their total expenses along with the current Ethereum price.


| Purpose | Path | Query | Example |
|---------|------|------- |---------|
|  Shows Transaction List for given address  |  /api/transactions  |  ?address= | [Example](https://crypto-api-zoiu.onrender.com/api/transactions?address=0xce94e5621a5f7068253c42558c147480f38b5e0d) |
|  Shows Eth to INR Convergence Value  |  /api/prices  |  null | [Example](https://crypto-api-zoiu.onrender.com/api/prices) |
|  Shows Expences for given address Along with Current Price  |  /api/expences  |  ?address= | [Example](https://crypto-api-zoiu.onrender.com/api/expences?address=0xce94e5621a5f7068253c42558c147480f38b5e0d) |
