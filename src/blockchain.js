const SHA256 = require('crypto-js/sha256');
const {Transaction} = require('./transaction');

class Block {
    
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join('0')){
            this.nonce++;
            this.hash =this.calculateHash();
        }
    }
    
    hasValidTransactions() {
        for (const tx of this.transactions) {
          if (!tx.isValid()) {
            return false;
          }
        }
    
        return true;
    }
}

class Blockchain {

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(Date.parse('2017-01-01'), [], '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);
    
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);
    
        console.log('Block successfully mined!');
        this.chain.push(block);
    
        this.pendingTransactions = [];
    }

    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
          throw new Error('Transaction must include from and to address');
        }
    
        // Verify the transactiion
        if (!transaction.isValid()) {
          throw new Error('Cannot add invalid transaction to chain');
        }
        
        if (transaction.amount <= 0) {
          throw new Error('Transaction amount should be higher than 0');
        }
    
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
    
        for (const block of this.chain) {
          for (const trans of block.transactions) {
            if (trans.fromAddress === address) {
              balance -= trans.amount;
            }
    
            if (trans.toAddress === address) {
              balance += trans.amount;
            }
          }
        }
    
        return balance;
    }

    getAllTransactionsForWallet(address) {
        const txs = [];
    
        for (const block of this.chain) {
          for (const tx of block.transactions) {
            if (tx.fromAddress === address || tx.toAddress === address) {
              txs.push(tx);
            }
          }
        }
    
        return txs;
    }

    isChainValid() {
        const realGenesis = JSON.stringify(this.createGenesisBlock());
    
        if (realGenesis !== JSON.stringify(this.chain[0])) {
          return false;
        }
        for (let i = 1; i < this.chain.length; i++) {
          const currentBlock = this.chain[i];
    
          if (!currentBlock.hasValidTransactions()) {
            return false;
          }
    
          if (currentBlock.hash !== currentBlock.calculateHash()) {
            return false;
          }
        }
    
        return true;
    }

}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;