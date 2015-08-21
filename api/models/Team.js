/**
* Team.js
*
* @description :: A Team in the Simulation. Used to determine who receives the message about an Event Instance spawning.
*/

module.exports = {

  attributes: {
	  name: {
		  type: 'string'
	  },
	  icon: {
		  type: 'string'
	  },
	  simulation: {
		  model: 'Simulation'
	  },
	  description: {
			type: 'string'
	  },
	  roles: {
		  collection: 'Role',
		  via: 'team'
	  }
  }
};

