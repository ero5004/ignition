/**
 * EventEffectControllerController
 *
 * @description :: Server-side logic for managing Eventeffectcontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	viewEventEffects: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		
		Event.find({simulation: simulationId})
		.populateAll()
		.then(function(events) {
			Resource.find({where: {simulation: simulationId}, sort: "name ASC"})
			.then(function(resources) {
				Metric.find({where: {simulation: simulationId}, sort: "name ASC"})
				.then(function(metrics) {
					var resourcesSorted = _.indexBy(resources, 'id');
					var metricsSorted = _.indexBy(metrics, 'id');
					return res.view("Effects/viewEventEffects", {
						simulationId: simulationId,
						events: events,
						resources: resourcesSorted,
						metrics: metricsSorted
					});
				})
			});
		});
	},
	
	addEventResourceEffect: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		var eventId = params.eventId;
		
		Event.findOne({id: eventId})
		.then(function(event){
			Resource.find({simulation: simulationId})
			.then(function(resources){
				EventResourceEffect.find({event: eventId})
				.then(function(eventResourceEffects){
					var resourcesSorted = _.indexBy(resources, 'id');
					return res.view('Effects/addEventResourceEffect', {
						simulationId: simulationId,
						event: event,
						resources: resourcesSorted,
						eventResourceEffects: eventResourceEffects
					});
					
				});
			});
		});
	},
	
	processAddEventResourceEffect: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulation;
		var eventId = params.event;
		
		EventResourceEffect.create(params).exec(function(err, created){
			if (err) {
				console.log(err);
				return res.negotiate(err);
			}
			
			return res.send({simulationId: created.simulation, eventId: created.event});
		});
	},
	
	addEventMetricEffect: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		var eventId = params.eventId;
		
		Event.findOne({id: eventId})
		.then(function(event){
			Metric.find({simulation: simulationId})
			.then(function(metrics){
				EventMetricEffect.find({event: eventId})
				.then(function(eventMetricEffects){
					var metricsSorted = _.indexBy(metrics, 'id');
					return res.view('Effects/addEventMetricEffect', {
						simulationId: simulationId,
						event: event,
						metrics: metricsSorted,
						eventMetricEffects: eventMetricEffects
					});
					
				});
				
			});
		});
	},
	
	processAddEventMetricEffect: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulation;
		var eventId = params.event;
		
		EventMetricEffect.create(params).exec(function(err, created){
			if (err) {
				console.log(err);
				return res.negotiate(err);
			}
			
			return res.send({simulationId: created.simulation, eventId: created.event});
		});
	}
};

