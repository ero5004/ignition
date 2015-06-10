/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

module.exports = {

	attributes: {
		email: {
			type: 'email',
			unique: true
		},
		password: {
			type: 'string'
		},
		name: {
			type: 'string'
		},
		bio: {
			type: 'string'
		},
		simulations: {
			collection: 'Simulation',
			via: 'owner'
		},
		receivedInvitations: {
			collection: 'Invite',
			via: 'invitee'
		},
		sentInvitations: {
			collection: 'Invite',
			via: 'inviter'
		}

	},
	
	beforeCreate: function (values, cb) {

    // Encrypt password
    bcrypt.hash(values.password, 10, function(err, hash) {
      if(err) return cb(err);
      values.password = hash;
      //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
      cb();
    });
  }
};

