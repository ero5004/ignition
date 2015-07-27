/**
 * ResourceEffectController
 *
 * @description :: Server-side logic for managing Resourceeffects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	viewResourceEffects: function(req, res){
		var params = req.params.all();
		var simulationId = params.simulationId;
		
		Resource.find({simulation: simulationId})
		.populateAll()
		.then(function(resources) {
			Metric.find({simulation: simulationId})
			.then(function(metrics){
				Event.find({simulation: simulationId})
				.then(function(events){
					metricsSorted = _.indexBy(metrics, 'id');
					eventsSorted = _.indexBy(events, 'id');
					return res.view('Effects/viewResourceEffects', {
						resources: resources,
						metrics: metricsSorted,
						events: eventsSorted,
						simulationId: simulationId,
						page: '9c'
					});
				});
			});
		});
	},
	
	addResourceEventEffect: function(req, res){
		var params = req.params.all();
		var simulationId = params.simulationId;
		var resourceId = params.resourceId;
		
		Resource.findOne({id: resourceId})
		.populateAll()
		.then(function(resource){
			Event.find({simulation: simulationId})
			.then(function(events){
				ResourceEventEffect.find({resource: resourceId})
				.then(function(resourceEventEffects){
					var eventsSorted = _.indexBy(events, 'id');
					return res.view('Effects/addResourceEventEffect', {
						simulationId: simulationId,
						resource: resource,
						events: eventsSorted,
						resourceEventEffects: resourceEventEffects,
						page: '9ci'
					});
				});
			});
		});
	},
	
	processAddResourceEventEffect: function(req, res){
		var params = req.params.all();
		var simulationId = params.simulation;
		var resourceId = params.resource;
		
		ResourceEventEffect.create(params).exec(function(err, created){
			if (err) {
				console.log(err);
				return res.negotiate(err);
			}
			
			return res.send({simulationId: created.simulation, resourceId: created.resource});
		});
	},
	
	addResourceMetricEffect: function(req, res){
		var params = req.params.all();
		var simulationId = params.simulationId;
		var resourceId = params.resourceId;
		
		Resource.findOne({id: resourceId})
		.then(function(resource){
			Metric.find({simulation: simulationId})
			.then(function(metrics){
				ResourceMetricEffect.find({resource: resourceId})
				.then(function(resourceMetricEffects){
					var metricsSorted = _.indexBy(metrics, 'id');
					return res.view('Effects/addResourceMetricEffect', {
						simulationId: simulationId,
						resource: resource,
						metrics: metricsSorted,
						resourceMetricEffects: resourceMetricEffects,
						page: '9cii'
					});
				});
			});
		});
	},
	
	processAddResourceMetricEffect: function(req, res){
		var params = req.params.all();
		var simulationId = params.simulation;
		var resourceId = params.resource;
		
		ResourceMetricEffect.create(params).exec(function(err, created){
			if (err) {
				console.log(err);
				return res.negotiate(err);
			}
			
			return res.send({simulationId: created.simulation, resourceId: created.resource});
		});
	}
	
};

