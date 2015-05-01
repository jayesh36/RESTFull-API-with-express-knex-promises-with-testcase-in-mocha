'use strict';
var crypto = require('crypto'),
algorithm = 'aes-256-ctr',
password = 'd6F3Efeq';
function encrypt(text) {
	var cipher = crypto.createCipher(algorithm, password)
		var crypted = cipher.update(text, 'utf8', 'hex')
		crypted += cipher.final('hex');
	return crypted;
};
exports.seed = function(knex, Promise) {
    return Promise.join(
        // Deletes ALL existing entries
        knex('users').del(), 

        // Inserts seed entries
        knex('users').insert({user_name: 'testUserBySeed', passkey: encrypt('passkey')})
        
    );
};