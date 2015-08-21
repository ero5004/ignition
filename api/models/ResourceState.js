/**
* ResourceState.js
*
* @description :: Used by the Simulation Engine to keep track of the quantity of available and pending Resources. In a Simulation, there will be one row in this table for each Resource in the resource pool.
*/

module.exports = {

	attributes: {
		resource: {
			model: 'Resource'
		},
		currentUsableQuantity: {
			type: 'integer'
		},
		currentPendingQuantity: {
			type: 'integer'
		},
		simulation: {
			model: 'Simulation'
		}
	}
};

