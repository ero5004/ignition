/**
* Role.js
*
* @description :: Roles are a part of a Team and are used to determine what a User can do in the simulation via the Access Control Lists.
*/

module.exports = {

	attributes: {
		name: {
		  type: 'string'
		},
		team: {
		  model: 'Team'
		},
		simulation: {
		  model: 'Simulation'
		},
	}
};

