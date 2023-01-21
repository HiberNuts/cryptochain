class TransactionMiner {
  constructor({ blockchain, transactionPool, wallet, pubsub }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }

  mineTransaction() {
    // *Get the transaction pools valid transaction
    // *Generate the miners reward
    // * add a block consisting of these transactions to the blockchain
    // *Broadcast the updated blockchain
    // *Clear the pool
  }
}

module.exports = TransactionMiner;
