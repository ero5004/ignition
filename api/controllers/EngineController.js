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
							simulationId: simulationId,
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
		
		EngineService.spawnEvents(simulationId, tick, function(status){
			if(status == false){
				console.log("Error spawning events");
				return res.send("Error");
			}
			
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
		});
	},
	
	applyResources: function(req, res){
		var params = req.params.all();
		var simulationId = params.simulationId;
		var tick = params.tick;
		var resourcesAppliedList = params.resourcesAppliedList;
		var resourcesAppliedArray = [];
		var user = req.user;
		
		var appliedResourceIds = _.pluck(resourcesAppliedList, 'resource');
		
		Resource.find({simulation: simulationId, id: appliedResourceIds})
		.then(function(resources){
			var resourcesSorted = _.indexBy(resources, 'id');
			
			//large arrays end up getting passed as objects, this is to convert them back to arrays which is what sails models are looking for
			for (var index in resourcesAppliedList)
			{
				var temp = resourcesAppliedList[index];
				temp.simulation = simulationId;
				temp.appliedBy = user.id;
				temp.reusable = resourcesSorted[temp.resource].reusable;
				
				if (resourcesSorted[temp.resource].reusable) {
					temp.timeOfApplication = tick + resourcesSorted[temp.resource].applicationTime;
				}
				else {
					temp.timeOfApplication = tick;
				}
				
				resourcesAppliedArray.push(temp);
			}
			
			EventInstanceResourcesApplied.create(resourcesAppliedArray)
			.exec(function(err, created){
				var eventInstances = _.pluck(created, 'eventInstance');
				
				EngineService.checkEventInstancesHandled(simulationId, tick, eventInstance, function(err, status){
					if (err) {
						console.log(err);
						return res.negotiate(err);
					}
					
					return res.send({simulationId: simulationId, tick: tick});
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
	},
	
	resetSimulationSnapshot: function(req, res){
		var params = req.params.all();
		var simulationId = params.simulationId;
		ResourceState.destroy({simulation: simulationId})
		.exec(function(err, deleted){
			MetricState.destroy({simulation: simulationId})
			.exec(function(err, deleted){
				EventInstanceResourcesApplied.destroy({simulation: simulationId})
				.exec(function(err, deleted){
					EventInstance.update({simulation: simulationId}, {state: 0})
					.exec(function(err, updated){
						return res.view('Engine/resetSimulationSnapshot', {
							page: 999,
							title: "Reset Simulation Snapshot",
							simulationId: simulationId
						})
					});
				});
			});
		});		
	}
	
};

