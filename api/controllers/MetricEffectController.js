/**
 * MetricEffectController
 *
 * @description :: Server-side logic for managing Metriceffects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	viewMetricEffects: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		
		Metric.find({simulation: simulationId})
		.populateAll()
		.then(function(metrics) {
			Resource.find({where: {simulation: simulationId}, sort: "name ASC"})
			.then(function(resources) {
				var resourcesSorted = _.indexBy(resources, 'id');
				return res.view("Effects/viewMetricEffects", {
					simulationId: simulationId,
					metrics: metrics,
					resources: resourcesSorted
				});
			});
		});
	},
	
	addMetricResourceEffect: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		var metricId = params.metricId;
		
		Metric.findOne({id: metricId})
		.populateAll()
		.then(function(metric) {
			Resource.find({where: {simulation: simulationId}, sort: "name ASC"})
			.then(function(resources) {
				return res.view("Effects/addMetricResourceEffect", {
					simulationId: simulationId,
					metric: metric,
					resources: resources
				});
			});
		});
		
		
		
	},
	
	processAddMetricResourceEffect: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		
		MetricResourceEffect.create(params).exec(function(err, created){
			if (err) {
				console.log(err);
				return res.negotiate(err);
			}
			
			return res.send({simulationId: created.simulation});
		});
	}	
};

