/**
* EventInstanceResourcesApplied.js
*
* @description :: Keeps track of Resources applied by Users to an Event Instance. There will be one row in this table for each time an individual resource is applied to an Instance. 
*/

module.exports = {

	attributes: {
		eventInstance: {
			model: 'EventInstance'
		},
		resource: {
			model: 'Resource'
		},
		appliedBy: {
			model: 'User'
		},
		numberApplied: {
			type: 'integer'
		},
		timeApplied: {
			type: 'integer'
		},
		simulation: {
			model: 'Simulation'
		},
		timeOfApplication: {
			//time of application indicates the tick when this resource is ready to be recalled
			type: 'integer'
		},
		reusable: {
			type: 'boolean'
		},
		status: {
			//1: pending, 2: complete(event handled), 3: incorrect, 4: incomplete, 5: returning
			type: 'integer'
		}
	}
};

