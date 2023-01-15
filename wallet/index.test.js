const Wallet = require("./index");

const { verifySginature } = require("../util");

describe("Wallet", () => {
  let wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  it("has a `Balance`", () => {
    expect(wallet).toHaveProperty("balance");
  });

  it("has a public key", () => {
    expect(wallet).toHaveProperty("publicKey");
    console.log(wallet.publicKey);
  });

  describe("signing data", () => {
    const data = "foo-bar";

    it("verifies the signature", () => {
      expect(verifySginature({ publicKey: wallet.publicKey, data, signature: wallet.sign(data) })).toBe(true);
    });

    it("does not verify an invalid signature", () => {
      expect(verifySginature({ publicKey: wallet.publicKey, data, signature: new Wallet().sign(data) })).toBe(false);
    });
  });
});
