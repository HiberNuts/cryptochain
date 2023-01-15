const Wallet = require("./index");
const { verifySginature } = require("../util");
const Transaction = require("./transaction");

describe("Transaction", () => {
  let transaction, senderWallet, recipient, amount;

  beforeEach(() => {
    senderWallet = new Wallet();
    recipient = "recipient-public-key";
    amount = 50;

    transaction = new Transaction({ senderWallet, recipient, amount });
  });

  it("has an id", () => {
    expect(transaction).toHaveProperty("id");
  });

  describe("outMap", () => {
    it("has an output", () => {
      expect(transaction).toHaveProperty("outputMap");
    });
    it("outputs the amount to the recipient", () => {
      expect(transaction.outputMap[recipient]).toEqual(amount);
    });

    it("outputs the remaining for the senderWallet", () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance - amount);
    });
  });

  describe("input", () => {
    it("has an input", () => {
      expect(transaction).toHaveProperty("input");
    });

    it("has a timestamp in the input", () => {
      expect(transaction.input).toHaveProperty("timestamp");
    });

    it("sets the amount to the sender walet balance", () => {
      expect(transaction.input.amount).toEqual(senderWallet.balance);
    });

    it("sets the address to the sender wallet publikckey", () => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey);
    });

    it("it signs the iput()", () => {
      expect(
        verifySginature({
          publicKey: senderWallet.publicKey,
          data: transaction.outputMap,
          signature: transaction.input.signature,
        })
      ).toBe(true);
    });


  });

  describe('valid Transaction', () => { 
    describe('when the transaction is valid', () => {  })
    describe('when the transaction is invalid', () => {  })
  })
});