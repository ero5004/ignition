/**
* Event.js
*
* @description :: One of the three basic parts of a Simulation. A row in this table contains information about an Event that will not change during the Simulation. Event Instances are instances of these events which the Engine will spawn.
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

