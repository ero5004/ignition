/**
* ResourceAccess.js
*
* @description :: Used for the Resource Access Control List. For a Simulation there will be <number of roles> * <number of resources> rows in this table.
*/

module.exports = {

	attributes: {
		role: {
			model: 'Role'
		},
		resource: {
			model: 'Resource'
		},
		apply: {
			type: 'boolean'
		},
		see: {
			type: 'boolean'
		},
		simulation: {
			model: 'Simulation'
		}
	}
};

