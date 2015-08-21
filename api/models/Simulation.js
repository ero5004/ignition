/**
* Simulation.js
*
* @description :: Contains the basic information about a Simulation.
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
		numTicks: {
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

