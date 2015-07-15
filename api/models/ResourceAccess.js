/**
* ResourceAccess.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
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

