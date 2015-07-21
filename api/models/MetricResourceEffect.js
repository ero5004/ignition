/**
* MetricEffectResource.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		metric: {
			model: 'Metric'
		},
		resource: {
			model: 'Resource'
		},
		effectAmount: {
			//could be positive or negative
			type: 'integer'
		},
		metricThreshold: {
			type: 'float'
		},
		metricThresholdDirection: {
			type: 'integer'
		},
		simulation: {
			model: 'Simulation'
		}
	}
};

