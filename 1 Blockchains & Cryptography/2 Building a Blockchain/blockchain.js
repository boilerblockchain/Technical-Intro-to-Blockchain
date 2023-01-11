const { ethers, utils } = require("ethers");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const MINT_KEY_PAIR = ec.genKeyPair();
const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic("hex");

//We will import "ethers" to use a hashing algorithm and "elliptic" to generate keypairs
//install dependencies using npm i

class Block {
  constructor(timestamp = "", data = [], previousHash = "") {
    this.timestamp = timestamp;
    this.data = data;
    this.hash = this.getBlockHash();
    this.prevBlockHash = previousHash;
    this.nonce = 0;
  }

  getBlockHash() {
    //Returns the Keccak 256 hash of the block
    //The specific hashing algorithm used is not important. SHA-256 and SHA-3 are also common
    return ethers.utils.keccak256(
      utils.toUtf8Bytes(
        this.prevBlockHash +
          this.timestamp +
          JSON.stringify(this.data) +
          this.nonce
      )
    );
  }

  //Brute force to guess hash that starts with {difficulty} zeroes. Increment nonce each iteration.
  mine(difficulty) {
    while (
      !this.hash.toString().startsWith(Array(difficulty + 1).join("0"), 2)
    ) {
      this.nonce++;
      this.hash = this.getBlockHash();
    }
  }

  //Checks all transactions in the block are valid
  isValidBlock() {
    for (const tx of this.data) {
      if (!tx.isValid()) return false;
    }
    return true;
  }
}

class Blockchain {
  constructor(deployerKeyPair) {
    //chain will contain all blocks in the blockchain
    //we will initialize the chain with the "genesis block"
    //The genesis block will only contain the timestamp and a transaction minting coins to the deploying wallet
    const MINT_KEY_PAIR = ec.genKeyPair();
    const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic("hex");
    const initalCoinRelease = new Transaction(
      MINT_PUBLIC_ADDRESS,
      deployerKeyPair.getPublic("hex"),
      100000
    );
    this.chain = [new Block(Date.now().toString(), [initalCoinRelease])];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.minerReward = 0;
  }

  //Returns the last block number
  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  mineTransactions(rewardAddress) {
    //Reward miner
    const rewardTx = new Transaction(null, rewardAddress, this.minerReward);
    this.pendingTransactions.push(rewardTx);

    const block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLastBlock().hash
    );

    block.mine(this.difficulty);

    this.chain.push(block);

    this.pendingTransactions = [];
  }

  addTransaction(tx) {
    if (!tx.from || !tx.to) {
      throw new Error("Transaction must include to and from addresses!");
    }

    if (!tx.isValid()) {
      throw new Error("Transaction is invalid!");
    }

    if (!tx.amount > 0) {
      throw new Error("Transaction amount must be greater than zero!");
    }

    const balance = this.getBalance(tx.from);

    if (balance < tx.amount) {
      throw new Error("Insufficient balance!");
    }

    const pendingTxFiltered = this.pendingTransactions.filter(
      (tempTx) => tempTx.from === tx.from
    );

    if (pendingTxFiltered.length > 0) {
      const totalPending = 0;
      for (const tempTx of this.pendingTxFiltered) {
        totalPending += tempTx.amount;
      }

      if (totalPending > balance) {
        throw new Error("Pending transaction values are greater than balance!");
      }
    }

    this.pendingTransactions.push(tx);
  }

  getBalance(address) {
    let balance = 0;

    this.chain.forEach((block) => {
      block.data.forEach((transaction) => {
        if (transaction.from === address) {
          balance -= transaction.amount;
        }

        if (transaction.to === address) {
          balance += transaction.amount;
        }
      });
    });

    return balance;
  }

  //Checks prevBlockHash matches the hash of the previous block hash for every block in the chain
  isValidChain(blockchain = this) {
    for (let i = 1; i < blockchain.chain.length; i++) {
      const currentBlock = blockchain.chain[i];
      const prevBlock = blockchain.chain[i - 1];

      if (
        currentBlock.hash !== currentBlock.getHash() ||
        prevBlock.hash !== currentBlock.prevBlockHash
      ) {
        return false;
      }

      if (!currentBlock.isValidBlock()) {
        return false;
      }
    }

    //if all current and previous hashes are checked without error, chain is valid!
    return true;
  }
}

class Transaction {
  constructor(from, to, amount) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.timestamp = Date.now();
  }

  getTransactionHash() {
    return ethers.utils.keccak256(
      utils.toUtf8Bytes(this.from + this.to + this.amount + this.timestamp)
    );
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic("hex") == this.from) {
      const txHash = this.getTransactionHash();
      this.signature = signingKey.sign(txHash, "base64").toDER("hex");
    } else {
      throw new Error("Signing key is invalid, make sure to use your own key");
    }
  }

  isValid() {
    if (this.from === null) return true; //if no from field, assume mining reward

    if (!this.signature) {
      throw new Error("No signature found!");
    }

    const publicKey = ec.keyFromPublic(this.from, "hex");

    return publicKey.verify(
      ethers.utils.keccak256(
        utils.toUtf8Bytes(this.from + this.to + this.amount + this.timestamp)
      ),
      this.signature
    );
  }
}

module.exports = { Block, Blockchain, Transaction };
