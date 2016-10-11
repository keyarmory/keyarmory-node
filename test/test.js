require('should');

var assert = require('assert');
var nock = require('nock');

var keyarmory = require('../index')({
    api_key: 'mykey'
});

nock(keyarmory.base_url)
    .get('/encryption/token')
    .reply(200, JSON.stringify({
        name: 'Key Armory API',
        version: 1,
        timestamp: '2016-07-30T20:24:14+00:00',
        status: 'ok',
        payload: {
            token: 'Hu1diMt2Eox8MKnVwtieHq6HDqG0gH/ZzWiJjC0jUAjvPUin76uhHU8NQelYkIIzrhrYyTKmmh0M/A5iRT4xSZWnpDMeG72Jw0EH/+wQ3Uk=',
            key: '996cbbe55d67340f9a12986e79921586fa2ebd6b565831821bd612dacf360840',
            key_id: 1
        }
    }));

nock(keyarmory.base_url)
    .get('/encryption/key?key_id=1&token=Hu1diMt2Eox8MKnVwtieHq6HDqG0gH/ZzWiJjC0jUAjvPUin76uhHU8NQelYkIIzrhrYyTKmmh0M/A5iRT4xSZWnpDMeG72Jw0EH/+wQ3Uk=')
    .reply(200, JSON.stringify({
        name: 'Key Armory API',
        version: 1,
        timestamp: '2016-07-30T20:24:14+00:00',
        status: 'ok',
        payload: {
            key: '996cbbe55d67340f9a12986e79921586fa2ebd6b565831821bd612dacf360840'
        }
    }));

describe('keyarmory', function() {
    it('should encrypt and then decrypt', function(done) {
        var data_to_encrypt = 'ohhh sooo secret!!! :)';

        return keyarmory
            .encrypt(data_to_encrypt)
            .then(function(encrypted_string) {
                encrypted_string.length.should.equal(155);

                return keyarmory
                    .decrypt(encrypted_string)
                    .then(function(plain_text) {
                        plain_text.should.equal(data_to_encrypt);
                        done();
                    })
            })
            .catch(function(err) {
                done(new Error(err.toString()));
            });
    });
});