const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


const {Keys} = require('./keysgen');
k = new Keys();

console.log(k.key);
