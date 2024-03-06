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
  console.log(base64)
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

async function keyFromB64 (key, algorithm = 'AES-GCM') {
console.log(key)
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



const encrypt = async (data, key) => {
  key = await keyFromB64(key)
  console.log(key)
  const encoded = encode(data)
  const iv = generateIv()
  const cipher = await window.crypto.subtle.encrypt({
    name: 'AES-GCM',
    iv: iv,
  }, key, encoded)
  console.log('Encryption results:')
  console.log(cipher)
  console.log(iv)
  console.log(pack(cipher))
  console.log(uint8ArrayToBase64(iv))
  console.log([
    pack(cipher),
    uint8ArrayToBase64(iv),])
  return [
    pack(cipher),
    uint8ArrayToBase64(iv),]
  // return [cipher, iv]

}

const decrypt = async (ciphertext, key, iv) => {
  // try {
  console.log('Decrypting')
  console.log(ciphertext)
  console.log(key)
  console.log(iv)
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
  console.log('Complete:')
  console.log(encoded)
  return decode(encoded)
}