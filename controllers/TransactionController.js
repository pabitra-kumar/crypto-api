const Transaction = require('../models/Transaction');

const createTransaction = async (address, result) => {
    try {
        const existingTransaction = await Transaction.findOne({ address });


        const transaction = new Transaction({
            address,
            result
        });

        if (existingTransaction) {
            await Transaction.findOneAndUpdate({ address }, { result, date: Date.now() });
            return existingTransaction;
        } else {
            await transaction.save();
        }
        return transaction;
    } catch (error) {
        console.error(error);
    }
};

// export the function
module.exports = createTransaction;