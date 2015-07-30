/**
* Resource.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		name: {
			type: 'string'
		},
		quantity: {
			type: 'integer'
		},
		icon: {
			type: 'string'
		},
		applicationTime: {
			type: 'integer'
		},
		reusable: {
			type: 'boolean'
		},
		simulation: {
			model: 'Simulation'
		},
		accesses: {
			collection: 'ResourceAccess',
			via: 'resource'
		},
		resourceEventEffects: {
			collection: 'ResourceEventEffect',
			via: 'resource'
		},
		resourceMetricEffects: {
			collection: 'ResourceMetricEffect',
			via: 'resource'
		}
	}
};

