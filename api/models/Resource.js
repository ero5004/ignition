/**
* Resource.js
*
* @description :: One of the three basic parts of a Simulation. Resources can be applied to Events in order to handle them. The Resource Access Control List is used to determine who can see the available quantity and apply each resource.
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

