/**
* EventMetricEffect.js
*
* @description :: An effect caused by an Event Instance changing state. This includes spawning, staying untreated for a user-defined amount of ticks, and being handled. This effect will add, subtract, or multiply a user-defined number and a metric.
*/

module.exports = {

	attributes: {
		event: {
			model: 'Event'
		},
		metric: {
			model: 'Metric'
		},
		effectType: {
			// 1 = spawn effect, 2 = untreated effect, 3 = treated effect
			type: 'integer'
		},
		effectOperation: {
			//1 = add, -1 = subtract, 2 = multiply
			type: 'integer'
		},
		effectAmount: {
			type: 'integer'
		},
		untreatedTicks: {
			type: 'integer'
		},
		simulation: {
			model: 'Simulation'
		}
	}
};

