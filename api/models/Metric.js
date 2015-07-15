/**
* Metric.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
	  name:  {
		  type: 'string'
	  },
	  defaultValue: {
		  type: 'float'
	  },
	  minValue: {
		  type: 'float'
	  },
	  maxValue: {
		  type: 'float'
	  },
	  unit: {
			type: 'string'
	  },
	  simulation: {
		  model: 'Simulation'
	  }
  }
};

