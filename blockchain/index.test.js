const Block = require("./block");
const Blockchain = require("./index");
const cryptoHash = require("../util/crypto-hash");

describe("Blockchain", () => {
  let blockchain, newChain, originalChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();

    originalChain = blockchain.chain;
  });

  it("contains a chain array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with a geneisis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("adds new block to chain", () => {
    const newData = "foo-bar";
    blockchain.addBlock({ data: newData });
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe("isValidChain()", () => {
    describe("When the chain does not start with genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "fake-genesis" };

        expect(blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("When the chain starts with genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "Bears" });
        blockchain.addBlock({ data: "Fox" });
        blockchain.addBlock({ data: "Wolf" });
      });
      describe("and a lastHash reference has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "broken-lastHash";
          expect(blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and chain contains a block with invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "evil-data";
          expect(blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and chain does not contain invalid blocks", () => {
        it("returns true", () => {
          expect(blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });

      describe("and the chain  contain block with jumped difficulty", () => {
        it("returns fasle", () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];
          const lastHash = lastBlock.hash;
          const timestamp = Date.now();
          const nonce = 0;
          const data = [];
          const difficulty = lastBlock.difficulty - 3;

          const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);

          const badBlock = new Block({ timestamp, lastHash, difficulty, nonce, data });

          blockchain.chain.push(badBlock);
          expect(blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
    });
  });

  describe("replaceChain()", () => {
    let errorMock, logMack;
    beforeEach(() => {
      errorMock = jest.fn();
      logMack = jest.fn();

      global.console.error = errorMock;
      global.console.log = logMack;
    });
    describe("when new chain is not longer", () => {
      it("does not replace the chain", () => {
        newChain.chain[0] = { new: "chain" };
        blockchain.replaceChain(newChain.chain);
        expect(blockchain.chain).toEqual(originalChain);
      });
    });

    describe("when new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "Bears" });
        newChain.addBlock({ data: "Fox" });
        newChain.addBlock({ data: "Wolf" });
      });

      describe("and chain is invalid", () => {
        it("does not replace the chain", () => {
          newChain.chain[2].hash = "some-fake-hash";

          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(originalChain);
        });
      });

      describe("and chain is valid", () => {
        it("replaces the chain", () => {
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(newChain.chain);
        });
      });
    });
  });
});
