# Decrypt (field plug-in)

## Description

Use this field plug-in to decrypt data that was encrypted using AES.

Currently, the best way to secure SurveyCTO server dataset data is to use existing SurveyCTO security features, which you can read about [here](/extras/best_encryption.md]).

However, if you would like an extra level of security, you can also encrypt your CSV data and server dataset data using your own AES encryption key.

[![](extras/readme-images/beta-release-download.jpg)](https://github.com/scto-sandbox/decrypt/raw/main/decrypt.fieldplugin.zip)

*This plug-in is currently under beta. If you you find a problem with the field plug-in, please email support@surveycto.com, or submit an issue to this GitHub repo.*

### Features

* Decrypt data encrypted using AES, an extremely popular and secure encryption standard.
* Decrypt multiple pieces of data in one field plug-in.

Note: This field plug-in currently only supports AES-CBC decryption. If popular enough, we could add other modes, such as AES-GCM. If you don't know what those are, don't worry, you don't have to know them to use this field plug-in.

### Requirements

This field plug-in should work on most collection devices that support field plug-ins.

### Data format

This field returns the decrypted data in a list. The default separator in the list is a pipe `|`, but you can customize this. The order of the decrypted data will be the same as the order of the encrypted data stored in the [parameters](#parameters).

For example, let's say the first piece of decrypted data has a value of "Adnan", the second has a value of "31", and the third has a value of "1". The field value would be this:

```
Adnan|31|1
```

Use the [item-at() function](https://docs.surveycto.com/02-designing-forms/01-core-concepts/09.expressions.html#Help_Forms_item-at) to retrieve this data. For example, if the field with the field plug-in has the *name* "decrypted", to retrieve the name (the first piece of data) from that list, use this expression:

```
item-at('|', ${decrypted}, 0)
```

If the encryption details are wrong due to an incorrect passkey, IV, salt, or ciphertext, the data will instead be an error message about why the data could not be decrypted.

When you reach the field, it will display your field *label* (and *hint* and media if you include them as well) at the top, followed by the results of the decryption. If the decryption was successful, it will say "Success". However, if decryption failed, it will say "Failed", followed by the reason for the decryption failure. It will do this for each piece of encrypted data it receives.

Note: If the provided IV is in the correct format, but the value itself is incorrect, then the decrypted data will be incorrect, and there will not be an error message. Make sure you always provide the correct decryption information.

### Encrypting your data (IMPORTANT)

Each piece of encrypted data you provide to the field plug-in should consist of two parts: the ciphertext, followed by the IV. Each should be encoded using Base64 (NOT Base64URL), and separated by a pipe (`|`). Here is an example:

```
f5l2KcvRKodlSf6n06tqgQ==|XSFHs2RWb/w2bo5VC2+ipg==
```

Here, the ciphertext is `f5l2KcvRKodlSf6n06tqgQ==`, and the IV is `XSFHs2RWb/w2bo5VC2+ipg==`. You will feed that combined, pipe-separated value into the field plug-in, and if you provide the correct decryption key, the field plug-in will decrypt it for you.

#### Storing encrypted data in a CSV file

You can easily encrypt data using the [**scto-encryption**](https://github.com/surveycti/scto-encryption) Python package. You can create a CSV data with all of your data, and then encrypt that data with that Python package.

Once you have your CSV file with the encrypted data, you can [pre-load it](https://docs.surveycto.com/02-designing-forms/03-advanced-topics/03.preloading.html), and feed that data into the field plug-in. This is demonstrated in the [sample form](#getting-started). 

## How to use

### Getting started

**To use this field plug-in as-is:**

1. Download the [sample form](https://github.com/scto-sandbox/decrypt/raw/main/extras/sample-form/Decryption%20field%20plug-in%20sample%20form.xlsx).
1. Download the [sample data](https://github.com/scto-sandbox/decrypt/raw/main/extras/sample-form/encrypted_data.xlsx).
1. Download the [decrypt.fieldplugin.zip](https://github.com/scto-sandbox/decrypt/raw/main/decrypt.fieldplugin.zip) field plug-in file.
1. Upload the sample form to your server with the sample data and field plug-in file as attachments.
1. If you choose to scan the encryption key, scan this QR code:

![](extras/readme-images/aes_key.png)

If you choose *Manual entry*, the *default* field value will be the example encryption key.

**Warning**: This is just an example, and you should **not** publicly share your encryption key like this. You should use your own encryption key to encrypt and decrypt your data.

### Parameters

For named parameters, this field plug-in has 1 required parameter and 1 optional parameter.

In addition to the named parameters, add a parameter for each piece of ciphertext/IV. The name of the parameter can be anything. For example, let's say there are three form fields that store ciphertext: "enc_name", "enc_age", and "enc_marital". You can give the field this *appearance*:

```
custom-decrypt(key=${key},
c1=${enc_resp_name},
c2=${enc_age},
c3=${enc_marital})
```

The first parameter is the required parameter, while the second, third, and fourth parameters take the encrypted data (which, as discussed [above](#encrypting-your-data-important), includes both the ciphertext and IV). These parameters have the names "c1", "c2", and "c3", but their names don't actually matter. This field's *value* will be the decrypted values of the fields "enc_name", "enc_age", and "enc_marital" in that order in a pipe-separated list.

Here are the named parameters:

|Name|Description|
|---|---|
|`key` (required)| The passkey that was used to encrypt the data, which will be used to decrypt the data. |
|`separator` (optional) | The separator used in the list returned by the field plug-in. This should be a value that does not exist in your decrypted data (but it can exist in the ciphertext).<br>**Default**: `\|` |

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
   * More instructions for developing and using field plug-ins can be found here: [https://github.com/surveycto/Field-plug-in-resources](https://github.com/surveycto/Field-plug-in-resources)
   * This field plug-in was developed using SubtleCrypto, which you can learn more about [here](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto).