/**
* MetricEffectResource.js
*
* @description :: An effect caused by a Metric going above or below a user-defined threshold. This effect will add or remove the number of a certain Resource during the Simulation.
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

