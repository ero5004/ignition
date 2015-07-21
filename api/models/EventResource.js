/**
* EventResources.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
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

