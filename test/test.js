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
            token: 'YH9VFJGzdsHmYrTw85CWcd4YBYpaC64NBrPIxmB+tIUTuCsrDo73Ey3F3JWa93ln',
            key: '7ac8945b-b75e-408c-89fa-90bef40ab43e',
            key_id: 1
        }
    }));

nock(keyarmory.base_url)
    .post('/encryption/key')
    .reply(200, JSON.stringify({
        name: 'Key Armory API',
        version: 1,
        timestamp: '2016-07-30T20:24:14+00:00',
        status: 'ok',
        payload: {
            key: '7ac8945b-b75e-408c-89fa-90bef40ab43e'
        }
    }));

describe('keyarmory', function() {
    it('should encrypt and then decrypt', function(done) {
        var data_to_encrypt = 'ohhh sooo secret!!! :)';

        return keyarmory
            .encrypt(data_to_encrypt)
            .then(function(encrypted_string) {
                encrypted_string.length.should.equal(111);

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