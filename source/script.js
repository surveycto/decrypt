/* global setAnswer, fieldProperties, setMetaData */

var parameters = fieldProperties.PARAMETERS

var cipherData = []

var numParameters = parameters.length

// GET PARAMETERS
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

// MAIN FUNCTION
decryptAll()

/*
* Decrypt a single piece of ciphertext data.
* @param {String} ciphertext: Data to decrypt.
* @param {String} IV: IV used in encryption.
* @param {String} key: AES Base64-encoded encryption key.
* @param {String} mode: Encryption mode. (Currently unused.)
* @return {String} Plaintext data.
*/
async function decrypt (ciphertext, iv, key, mode = 'cbc') {
  return await subtleDecrypt(ciphertext, iv, key)
}

// Go through each parameter with ciphertext data to be decrypted, and decrypt it.
async function decryptAll () {
  var plaintext = []
  var displayHtml = []
  var results = []

  // Used for saving the results to metadata and displaying them to the enumerator.
  const addResult = (d) => {
    results.push(d)
    displayHtml.push(`<li>${d}</li>`)
  }

  // Go through each piece of ciphertext, and decrypt it.
  for (var c = 0; c < cipherData.length; c++) {
    let d = cipherData[c].split('|')
    if (d.length < 2) {
      plaintext.push(d)
      addResult('Failed: Missing IV. Unable to decrypt.')
      continue
    }
    try {
      var pt = await decrypt(d[0], d[1], passkey)
      plaintext.push(pt)
      addResult('Success')
    } catch (e) {
      if (['EncodingError', 'EncryptionError'].includes(e.name)) {
        plaintext.push(d)
        addResult(`Failed: ${e.message}`)
      } else {
        plaintext.push(d)
        addResult(`Unexpected error:<br>Name: ${e.name}<br>Message: ${e.message}<br>Stack: ${e.stack}`)
      }
    }
  }

  setAnswer(plaintext.join(separator))
  setMetaData(results.join('|'))
  document.querySelector('#decrypted').innerHTML = displayHtml.join('\n')
}
