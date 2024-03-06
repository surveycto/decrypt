// https://davidmyers.dev/blog/a-practical-guide-to-the-web-cryptography-api


var GENERATE_BUTTON = document.querySelector('#generate')
var DATA_INPUT = document.querySelector('#data')
var PASSKEY_INPUT = document.querySelector('#passkey')
var IV_INPUT = document.querySelector('#iv')
var SALT_INPUT = document.querySelector('#salt')
var ENCRYPT_BUTTON = document.querySelector('#encrypt-button')
var ENCRYPTED_SPAN = document.querySelector('#encrypted')

// GENERATE_BUTTON.onclick = () => {
//   genSalt()
//   genIv()
// }


ENCRYPT_BUTTON.onclick = async () => {
  var key = await generateKey()
  console.log('Key:')
  console.log(key)
  console.log(await crypto.subtle.exportKey('raw', key))
  // console.log(await crypto.subtle.exportKey('pkcs8', key))
  console.log(await crypto.subtle.exportKey('jwk', key))
  console.log(await crypto.subtle.exportKey('spki', key))

  var e = await encrypt(DATA_INPUT.value, key)
  console.log(e)
  var d = await decrypt(e[0], key, e[1])
  console.log(d)
}

ENCRYPT_BUTTON.click()