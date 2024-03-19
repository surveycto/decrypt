# Best practices for encryption in SurveyCTO

The [decrypt](../README.md) field plug-in is meant to *supplement* SurveyCTO security features, NOT replace them. This field plug-in requires entering a long, seemingly random key to decrypt data that will have to be written down somewhere so enumerators can enter it (such as stored in a QR code), and malicious actors can potentially steal or take a picture of that key, and decrypt your data.

Because of that, make sure you are taking advantage of SurveyCTO's main security features:

* Enforce device security settings from the server, such as requiring device encryption and a device passcode. You can learn more in our documentation [Managing device security](https://docs.surveycto.com/03-collecting-data/01-mobile-data-collection/05b.managing-device-security.html).
* Use in-transit encryption. This is used by default by SurveyCTO Collect and web forms, and you do not have to turn it on (and it cannot be turned off by accident). Before data is sent to a collection device, that data is encrypted, and it is not decrypted until it reaches the collection device.
* Ensure only authorized users have access to data using teams and user roles. You can learn more about teams in our support article [How to manage your teams](https://support.surveycto.com/hc/en-us/articles/16472107311763), and you can learn more about user roles in our documentation [Managing user roles](https://docs.surveycto.com/04-monitoring-and-management/01-the-basics/00b.managing-user-roles.html).

With these features, data is encrypted both at-rest and in-tranist, and only authorized users can access it.

You can also check out our support article [Best practices for configuring and securing enumerator devices](https://support.surveycto.com/hc/en-us/articles/360048708614).