var crypto = require('crypto');
var request = require('request');
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
    var promise = q.defer();

    request.get(
        {
            url: this.base_url + '/encryption/token',
            headers: {
                'x-api-key': this.api_key
            }
        }, function(err, res, body) {
            if (err) return promise.reject(err);

            var payload = JSON.parse(body).payload;

            var encrypted_data = util.encrypt(data, payload.key);
            var encrypted_string = 'ka:' + payload.key_id + ':' + payload.token + ':' + encrypted_data;

            return promise.resolve(encrypted_string);
        });

    return promise.promise;
};

keyarmory.prototype.decrypt = function(encrypted_string) {
    var pieces = encrypted_string.split(':');
    var key_id = pieces[1];
    var token = pieces[2];
    var encrypted_data = pieces[3];

    var promise = q.defer();

    request.get(
        {
            url:
                this.base_url + '/encryption/key' +
                '?key_id=' + key_id +
                '&token=' + token,
            headers: {
                'x-api-key': this.api_key
            }
        }, function(err, res, body) {
            if (err) return promise.reject(err);

            var payload = JSON.parse(body).payload;

            var decrypted_data = util.decrypt(encrypted_data, payload.key);

            return promise.resolve(decrypted_data);
        });

    return promise.promise;
};

module.exports = function(options) {
    return new keyarmory(options);
};