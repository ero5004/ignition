/**
* EventResourceEffect.js
*
* @description :: An effect caused by an Event Instance changing state. This includes spawning, staying untreated for a user-defined amount of ticks, and being handled. This effect will add or remove the number of a certain Resource during the Simulation.
*/

module.exports = {

	attributes: {
		event: {
			model: 'Event'
		},
		resource: {
			model: 'Resource'
		},
		effectType: {
			// 1 = spawn effect, 2 = untreated effect, 3 = treated effect
			type: 'integer'
		},
		effectOperation: {
			//1 = add, -1 = subtract
			type: 'integer'
		},
		effectAmount: {
			type: 'integer'
		},
		untreatedTicks: {
			type: 'integer'
		},
		simulation: {
			model: 'Simulation'
		}
	}
};

