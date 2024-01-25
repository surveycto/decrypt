# Decrypt (field plug-in)

## Description

Use this field plug-in to decrypt data that was encrypted using AES.

**Warning**: This field plug-in is for demonstration purposes. While it does use AES symmetric encryption, which is the standard encryption method used across the internet, it does not use all of the features that make AES so secure, such as long encryption keys.

Currently, the best way to secure SurveyCTO server dataset data is to use existing SurveyCTO security features:

* Enforce device security settings from the server, such as requiring device encryption and a device passcode. You can learn more in our documentation [Managing device security](https://docs.surveycto.com/03-collecting-data/01-mobile-data-collection/05b.managing-device-security.html).
* Ensure only authorized users have access to data using teams and user roles. You can learn more about teams in our support article [How to manage your teams](https://support.surveycto.com/hc/en-us/articles/16472107311763-How-to-manage-your-teams), and you can learn more about user roles in our documentation [Managing user roles](https://docs.surveycto.com/04-monitoring-and-management/01-the-basics/00b.managing-user-roles.html).

[![](extras/readme-images/beta-release-download.jpg)](https://github.com/surveycto/decrypt/raw/main/decrypt.fieldplugin.zip)


*This plug-in is currently under beta. If you you find a problem with the field plug-in, please email support@surveycto.com, or submit an issue to this GitHub repo.*

### Features

* Decrypt data encrypted using AES.
* Decrypt multiple pieces of data in one field plug-in.

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

If the encryption details are wrong due to an incorrect passkey, IV, salt, or ciphertext, the data will instead say "(Unable to decrypt. Please check your passkey and other encryption details.)".

When you reach the field, it will say "Decrypted data:" in at the top, followed by the decrypted data in a linebreak-separated list. (The field *label* is not actually used.)

## How to use

### Getting started

**To use this field plug-in as-is:**

1. Download the [sample form](https://github.com/scto-sandbox/decrypt/raw/main/extras/sample-form/Decryption%20sample%20form.xlsx).
1. Download the [sample data](https://github.com/scto-sandbox/decrypt/raw/main/extras/sample-form/encrypted_data.xlsx).
1. Download the [decrypt.fieldplugin.zip](https://github.com/scto-sandbox/decrypt/raw/main/decrypt.fieldplugin.zip) field plug-in file.
1. Upload the sample form to your server with the sample data and field plug-in file as attachments.
1. When filling out the form, when prompted for the passkey, enter `password`.

### Parameters

For named parameters, this field plug-in has 3 required parameters and 1 optional parameter.

Add a parameter for each piece of ciphertext. The name of the parameter can be anything. For example, let's say there are three form fields that store ciphertext: "enc_name", "enc_age", and "enc_marital". You can give the field this *appearance*:

```
custom-decrypt(passkey=${passkey}, iv=${iv}, salt=${salt},
n=${enc_name}, a=${enc_age}, m=${enc_marital})
```

The first three parameters are the required parameters, while the fourth, fifth, and sixth parameters take the encrypted data. These parameters have the names "n", "a", and "m", but their names don't actually matter. The field *value* will be the decrypted values of the fields "enc_name", "enc_age", and "enc_marital" in that order in a pipe-separated list.

Here are the named parameters:

|Name|Description|
|---|---|
|`passkey` (required)| The passkey that was used to encrypt the data, which will be used to decrypt the data. |
|`iv` (required)| The initialization vector (IV) that was used to encrypt the data, which will be used to decrypt the data. |
|`salt` (required) | The salt that was used to encrypt the data, which will be used to decrypt the data. |
|`separator` (optional) | The separator used in the list returned by the field plug-in. This should be a value that does not exist in your decrypted data (but it can exist in the ciphertext).<br>**Default**: `\|` |

### Default SurveyCTO feature support

| Feature / Property | Support |
| --- | --- |
| Supported field type(s) | `text`|
| Default values | No |
| Constraint message | Uses default behavior |
| Required message | Uses default behavior |
| Read only | No |
| media:image | No |
| media:audio | No |
| media:video | No |
| `numbers` appearance | No |
| `numbers_decimal` appearance | No |
| `numbers_phone` appearance | No |

## More resources

* **Sample form**  
You can find a form definition in this repo here: [extras/sample-form](extras/sample-form).

* **Encryptor**  
For help encrypting your data, check out the [encryptor tool](/extras/encryptor/) in this repo.

* **Developer documentation**  
   * More instructions for developing and using field plug-ins can be found here: [https://github.com/surveycto/Field-plug-in-resources](https://github.com/surveycto/Field-plug-in-resources)
   * This field plug-in was developed using the [Stanford Javascript Crypto Library (SJCL)](https://crypto.stanford.edu/sjcl/), which you can learn more about [here](https://bitwiseshiftleft.github.io/sjcl/).