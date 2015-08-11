/**
* EventResources.js
*
* @description :: Stores the resources that are needed to handle an event. An event that requires multiple resources to handle would have multiple rows in this table.
*/

module.exports = {

	attributes: {
		event: {
			model: 'Event'
		},
		resource: {
			model: 'Resource'
		},
		quantity: {
			type: 'integer'
		},
		simulation: {
			model: 'Simulation'
		}
	}
};

