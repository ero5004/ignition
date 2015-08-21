/**
* EventResources.js
*
* @description :: Stores the Resources that are needed to handle an event. Currently will contain one row for each Resource in the Resource Pool when the required resources are defined by the User.
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

