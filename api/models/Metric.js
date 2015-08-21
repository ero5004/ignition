/**
* Metric.js
*
* @description :: One of the three basic parts of a Simulation. Metrics can be used to measure performance during a Simualation. The Metric Access Control List determins which Users can see each Metric.
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
	  },
	  metricResourceEffects: {
		  collection: 'MetricResourceEffect',
		  via: 'metric'
	  },
	  metricEventEffects: {
		  collection: 'MetricEventEffect',
		  via: 'metric'
	  }
  }
};

