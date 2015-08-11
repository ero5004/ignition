/**
 * EngineController
 *
 * @description :: Server-side logic for managing Engines
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	simPreview: function(req, res){
		var params = req.params.all();
		var simulationId = params.simulationId;
		Simulation.findOne({id: simulationId})
		.then(function(simulation){
			EventInstance.find({simulation: simulationId})
			.populateAll()
			.then(function(eventInstances){
				Metric.find({simulation: simulationId})
				.then(function(metrics){
					Resource.find({simulation: simulationId})
					.then(function(resources){
						
						return res.view('Engine/simPreview', {
							simulation: simulation,
							eventInstances: eventInstances,
							metrics: metrics,
							resources: resources, 
							page: 999,
							title: "Simulation Preview"
						});
					});
				});
			});
		});
	},
	
	/**
	 *this action will be called when the simulation first starts and will copy the necessary data into the appropriate places. 
	 */
	initializeSimulation: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		
		Resource.find({simulation: simulationId})
		.then(function(resources){
			var resourceStates = [];
			console.log(resources);
			resources.forEach(function(resource){
				var resourceState = {};
				resourceState.simulation = simulationId;
				resourceState.resource = resource.id;
				//at the beginning of a simulation, all resources are usable.
				resourceState.currentUsableQuantity = resource.quantity;
				resourceState.currentPendingQuantity = 0;
				resourceState.isReusable = resource.reusable;
				
				resourceStates.push(resourceState);
			});
			
			console.log(resourceStates);
			
			ResourceState.create(resourceStates)
			.exec(function(err, created){
				if (err) {
					console.log(err);
					return res.negotiate(err);
				}
				
				Metric.find({simulation: simulationId})
				.then(function(metrics){
					var metricStates = [];
					
					metrics.forEach(function(metric){
						var metricState = {};
						metricState.simulation = simulationId;
						metricState.metric = metric.id;
						metricState.currentValue = metric.defaultValue;
						
						metricStates.push(metricState);
					});
					
					MetricState.create(metricStates)
					.exec(function(err, created){
						if (err) {
							console.log(err);
							return res.negotiate(err);
						}
						
						console.log(metricStates);
						return res.send({simulationId: simulationId});
					});
				});
			});
		});
	},
	
	simulationSnapshot: function(req, res){
		var params = req.params.all();
		var simulationId = params.simulationId;
		var tick = params.tick;
		
		//get all eventInstances for this simualtion that are spawned but not handled, may change this later to get all instances for the simulation that will then be displayed where it is appropriate
		EventInstance.find({simulation: simulationId})
		.then(function(eventInstances){
			var upcomingEvents = _.where(eventInstances, {state: 0});
			var spawnedEvents = _.where(eventInstances, {state: 1});
			var handledEvents = _.where(eventInstances, {state: 2});
			
			ResourceState.find({simulation: simulationId})
			.populate("resource")
			.then(function(resourceStates){
				
				MetricState.find({simulation: simulationId})
				.populate("metric")
				.then(function(metricStates){
					EventInstanceResourcesApplied.find({simulation: simulationId})
					.then(function(resourcesApplied){
						return res.view('Engine/simulationSnapshot', {
							simulationId: simulationId,
							tick: tick,
							upcomingEvents: upcomingEvents,
							spawnedEvents: spawnedEvents,
							handledEvents: handledEvents,
							resourceStates: resourceStates,
							metricStates: metricStates,
							resourcesApplied: resourcesApplied,
							page: 999,
							title: "Simulation Snapshot"
						});
					});
				});
			});
		});
	},
	
	accessPreview: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		
		Role.find({simulation: simulationId})
		.populate("team")
		.then(function(roles){
			return res.view('Engine/accessPreview', {
				simulationId: simulationId,
				roles: roles,
				page: 999,
				title: "Access Preview"
			});
		});
	},
	
	viewAccessRights: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		var roleId = params.roleId;
		
		Role.findOne({id: roleId})
		.populate("team")
		.then(function(role){
			AccessControlService.getResourceAccessInfo(simulationId, roleId, function(resourceAccesses){
				AccessControlService.getMetricAccessInfo(simulationId, roleId, function(metricAccesses){
					AccessControlService.getEventAccessInfo(simulationId, roleId, function(eventAccesses){
						return res.view('Engine/viewAccessRights',{
							simulationId: simulationId,
							role: role, 
							resourceAccesses: resourceAccesses,
							metricAccesses: metricAccesses,
							eventAccesses: eventAccesses,
							page: 999,
							title: "View Access Rights"
						});
					});
				});
			});
		});
	}
	
};

