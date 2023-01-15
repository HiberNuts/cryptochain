const cryptoHash = require("./crypto-hash");

const EC = require("elliptic").ec;

//used by bitcoin
const ec = new EC("secp256k1");

const verifySginature = ({ publicKey, data, signature }) => {
  const keyFromPublic = ec.keyFromPublic(publicKey, "hex");

  return keyFromPublic.verify(cryptoHash(data), signature);
};

module.exports = { ec, verifySginature, cryptoHash };
