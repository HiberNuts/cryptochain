const Block = require("./block");
const cryptoHash = require("../util/crypto-hash");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });

    this.chain.push(newBlock);
  }

  isValidChain(chain) {
    if (JSON.stringify(chain[0]) != JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, data, difficulty, nonce } = chain[i];
      const lastDifficulty = chain[i - 1].difficulty;
      const actualLastHash = chain[i - 1].hash;

      if (lastHash !== actualLastHash) {
        return false;
      }

      const validatedHash = cryptoHash(timestamp, lastHash, data, difficulty, nonce);
      if (hash !== validatedHash) return false;

      if (Math.abs(lastDifficulty - difficulty) > 1) return false;
    }

    return true;
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.log("The incoming chain must be longer");
      return;
    }

    if (!this.isValidChain(chain)) {
      return;
    }
    this.chain = chain;
  }
}

module.exports = Blockchain;
