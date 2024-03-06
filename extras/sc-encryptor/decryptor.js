const CIPHER_TEXT = document.querySelector('#ct')
const PASSKEY = document.querySelector('#passkey')
const IV = document.querySelector('#iv')
const DECRYPT_BUTTON = document.querySelector('#decrypt-button')
const DECRYPTED = document.querySelector('#decrypted')

DECRYPT_BUTTON.onclick = async () => {
  var ct = CIPHER_TEXT.value
  var key = PASSKEY.value
  var iv = IV.value
  var d = await decrypt(
    ct,
    key,
    iv,
    'AES-CBC'
    )
  console.log(d)
}
// DECRYPT_BUTTON.click()