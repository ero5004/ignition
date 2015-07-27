/**
* ResourceEventEffect.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		resource: {
			model: 'Resource'
		},
		event: {
			model: 'Event'
		},
		resourceThreshold: {
			type: 'integer'
		},
		resourceThresholdDirection: {
			type: 'integer'
		},
		simulation: {
			model: 'Simulation'
		}
	}
};

