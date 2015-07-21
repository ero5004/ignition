/**
* EventInstance.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		event: {
			model: 'Event'
		},
		parent: {
			model: 'EventInstance'
		},
		name: {
			type: 'string'
		},
		description: {
			type: 'string'
		},
		spawnType: {
			type: 'string'
		},
		spawnTime: {
			//using integer assuming there will be a set number of ticks for a simulation, if it ends up being time based, change this to date
			type: 'integer' 
		},
		treated: {
			type: 'boolean'
		},
		simulation: {
			model: 'Simulation'
		}
	}
};

