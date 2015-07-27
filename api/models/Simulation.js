/**
* Simulation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	  
	attributes: {
		name: {
			type: 'string'
		},
		owner: {
			model: 'User'
		},
		startDate: {
			type: 'datetime'
		},
		endDate: {
			type: 'datetime'
		},
		description: {
			type: 'text'
		},
		simulatedStartTime: {
			type: 'datetime'
		},
		simulatedEndTime: {
			type: 'datetime'
		},
		numberOfTicks: {
			type: 'integer'
		},
		completed: {
			type: 'boolean'
		},
		invitations: {
			collection: 'Invite',
			via: 'simulation'
		},
		teams: {
			collection: 'Team',
			via: 'simulation'
		},
		resources: {
			collection: 'Resource',
			via: 'simulation'
		}

	}
	

};

