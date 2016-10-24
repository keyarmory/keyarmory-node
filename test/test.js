require('should');

var assert = require('assert');

var keyarmory = require('../index')({
    api_key: 'f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b'
});

describe('keyarmory', function() {
    it('should encrypt and then decrypt', function() {
        this.timeout(10000);

        var data_to_encrypt = 'ohhh sooo secret!!! :)';

        return keyarmory
            .encrypt(data_to_encrypt)
            .then(function(encrypted_string) {
                assert(encrypted_string);

                return keyarmory
                    .decrypt(encrypted_string)
                    .then(function(plain_text) {
                        assert(plain_text == data_to_encrypt, 'Text doesn\'t match');
                    });
            });
    });
});