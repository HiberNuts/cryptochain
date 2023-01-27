const Transaction = require("../wallet/transaction");

class TransactionMiner {
  constructor({ blockchain, transactionPool, wallet, pubsub }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }

  mineTransaction() {
    // *Get the transaction pools valid transaction
    const validTransactions = this.transactionPool.validTransactions();

    // *Generate the miners reward
    validTransactions.push(Transaction.rewardTransaction({ minerWallet: this.wallet }));

    // * add a block consisting of these transactions to the blockchain
    this.blockchain.addBlock({ data: validTransactions });

    // *Broadcast the updated blockchain
    this.pubsub.broadcastChain();
    // *Clear the pool

    this.transactionPool.clear();
  }
}

module.exports = TransactionMiner;
