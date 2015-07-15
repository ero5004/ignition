/**
* MetricAccess.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
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

