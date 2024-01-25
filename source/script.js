/* global getMetaData, setMetaData, setAnswer, goToNextField, fieldProperties, getPluginParameter */

// var fieldProperties = {
//   CURRENT_ANSWER: '',
//   READONLY: false,
//   PARAMETERS: [
//     {
//       "key": "passkey",
//       "value": 'My passkey'
//     },
//     {
//       "key": "iv",
//       "value": "+8ABSnmUTxyPMECzId0shQ=="
//     },
//     {
//       "key": "salt",
//       "value": "ZJSalWToHy0="
//     },
//     {
//       "key": "ciphertext",
//       "value": "tw8+DLFuhi0YhrBHjoGN"
//     }
//   ]
// }

// function setAnswer (a) {
//   console.log('New answer:')
//   console.log(a)
// }

var parameters = fieldProperties.PARAMETERS

var cipherData = []

var numParameters = parameters.length

var passkey
var iv
var salt = ''
var separator = '|'
for (var p = 0; p < numParameters; p++) {
  var pa = parameters[p]
  var key = pa['key']
  var value = pa['value']
  if (key == 'passkey') {
    passkey = value
  } else if (key == 'iv') {
    iv = value
  } else if (key == 'salt') {
    salt = value
  } else if (key == 'separator') {
    separator = value
  } else {
    cipherData.push(value)
  }
}

var plaintext = []
var displayHtml = []
for (var c = 0; c < cipherData.length; c++) {
  var decrypted = decrypt(cipherData[c], passkey, iv, salt)
  plaintext.push(decrypted)
  displayHtml.push(`<p>${decrypted}</p>`)
}

setAnswer(plaintext.join(separator))

document.querySelector('#decrypted').innerHTML = displayHtml.join('\n')

function decrypt (cipherText, passkey, iv, salt = '', mode = 'ccm') {
  var dData = {
    'iv': iv,
    'ct': cipherText,
    'salt': salt,
    'mode': mode
  }
  try {
    return sjcl.decrypt(passkey, JSON.stringify(dData))
  } catch (e) {
    if (e['message'].indexOf('tag doesn\'t match') > -1) {
      return '(Unable to decrypt. Please check your passkey and other encryption details.)'
    } else {
      throw e
    }
  }
}
