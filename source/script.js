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

async function decrypt (ciphertext, iv, key, mode = 'cbc') {
  return await subtleDecrypt(ciphertext, iv, key)
}

async function decryptAll () {
  var plaintext = []
  var displayHtml = []

  const addWarning = (d) => {
    plaintext.push(d)
    displayHtml.push(`<li>${d}</li>`)
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
      displayHtml.push('<li>Success</li>')
    } catch (e) {
      if (['EncodingError', 'EncryptionError'].includes(e.name)) {
        addWarning(`Failed: ${e.message}`)
      } else {
        addWarning(`Unexpected error:<br>Name: ${e.name}<br>Message: ${e.message}<br>Stack: ${e.stack}`)
      }
    }
  }

  setAnswer(plaintext.join(separator))
  document.querySelector('#decrypted').innerHTML = displayHtml.join('\n')
}
