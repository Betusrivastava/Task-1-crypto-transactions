const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  address: { type: String, required: true },
  transactions: [{
    hash: String,
    blockNumber: Number,
    timeStamp: Number,
    from: String,
    to: String,
    value: String
  }]
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
