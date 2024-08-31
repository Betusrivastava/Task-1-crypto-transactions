const express = require('express');
const axios = require('axios');
const Transaction = require('./models');

const router = express.Router();

router.get('/:address', async (req, res) => {
  const address = req.params.address;

  try {
    let transactionData = await Transaction.findOne({ address });

    if (!transactionData) {
      
      const response = await axios.get(`https://api.etherscan.io/api`, {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          sort: 'asc',
          apikey: process.env.ETHERSCAN_API_KEY
        }
      });

      const transactions = response.data.result.map(tx => ({
        hash: tx.hash,
        blockNumber: tx.blockNumber,
        timeStamp: tx.timeStamp,
        from: tx.from,
        to: tx.to,
        value: tx.value
      }));

      transactionData = new Transaction({ address, transactions });
      await transactionData.save();
    }

    res.json(transactionData);
  } catch (error) {
    console.error('Error fetching transactions', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
