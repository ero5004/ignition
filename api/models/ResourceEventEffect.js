/**
* ResourceEventEffect.js
*
* @description :: An effect caused by the quantity of a certain resource going above or below a user-defined threshold. This effect will spawn an Event Instance.
*/

module.exports = {

	attributes: {
		resource: {
			model: 'Resource'
		},
		event: {
			model: 'Event'
		},
		resourceThreshold: {
			type: 'integer'
		},
		resourceThresholdDirection: {
			type: 'integer'
		},
		simulation: {
			model: 'Simulation'
		}
	}
};

