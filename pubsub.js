//*REDIS IMPLEMENTATION*

// const redis = require("redis");

// const CHANNELS = {
//   TEST: "TEST",
//   BLOCKCHAIN: "BLOCKCHAIN",
// };

// // redis implementation
// class PubSub {
//   constructor({ blockchain }) {
//     this.blockchain = blockchain;
//     this.publisher = redis.createClient();
//     this.subscriber = redis.createClient();

//     this.subscribeToChannels();

//     this.subscriber.subscribe(CHANNELS.TEST);

//     this.subscriber.on("message", (channel, message) => this.handleMessage(channel, message));
//   }

//   handleMessage(channel, message) {
//     console.log(`Message received. Channel: ${channel}. Message:${message}`);

//     const parsedMessage = JSON.parse(message);

//     if (channel === CHANNELS.BLOCKCHAIN) {
//       this.blockchain.replaceChain(parsedMessage);
//     }
//   }

//   subscribeToChannels() {
//     Object.values(CHANNELS).forEach((channel) => {
//       this.subscriber.subscribe(channel);
//     });
//   }

//   publish({ channel, message }) {
//     this.publisher.publish(channel, message);
//   }

//   broadcastChain() {
//     this.publish({
//       channel: CHANNELS.BLOCKCHAIN,
//       message: JSON.stringify(this.blockchain.chain),
//     });
//   }
// }

// // const testPubSub = new PubSub();

// module.exports = PubSub;

//* PubNub implementation *//

const PubNub = require("pubnub");

const credentials = {
  uuid: "5",
  publishKey: "pub-c-003fba6e-a678-45dd-9d7a-bae42fe5e83c",
  subscribeKey: "sub-c-5c3e55e2-0b69-46d0-b34d-d3672e55c776",
  secretKey: "sec-c-MDdkMTE4ZjEtMDA4OC00ZmE0LTk5NTgtZjA2NWNlMGZiOTY1",
};

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
  TRANSACTION: "TRANSACTION",
};

class PubSub {
  constructor({ blockchain, transactionPool, wallet }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;

    this.pubnub = new PubNub(credentials);

    this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

    this.pubnub.addListener(this.listener());
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }

  broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction),
    });
  }

  subscribeToChannels() {
    this.pubnub.subscribe({
      channels: [Object.values(CHANNELS)],
    });
  }

  listener() {
    return {
      message: (messageObject) => {
        const { channel, message } = messageObject;

        console.log(`Message received. Channel: ${channel}. Message: ${message}\n`);
        const parsedMessage = JSON.parse(message);

        switch (channel) {
          case CHANNELS.BLOCKCHAIN:
            this.blockchain.replaceChain(parsedMessage, true, () => {
              this.transactionPool.clearBlockchainTransactions({ chain: parsedMessage.chain });
            });
            break;
          case CHANNELS.TRANSACTION:
            if (
              !this.transactionPool.existingTransaction({
                inputAddress: this.wallet.publicKey,
              })
            ) {
              this.transactionPool.setTransaction(parsedMessage);
            }
            break;
          default:
            return;
        }
      },
    };
  }

  publish({ channel, message }) {
    // there is an unsubscribe function in pubnub
    // but it doesn't have a callback that fires after success
    // therefore, redundant publishes to the same local subscriber will be accepted as noisy no-ops
    this.pubnub.publish({ message, channel });
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }

  broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction),
    });
  }
}

module.exports = PubSub;
