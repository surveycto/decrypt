// https://davidmyers.dev/blog/a-practical-guide-to-the-web-cryptography-api

const generateKey = async () => {
  return window.crypto.subtle.generateKey({
    name: 'AES-GCM',
    length: 256,
  }, true, ['encrypt', 'decrypt'])
}

/*
* Turns a string into a Uint8Array so it can be encrypted.
* @param {String} data
* @return {Uint8Array} 
*/
const encode = (data) => {
  const encoder = new TextEncoder()
  return encoder.encode(data)
}

/*
* Generates an IV for encryption.
* @return {Uint8Array} 
*/
const generateIv = () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams
  return crypto.getRandomValues(new Uint8Array(12))
}

/*
* Turns a Uint8Array into a Base64 String. Used for transporting the IV.
* @param {Uint8Array} u8
* @return {String} 
*/
const uint8ArrayToBase64 = (u8) => {
  return btoa(String.fromCharCode.apply(null, u8))
}

/*
* Turns a Base64 string into a Uint8Array. Used for transporting the IV.
* @param {String} a
* @return {Uint8Array} 
*/
const base64ToUintArray = (a) => {
  return new Uint8Array(unpack(a))
}

/*
* Turns a string that is URL-safe Base64-encoded into a more standard Base64-encoded string.
* @param {String} base64
* @return {String} 
*/
function urlSafeToB64 (base64) {
  return base64.replaceAll('-', '+').replaceAll('_', '/')
}

/*
* Turns an ArrayBuffer into a Base64-encoded String.
* @param {ArrayBuffer} buffer
* @return {String} 
*/
const pack = (buffer) => {
  return btoa(
    String.fromCharCode.apply(null, new Uint8Array(buffer))
  )
}

/*
* Turns a Base64-encoded String into an ArrayBuffer.
* @param {String} base64
* @return {ArrayBuffer} 
*/
const unpack = (packed) => {
  const string = atob(urlSafeToB64(packed))
  const buffer = new ArrayBuffer(string.length)
  const bufferView = new Uint8Array(buffer)
  for (let i = 0; i < string.length; i++) {
    bufferView[i] = string.charCodeAt(i)
  }
  return buffer
}

/*
* Turns an ArrayBuffer into human-readable string.
* @param {ArrayBuffer} bytestream
* @return {String} 
*/
const decode = (bytestream) => {
  const decoder = new TextDecoder()
  return decoder.decode(bytestream)
}

/*
* Turns a Base64-encoded key into a CryptoKey object. If it is already an object, it just returns the key that was given. 
* @param {String} key
* @param {String} algorithm: The algorithm being used.
* @return {CryptoKey} 
*/
async function keyFromB64 (key, algorithm = 'AES-GCM') {
  const keyType = typeof key
  switch (keyType) {
    case 'string': {
      return await crypto.subtle.importKey(
        'raw',
        unpack(key),
        algorithm,
        true,
        ['encrypt', 'decrypt']
      )
    } case 'object': {
      return key
    } default: {
      throw `Invalid key type "${keyType}".`
    }
  }
}

async function b64FromKey(key) {
  return pack(await crypto.subtle.exportKey('raw', key))
}

/*
* Encrypts data using the given key. 
* @param {String} data: The data that will be encrypted.
* @param {CryptoKey, String} key: Encryption key used to encrypt the data. It can be either a CryptoKey object that is all prepared, or a Base64-encoded key as a String that the function will turn into a CryptoKey object.
* @return {Array[String]} First item is the ciphertext, second is the IV. Both are Base64-encoded strings.
*/
const encrypt = async (data, key) => {
  key = await keyFromB64(key)
  const encoded = encode(data)
  const iv = generateIv()
  const cipher = await window.crypto.subtle.encrypt({
    name: 'AES-GCM',
    iv: iv,
  }, key, encoded)
  return [
    pack(cipher),
    uint8ArrayToBase64(iv),]

}

/*
* Decrypts data using the given key. 
* @param {String} ciphertext: The data that will be decrypted.
* @param {CryptoKey, String} key: Encryption key used to encrypt the data, which will now be used to decrypt the data. It can be either a CryptoKey object that is all prepared, or a Base64-encoded key as a String that the function will turn into a CryptoKey object.
* @param {String} iv: The IV that was used to encrypt the data.
* @return {CryptoKey} 
*/
const decrypt = async (ciphertext, key, iv) => {
  // try {
  var encoded = await crypto.subtle.decrypt({
    name: 'AES-GCM',
    iv: base64ToUintArray(iv),
  }, await keyFromB64(key), unpack(ciphertext))

  // } catch (e) {
  //   console.log('Error:')
  //   console.log(e)
  //   return
  // }
  // const encoded = await window.cr
  return decode(encoded)
}