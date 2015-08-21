/**
* MetricEffectEvent.js
*
* @description :: An effect caused by a Metric going above or below a user-defined threshold. This effect will spawn an Event Instance.
*/

module.exports = {

	attributes: {
		metric: {
			model: 'Metric'
		},
		event: {
			model: 'Event'
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

