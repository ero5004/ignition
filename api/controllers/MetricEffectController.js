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
				Event.find({where: {simulation: simulationId}, sort: "name ASC"})
				.then(function(events) {
					var resourcesSorted = _.indexBy(resources, 'id');
					var eventsSorted = _.indexBy(events, 'id');
					return res.view("Effects/viewMetricEffects", {
						simulationId: simulationId,
						metrics: metrics,
						resources: resourcesSorted,
						events: eventsSorted,
						page: '9a',
						title: "View Metric Effects"
					});
				})
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
					resources: resources,
					page: '9a1',
					title: "Add Metric Resource Effect"
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
	},
	
	addMetricEventEffect: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		var metricId = params.metricId;
		
		Metric.findOne({id: metricId})
		.populateAll()
		.then(function(metric) {
			Event.find({where: {simulation: simulationId}, sort: "name ASC"})
			.then(function(events) {
				return res.view("Effects/addMetricEventEffect", {
					simulationId: simulationId,
					metric: metric,
					events: events,
					page: '9a2',
					title: "Add Metric Event Effects"
				});
			});
		});
	},
	
	processAddMetricEventEffect: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		
		MetricEventEffect.create(params).exec(function(err, created){
			if (err) {
				console.log(err);
				return res.negotiate(err);
			}
			
			return res.send({simulationId: created.simulation});
		});
	}
};

