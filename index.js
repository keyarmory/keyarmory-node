var request = require('request');

module.exports = {

    encrypt: function() {
        request.get(
            {
                url: 'https://api.keyarmory.com/v1/encryption/token',
                headers: {
                    'x-api-key': 'f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b'
                }
            }, function(err, res, body) {
                var payload = JSON.parse(body).payload;

                var plain_text = Math.random().toString();
                var encrypted_data = crypt.encrypt(plain_text, payload.key);
                var encrypted_string = payload.key_id + ':' + payload.token + ':' + encrypted_data;

                db.fake_table
                    .create({
                        pt_data: plain_text,
                        ct_data: encrypted_string
                    });
            });
    },

    decrypt: function() {
        db.fake_table
            .findAll()
            .then(function(stuff) {
                stuff.forEach(function(thing) {
                    var pieces = thing.ct_data.split(':');
                    var key_id = pieces[0];
                    var token = pieces[1];
                    var encrypted_data = pieces[2];

                    request.post(
                        {
                            url: 'https://api.keyarmory.com/v1/encryption/key',
                            headers: {
                                'x-api-key': 'f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b'
                            },
                            form: {
                                key_id: key_id,
                                token: token
                            }
                        }, function(err, res, body) {
                            var payload = JSON.parse(body).payload;

                            var decrypted_data = crypt.decrypt(encrypted_data, payload.key);

                            console.log(decrypted_data);
                        });
                });
            });
    }

};