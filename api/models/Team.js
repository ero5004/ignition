/**
* Team.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
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

