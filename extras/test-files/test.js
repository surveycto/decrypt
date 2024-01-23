class AesKey {
  constructor (key, iv) {
    this.key = key
    this.iv = iv
  }

  getPlainKey () {
    return this.key.toString(CryptoJS.enc.Utf8)
  }

  static newKey (secret) {
    var key = CryptoJS.enc.Utf8.parse(secret);
    var iv = CryptoJS.lib.WordArray.create(key.words.slice(0, 4));
    return new AesKey(secret, iv)
  }
}

var ENCRYPTED_INPUT = document.querySelector('#encrypted')
var DECRYPT_BUTTON = document.querySelector('#decrypt')

DECRYPT_BUTTON.onclick = decryptData
DECRYPT_BUTTON.click()

// https://medium.com/@adarsh-d/aes-encryption-and-decryption-in-javascript-using-cryptojs-81b57205711d

function encrypt (plainText, aesKey) {
  // Encrypt the plaintext
  var cipherText = CryptoJS.AES.encrypt(plainText, aesKey.getPlainKey(),
    {
      iv: aesKey.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );
  return cipherText.toString();
}

function decrypt (cipherText, aesKey) {
  // IV is a base64 string
  let iv1 = aesKey.iv
  var key = aesKey.getPlainKey()

  var decrypted = CryptoJS.AES.decrypt(cipherText, key,
    {
      iv: iv1,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
}


function decryptData () {
  var data = ENCRYPTED_INPUT.value
  var secret = 'This is my code'
  var aesKey = AesKey.newKey(secret)
  var encryptedData = encrypt(data, aesKey)
  var decryptedData = decrypt(encryptedData, aesKey)
  console.log(data)
  console.log(encryptedData)
  console.log(decryptedData)
  var encryptedData = CryptoJS.AES.encrypt(data, secret)
  var decryptedDataRaw = CryptoJS.AES.decrypt(encryptedData, secret)
  var decryptedData = decryptedDataRaw.toString(CryptoJS.enc.Utf8)
  console.log('\n')
  console.log(data)
  console.log(encryptedData.toString())
  console.log(decryptedData)
}