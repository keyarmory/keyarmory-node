## Key Armory client library for node.js

This is the official node.js client library for the Key Armory Encryption Key Orchestration Service. You'll first need an account by going to https://keyarmory.com. Follow the instructions to set up a project and key pool and then place the API Key you receive in the initialization script below.

### Installation
```
npm install keyarmory
```

### Initialization
```js
var keyarmory = require('keyarmory')({
    api_key: 'your_api_key_here'
});
```

### Encryption
```js
keyarmory
    .encrypt(your_data)
    .then(ct_string => {
        // save ct_string in db, or wherever
    });
```

### Decryption
```js
keyarmory
    .decrypt(ct_string) // <-- from db, or wherever
    .then(your_data => {
        // do something
    });
```
