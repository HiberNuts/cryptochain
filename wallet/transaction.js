const { v4: uuidv4 } = require("uuid");
const { verifySginature } = require("../util");

class Transaction {
  constructor({ senderWallet, recipient, amount }) {
    this.id = uuidv4();
    this.outputMap = this.createOutputMap({ senderWallet: senderWallet, recipient: recipient, amount: amount });

    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  createOutputMap({ senderWallet, recipient, amount }) {
    const outputMap = {};

    outputMap[recipient] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
    return outputMap;
  }

  createInput({ senderWallet, outputMap }) {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap),
    };
  }

  8064

  static validTransaction(transaction) {
    const {
      input: { address, amount, signature },
      outputMap,
    } = transaction;

    const outputTotal = Object.values(outputMap).reduce((total, output) => total + output);

    if (amount != outputTotal) {
      console.error(`Invalid transaction from ${address}`);
      return false;
    }

    if (!verifySginature({ publicKey: address, data: outputMap, signature })) {
      console.error(`Invalid signature from ${address}`);
      return false;
    }

    return true;
  }
}

module.exports = Transaction;
