const {Blockchain} = require('./blockchain');
const {Transaction} = require('./transaction');
const {Keys} = require('./keysgen');


const myKey = new Keys();
const myWalletAddress = myKey.public();


const lCoin = new Blockchain();

// Create transaction
const tx1 = new Transaction(myWalletAddress, 'address2', 100);
tx1.signTransaction(myKey.key);
lCoin.addTransaction(tx1);

// Mine block
lCoin.minePendingTransactions(myWalletAddress);

// Create second transaction
const tx2 = new Transaction(myWalletAddress, 'address1', 50);
tx2.signTransaction(myKey.key);
lCoin.addTransaction(tx2);

// Mine block
lCoin.minePendingTransactions(myWalletAddress);

console.log();
console.log(`Your balance is ${lCoin.getBalanceOfAddress(myWalletAddress)}`);

// Check if the chain is valid
console.log();
console.log('Blockchain valid?\n', lCoin.isChainValid() ? 'Yes' : 'No');