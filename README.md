# Decrypt (field plug-in)

![Screenshot](extras/readme-images/decrypt_plugin.png)

## Description
This field plug-in supports data decryption inside forms using [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard). First, you must encrypt data either with the [scto-encryption package](https://github.com/surveycto/scto-encryption) (which can be [uploaded into a server dataset and pre-loaded](https://support.surveycto.com/hc/en-us/articles/11854783867539-Guide-to-dataset-publishing)) or encrypt data using the [decrypt field plug-in](https://github.com/surveycto/decrypt) in order to decrypt it. 

Together with these other resources, the decrypt plug-in provides an upgrade in secure management of sensitive data that is used to identify individuals in the field. Learn more in [this guide](https://support.surveycto.com/hc/en-us/articles/33842170036499).

The gold standard for added security is still [form data encryption](https://support.surveycto.com/hc/en-us/articles/16472121582483). Use form data encryption to protect any data that is not being directly published to the server dataset.

*To use this field plug-in immediately, see [Getting started](#getting-started) below.*

[![](extras/readme-images/beta-release-download.jpg)](https://github.com/surveycto/decrypt/raw/main/decrypt.fieldplugin.zip)

*This plug-in is currently under beta. If you find a problem with the field plug-in, please email plug-in-feedback@surveycto.com.*

### Features

* Decrypt one or more pieces of data using one instance of the field plug-in.

Note: This field plug-in currently only supports AES-CBC decryption.

### Requirements

This field plug-in should work on most collection devices that support field plug-ins.

Use this field plug-in on a [*text* field](https://docs.surveycto.com/02-designing-forms/01-core-concepts/03a.field-types-text.html).

### Data format

This field returns the decrypted data in a list. The default separator in the list is a pipe `|`, but you can customize this. The order of the decrypted data will be the same as the order of the encrypted data provided to the [parameters](#parameters).

For example, let's say the first piece of decrypted data has a value of "Adnan", the second has a value of "31", and the third has a value of "1". The field value would be this:

```
Adnan|31|1
```

Use the [item-at() function](https://docs.surveycto.com/02-designing-forms/01-core-concepts/09.expressions.html#Help_Forms_item-at) to retrieve this data. For example, if the field with the field plug-in has the *name*, "decrypt", to retrieve the name (the first piece of data) from that list, use this expression:

```
item-at('|', ${decrypt}, 0)
```

If the encryption details are wrong due to an incorrect passkey, IV, salt, or ciphertext, the data will instead be the original input fed into the field plug-in parameters. That way, if the data is plaintext that has simply not been encrypted yet, you will still have that data.

When you reach the field, it will display your field *label* (and *hint* and media if you include them as well) at the top, followed by the results of the decryption. If the decryption was successful, it will say "Success". However, if decryption failed, it will say "Failed", followed by the reason for the decryption failure. It will do this for each piece of encrypted data it receives.

**Note**: If the provided encryption key, ciphertext, or IV are in the correct format, but one of those values is incorrect, then the decrypted data will be incorrect, and there will not be an error message. Make sure you always provide the correct decryption information.

#### Metadata

The metadata will be a pipe-separated list of the decryption status, in the same order as the data (similar to what appeared in the field *label*).

For example, let's say there are three pieces of input. The first two were decrypted successfully as `Bhavna` and `30`, but the third input was `0` (i.e. not a hidden, encrypted value). This would likely be the result of manually modifying the encrypted data file after encryption. The field data will be this:
```
Bhavna|30|0
```
And the field metadata will be this:
```
Success|Success|Failed: Missing IV. Unable to decrypt.
```
Use the [plug-in-metadata() function](https://docs.surveycto.com/02-designing-forms/01-core-concepts/09.expressions.html#plug-in-metadata) in your form in a [*calculate* field](https://docs.surveycto.com/02-designing-forms/01-core-concepts/03zb.field-types-calculate.html) to retrieve the metadata.

### Encrypting your data (IMPORTANT)

Each piece of encrypted data you provide to the field plug-in should consist of two parts: the ciphertext, followed by the IV. Each should be encoded using Base64 (NOT Base64URL), and separated by a pipe (`|`). Here is an example:

```
f5l2KcvRKodlSf6n06tqgQ==|XSFHs2RWb/w2bo5VC2+ipg==
```

Here, the ciphertext is `f5l2KcvRKodlSf6n06tqgQ==`, and the IV is `XSFHs2RWb/w2bo5VC2+ipg==`. You will feed that combined, pipe-separated value into the field plug-in, and if you provide the correct decryption key, the field plug-in will decrypt it for you.

You will provide this data to the field plug-in using the [parameters](#parameters).

#### Storing encrypted data in a CSV file

You can easily encrypt data using the [scto-encryption](https://github.com/surveycto/scto-encryption) Python package. You can create a CSV data with all of your data, and then encrypt that data with that Python package.

Once you have your CSV file with the encrypted data, you can [pre-load it](https://docs.surveycto.com/02-designing-forms/03-advanced-topics/03.preloading.html), and feed that data into the field plug-in. This is demonstrated in the [sample form](#getting-started). 

## How to use

### Getting started

**To use this field plug-in as-is:**

1. Download the [sample form](https://github.com/surveycto/decrypt/raw/main/extras/sample-form/Decryption%20field%20plug-in%20sample%20form.xlsx).
1. Download the [sample data](https://github.com/surveycto/decrypt/raw/main/extras/sample-form/encrypted_data.xlsx).
1. Download the [decrypt.fieldplugin.zip](https://github.com/surveycto/decrypt/raw/main/decrypt.fieldplugin.zip) field plug-in file.
1. Upload the sample form to your server with the sample data and field plug-in file as attachments.
1. If you choose to scan the encryption key, scan this QR code:

![](extras/readme-images/aes_key.png)

If you choose *Manual entry*, the *default* field value will be the example encryption key (i.e., you won't have to type it in. Do not modify the default value).

**Warning**: This is just an example, and you should **not** publicly share your encryption key like this. Nor should you hard-code the encryption key into your form design (this also nullifies the security benefit). You should use your own encryption key to encrypt and decrypt your data.

If you decide to use a QR code to store your encryption key, make sure that QR code is well-protected, since anyone who has access to the QR code and your form (whether on Collect or the server) can decrypt your data.

### Parameters

For named parameters, this field plug-in has 1 required parameter and 1 optional parameter.

In addition to the named parameters, add a parameter for each piece of ciphertext/IV. The name of the parameter can be anything (as long as they are unique). For example, let's say there are three form fields that store ciphertext: "enc_resp_name", "enc_age", and "enc_marital". You can give the field this *appearance*:

```
custom-decrypt(key=${key},
0=${enc_resp_name},
1=${enc_age},
2=${enc_marital})
```

The first parameter is the required parameter, while the second, third, and fourth parameters take the encrypted data (which, as discussed [above](#encrypting-your-data-important), includes both the ciphertext and IV). These parameters have the names "0", "1", and "2", but their names don't actually matter (as long as they are unique, e.g. you cannot have two parameters called "0"). This field's *value* will be the decrypted values of the fields "enc_name", "enc_age", and "enc_marital" in that order in a pipe-separated list.

Here are the named parameters:

|Name|Description|
|---|---|
|`key` (required)| The passkey that was used to encrypt the data, which will be used to decrypt the data. **This key must be Base64-encoded**. |
|`separator` (optional) | The separator used in the list returned by the field plug-in. This should be a value that does not exist in your decrypted data (but it can exist in the ciphertext). The default is a pipe character (`\|`). |

### Default SurveyCTO feature support

| Feature / Property | Support |
| --- | --- |
| Supported field type(s) | `text`|
| Default values | No |
| Constraint message | Uses default behavior |
| Required message | Uses default behavior |
| Read only | No |
| media:image | Yes |
| media:audio | Yes |
| media:video | Yes |
| `numbers` appearance | No |
| `numbers_decimal` appearance | No |
| `numbers_phone` appearance | No |

## More resources

* **Sample form**  
You can find a form definition in this repo here: [extras/sample-form](extras/sample-form).

* **Developer documentation**  
   * Python users can also check out our [`surveycto-encryption` package](https://github.com/surveycto/surveycto-encryption/blob/main/README.md) to help encrypt and decrypt data.
   * More instructions for developing and using field plug-ins can be found here: [https://github.com/surveycto/Field-plug-in-resources](https://github.com/surveycto/Field-plug-in-resources)
   * This field plug-in was developed using SubtleCrypto, which you can learn more about [here](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto).