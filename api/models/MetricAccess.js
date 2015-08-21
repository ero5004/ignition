/**
* MetricAccess.js
*
* @description :: Used for the Metric Access Control List. For a Simulation there will be <number of roles> * <number of metrics> rows in this table.
*/

module.exports = {

	attributes: {
		role: {
			model: 'Role'
		},
		metric: {
			model: 'Metric'
		},
		see: {
			type: 'boolean'
		},
		simulation: {
			model: 'Simulation'
		}
	}
};

