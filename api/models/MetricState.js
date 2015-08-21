/**
* MetricState.js
*
* @description :: Used by the Simulation Engine to keep track of the value of Metrics during a Simulation. In a Simulation, there will be one row in this table for each Metric.
*/

module.exports = {

	attributes: {
		metric: {
			model: 'Metric'
		},
		currentValue: {
			type: 'float'
		},
		simulation: {
			model: 'Simulation'
		}
	}
};

