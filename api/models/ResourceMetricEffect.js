/**
* ResourceMetricEffect.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		resource: {
			model: 'Resource'
		},
		metric: {
			model: 'Metric'
		},
		resourceThreshold: {
			type: 'integer'
		},
		resourceThresholdDirection: {
			type: 'integer'
		},
		effectOperation: {
			//1 = add, -1 = subtract, 2 = multiply
			type: 'integer'
		},
		effectAmount: {
			type: 'integer'
		},
		simulation: {
			model: 'Simulation'
		}
	}
};

