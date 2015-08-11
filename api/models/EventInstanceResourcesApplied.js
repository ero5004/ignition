/**
* EventInstanceResourcesApplied.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		eventInstance: {
			model: 'EventInstance'
		},
		resource: {
			model: 'Resource'
		},
		appliedBy: {
			model: 'User'
		},
		numberApplied: {
			type: 'integer'
		},
		timeApplied: {
			type: 'integer'
		},
		simulation: {
			model: 'Simulation'
		}
	}
};

