/**
* Invites.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		inviter: {
			model : 'User'
		},
		invitee: {
			model : 'User'
		},
		simulation: {
			model : 'Simulation'
		},
		inviteStatus: {
			type : 'integer'
		}
	}
};

