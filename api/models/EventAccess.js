/**
* EventAccess.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		role: {
			model: 'Role'
		},
		owningTeam: {
			model: 'Team'
		},
		see: {
			type: 'boolean'
		},
		forward: {
			type: 'boolean'
		},
		simulation: {
			model: 'Simulation'
		}
	}
};

