
var GENERATE_BUTTON = document.querySelector('#generate')
var DATA_INPUT = document.querySelector('#data')
var PASSKEY_INPUT = document.querySelector('#passkey')
var IV_INPUT = document.querySelector('#iv')
var SALT_INPUT = document.querySelector('#salt')
var ENCRYPT_BUTTON = document.querySelector('#encrypt-button')
var ENCRYPTED_SPAN = document.querySelector('#encrypted')

GENERATE_BUTTON.onclick = () => {
  genSalt()
  genIv()
}


ENCRYPT_BUTTON.onclick = () => {
  encrypt()
}

function genSalt() {
  SALT_INPUT.value = sjcl.codec.base64.fromBits(sjcl.random.randomWords(2,0))
}

function genIv () {
  IV_INPUT.value = sjcl.codec.base64.fromBits(sjcl.random.randomWords(4,0))
}

function encrypt () {
  var plainText = DATA_INPUT.value
  var passkey = PASSKEY_INPUT.value
  var iv = IV_INPUT.value
  var salt = SALT_INPUT.value

  var params = {
    'iv': iv,
    'salt': salt,
    // 'mode': 'ccm'
  }
  ENCRYPTED_SPAN.innerText =
    JSON.parse(sjcl.encrypt(passkey, plainText, params))['ct']
}