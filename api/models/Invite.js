/**
* Invites.js
*
* @description :: An Invite sent from one User to another to join a Simulation.
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
			/*
			 * 0 = pending
			 * 1 = accepted
			 * 
			 */
		},
		role: {
			model: 'Role'
		}
	}
};

