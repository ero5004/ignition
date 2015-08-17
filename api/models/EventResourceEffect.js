/**
* EventResourceEffect.js
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

