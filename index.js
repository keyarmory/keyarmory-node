var crypto = require('crypto');
var request = require('request-promise');
var q = require('q');

var util = {

    encrypt: function(data, key) {
        var cipher = crypto.createCipher('aes-256-cbc', key);
        var hash = cipher.update(data, 'utf8', 'base64');
        hash += cipher.final('base64');

        return hash;
    },

    decrypt: function(data, key) {
        var decipher = crypto.createDecipher('aes-256-cbc', key);
        var decrypted_data = decipher.update(data, 'base64', 'utf8');
        decrypted_data += decipher.final('utf8');

        return decrypted_data;
    }

};

var keyarmory = function(options) {
    this.api_key = options.api_key;
    this.base_url = 'https://api.keyarmory.com/v1';

    if (!this.api_key) throw new Error('Key Armory API Key Required');
};

keyarmory.prototype.encrypt = function(data) {
    return request
        .get({
            url: this.base_url + '/encryption/token',
            headers: {
                'x-api-key': this.api_key
            },
            resolveWithFullResponse: true,
            simple: false
        })
        .then(function(res) {
            var payload = JSON.parse(res.body).payload;

            var encrypted_data = util.encrypt(data, payload.key);

            return 'ka:' + payload.key_id + ':' + payload.token + ':' + encrypted_data;
        });
};

keyarmory.prototype.decrypt = function(encrypted_string) {
    var pieces = encrypted_string.split(':');
    var key_id = pieces[1];
    var token = pieces[2];
    var encrypted_data = pieces[3];

    return request
        .get({
            url:
                this.base_url + '/encryption/key' +
                '?key_id=' + key_id +
                '&token=' + encodeURIComponent(token),
            headers: {
                'x-api-key': this.api_key
            },
            resolveWithFullResponse: true,
            simple: false
        })
        .then(function(res) {
            var payload = JSON.parse(res.body).payload;

            return util.decrypt(encrypted_data, payload.key);
        });
};

module.exports = function(options) {
    return new keyarmory(options);
};