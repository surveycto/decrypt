// class AesKey {
//   constructor (key, iv) {
//     this.key = key
//     this.iv = iv
//   }

//   getPlainKey () {
//     return this.key.toString(CryptoJS.enc.Utf8)
//   }

//   // static newKey (secret) {
//   //   var key = CryptoJS.enc.Utf8.parse(secret);
//   //   var iv = CryptoJS.lib.WordArray.create(key.words.slice(0, 4));
//   //   return new AesKey(secret, iv)
//   // }
// }

var ENCRYPTED_INPUT = document.querySelector('#encrypted')
var DECRYPT_BUTTON = document.querySelector('#decrypt')

DECRYPT_BUTTON.onclick = decryptData
DECRYPT_BUTTON.click()

// https://medium.com/@adarsh-d/aes-encryption-and-decryption-in-javascript-using-cryptojs-81b57205711d

function encrypt (plainText, password) {
  return sjcl.encrypt("password", plainText)
}

function decrypt (cipherText, password) {
  return sjcl.decrypt("password", cipherText)
}


function decryptData () {
  var data = ENCRYPTED_INPUT.value
  console.log(data)
  var password = 'This is the password'
  // var aesKey = AesKey.newKey(secret)
  var encryptedData = encrypt(data, password)
  console.log(encryptedData)
  var decryptedData = decrypt(encryptedData, password)
  console.log(decryptedData)
}