const { Blockchain, Transaction } = require("./blockchain");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const myWallet = ec.genKeyPair();
const bobsWallet = ec.genKeyPair();

//Creating our own blockchain with my wallet as the original minter
const boilerBlockchain = new Blockchain(myWallet);

boilerBlockchain.mineTransactions(myWallet.getPublic("hex"));

console.log("-----------------------------------------------------");
console.log(
  `Blockchain generated with 100,000 tokens allocated to \n${myWallet.getPublic(
    "hex"
  )}\n`
);

console.log(
  `My Balance: ${boilerBlockchain.getBalance(myWallet.getPublic("hex"))}`
);

console.log(
  `Bob's Balance: ${boilerBlockchain.getBalance(bobsWallet.getPublic("hex"))}`
);

console.log(boilerBlockchain.chain.data);

const tx1 = new Transaction(
  myWallet.getPublic("hex"),
  bobsWallet.getPublic("hex"),
  100
);

console.log(
  `\nSending ${tx1.amount} tokens from \n${tx1.from}\n to \n${tx1.to}\n`
);

tx1.signTransaction(myWallet);
boilerBlockchain.addTransaction(tx1);

boilerBlockchain.mineTransactions(myWallet.getPublic("hex"));

console.log(
  `My Balance: ${boilerBlockchain.getBalance(myWallet.getPublic("hex"))}`
);

console.log(
  `Bob's Balance: ${boilerBlockchain.getBalance(bobsWallet.getPublic("hex"))}`
);

tx2 = new Transaction(
  bobsWallet.getPublic("hex"),
  myWallet.getPublic("hex"),
  50
);

console.log(
  `\nSending ${tx2.amount} tokens from \n${tx2.from}\nto\n${tx2.to}\n`
);

tx2.signTransaction(bobsWallet);
boilerBlockchain.addTransaction(tx2);

boilerBlockchain.mineTransactions(myWallet.getPublic("hex"));

console.log(
  `My Balance: ${boilerBlockchain.getBalance(myWallet.getPublic("hex"))}`
);

console.log(
  `Bob's Balance: ${boilerBlockchain.getBalance(bobsWallet.getPublic("hex"))}`
);
