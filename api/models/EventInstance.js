/**
* EventInstance.js
*
* @description :: An instance of an Event that will be spawned by the Simulation Engine.
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
		},
		state: {
			// 0 = created in builder, 1 = spawned, 2 = handled
			type: 'integer'
		}
	}
};

