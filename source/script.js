// /* global setAnswer, fieldProperties */

// var fieldProperties = {
//   CURRENT_ANSWER: '',
//   READONLY: false,
//   PARAMETERS: [
//     {
//       "key": "key",
//       // "value": 'J0UhmAygFQY6OnVAEug5tg=='
//       "value": 'J0UhmAygFQY6OnVAEug5tg='
//     },
//     {
//       "key": "iv",
//       "value": "gIiYTz5exF2q4Pw0bL5oKg=="
//     },
//     {
//       "key": "ciphertext",
//       "value": "S+iTPOq1mSx4PQrcLyTcqA=="
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
var separator = '|'
for (var p = 0; p < numParameters; p++) {
  var pa = parameters[p]
  var key = pa['key']
  var value = pa['value']
  switch (key) {
    case 'key': {
      passkey = value
      break
    }
    case 'iv': {
      iv = value
      break
    }
    case 'separator': {
      separator = value
      break
    }
    default: {
      cipherData.push(value)
    }
  }
}

decryptAll()

async function decryptAll () {
  var plaintext = []
  var displayHtml = []
  for (var c = 0; c < cipherData.length; c++) {
    let decrypted = await decrypt(cipherData[c], passkey, iv)
    plaintext.push(decrypted)
    displayHtml.push(`<p>${decrypted}</p>`)
  }

  setAnswer(plaintext.join(separator))

  document.querySelector('#decrypted').innerHTML = displayHtml.join('\n')
}

async function decrypt (ciphertext, key, iv, mode = 'cbc') {
  // try {
  return await subtleDecrypt(ciphertext, key, iv)
  // } catch (e) {
  //   if (e['message'].indexOf('tag doesn\'t match') > -1) {
  //     return '(Unable to decrypt. Please check your passkey and other encryption details.)'
  //   } else {
  //     throw e
  //   }
  // }
}
