/**
* ResourceMetricEffect.js
*
* @description :: An effect caused by the quantity of a certain resource going above or below a user-defined threshold. This effect will add, subtract, or multiply a user-defined number and a metric.
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

