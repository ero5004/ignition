/**
* Event.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		name: {
			type: 'string'
		},
		description: {
			type: 'string'
		},
		leadTeam: {
			model: 'Team'
		},
		simulation: {
			model: 'Simulation'
		},
		probRecurrenceTreated: {
			type: 'float'
		},
		probRecurrenceUntreated: {
			type: 'float'
		},
		untreatedExpGrowth: {
			type: 'integer'
		},
		untreatedRespawnCheckTime: {
			type: 'integer'
		},
		instances: {
			collection: 'EventInstance',
			via: 'event'
		},
		requiredResources: {
			collection: 'EventResource',
			via: 'event'
		},
		eventResourceEffects: {
			collection: 'EventResourceEffect',
			via: 'event'
		},
		eventMetricEffects: {
			collection: 'EventMetricEffect',
			via: 'event'
		}

		
	}
};

