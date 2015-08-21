/**
* EventAccess.js
*
* @description :: Used for the Event Access Control List. For a Simulation there will be <number of roles> * <number of teams> rows in this table.
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

