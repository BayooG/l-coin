const EC = require('elliptic').ec;

// You can use any elliptic curve you want
const ec = new EC('secp256k1');




class Keys {
    
    constructor(){
        // Generate a new key pair and convert them to hex-strings
        this.key = ec.genKeyPair();
        this.privateKey = this.key.getPrivate('hex');
        this.publicKey  = this.key.getPublic('hex')
    }

    public(){
        return this.publicKey
    }
}

module.exports.Keys = Keys;