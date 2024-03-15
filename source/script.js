/* global setAnswer, fieldProperties */

var fieldProperties = {
  CURRENT_ANSWER: '',
  READONLY: false,
  PARAMETERS: [
    {
      "key": "key",
      "value": 'RQmHY+vQ5UQOeufZZQHZhg=='
    },
    {
      "key": "ciphertext",
      "value": "f5l2KcvRKodlSf6n06tqgQ==|XSFHs2RWb/w2bo5VC2+ipg=="
    }
  ]
}

function setAnswer (a) {
  console.log('New answer:')
  console.log(a)
}

var parameters = fieldProperties.PARAMETERS

var cipherData = []

var numParameters = parameters.length

var passkey
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

  const addWarning = (d) => {
    plaintext.push(d)
    displayHtml.push(`<p>${d}</p>`)
  }

  for (var c = 0; c < cipherData.length; c++) {
    let d = cipherData[c].split('|')
    if (d.length < 2) {
      addWarning('Failed: Missing IV. Unable to decrypt.')
      continue
    }
    try {
      var pt = await decrypt(d[0], d[1], passkey)
      plaintext.push(pt)
      displayHtml.push('<p>Success</p>')
    } catch (e) {
      if (['EncodingError', 'EncryptionError'].includes(e.name)) {
        addWarning(`Failed: ${e.message}`)
      } else {
        console.log('Other error')
        throw e
      }
    }
  }

  setAnswer(plaintext.join(separator))
  document.querySelector('#decrypted').innerHTML = displayHtml.join('\n')
}

async function decrypt (ciphertext, iv, key, mode = 'cbc') {
  return await subtleDecrypt(ciphertext, iv, key)
}
