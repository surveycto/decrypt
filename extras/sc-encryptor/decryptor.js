const CIPHER_TEXT = document.querySelector('#ct')
const PASSKEY = document.querySelector('#passkey')
const IV = document.querySelector('#iv')
const DECRYPT_BUTTON = document.querySelector('#decrypt-button')
const DECRYPTED = document.querySelector('#decrypted')

DECRYPT_BUTTON.onclick = async () => {
  var ct = unpack(CIPHER_TEXT.value)
  var key = await keyFromB64(PASSKEY.value)
  var iv = unpack(IV.value)
  var d = await decrypt(
    ct,
    key,
    iv
    )
  console.log(d)
}
// DECRYPT_BUTTON.click()