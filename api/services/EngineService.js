/**
 * DeleteService
 *
 * @description :: Service to determine which resources, metrics, and events a user has access to
 */
 
module.exports = {
	spawnEvents: function(simulationId, tick, cb) {
		
		EventInstance.find({simulation: simulationId, spawnTime: tick, state: 0})
		.then(function(eventsToSpawn){
			var eventIds = _.pluck(eventsToSpawn, 'id');
		
			EventInstance.update({id: eventIds}, {state: 1})
			.exec(function(err, updated){
				if (err) {
					console.log(err);
					return cb(false);
				}
				
				EngineService.checkEventSpawnEffects(simulationId, updated, function(err, status){
					if (err) {
						console.log(err);
						return cb(false);
					}
					return cb(true);
				});
			});
		});
	},
	
	checkEventSpawnEffects: function(simulationId, spawnedEvents, cb) {
		var spawnedEventIds = _.pluck(spawnedEvents, 'event');
		
		async.each([EngineService.checkEventMetricSpawnEffects, EngineService.checkEventResourceSpawnEffects], function(spawnEffectFunction, eachCb){
			spawnEffectFunction(simulationId, spawnedEventIds, function(err, updatedStates){
				return eachCb(null, updatedStates);
			});
		}, cb);
	},
	
	checkEventMetricSpawnEffects: function(simulationId, spawnedEventIds, cb) {
		//effectType 1 = event spawn effect
		EventMetricEffect.find({simulation: simulationId, event: spawnedEventIds, effectType: 1})
		.then(function(metricEffects){
			var metricsToUpdate = _.pluck(metricEffects, 'metric');
			MetricState.find({simulation: simulationId, metric: metricsToUpdate})
			.then(function(metricStates){
				var metricStatesSorted = _.indexBy(metricStates, 'metric');
				//must do this asynchronously because for each event metric effect one database write is required which is an asynchronous method
				async.map(metricEffects, function(metricEffect, mapCb) {
					var metricStateToUpdate = metricStatesSorted[metricEffect.metric];
					var currentValue = metricStateToUpdate.currentValue;
					//effectOperation 2 is multiply
					if(metricEffect.effectOperation == 2) {
						currentValue = currentValue * metricEffect.effectAmount;
					} 
					else {
						currentValue = currentValue + (metricEffect.effectAmount * metricEffect.effectOperation);
					}
					
					MetricState.update({id: metricStateToUpdate.id}, {currentValue: currentValue})
					.exec(function(err, updated){
						if (err) {
							console.log("Error updating Metric State for event spawn effect");
							console.log(err);
							return mapCb(err);
						}
						
						return mapCb(null, updated);
					})
					
				}, cb);
			});
		});
	},
	
	checkEventResourceSpawnEffects: function(simulationId, spawnedEventIds, cb) {
		//effectType 1 = event spawn effect
		EventResourceEffect.find({simulation: simulationId, event: spawnedEventIds, effectType: 1})
		.then(function(resourceEffects){
			var resourcesToUpdate = _.pluck(resourceEffects, 'resource');
			ResourceState.find({simulation: simulationId, resource: resourcesToUpdate})
			.then(function(resourceStates){
				var resourceStatesSorted = _.indexBy(resourceStates, 'resource');
				//must do this asynchronously because for each event resource effect one database write is required which is an asynchronous method
				async.map(resourceEffects, function(resourceEffect, mapCb) {
					var resourceStateToUpdate = resourceStatesSorted[resourceEffect.resource];
					var currentUsableQuantity = resourceStateToUpdate.currentUsableQuantity;
					currentUsableQuantity = currentUsableQuantity + (resourceEffect.effectAmount * resourceEffect.effectOperation);
					
					ResourceState.update({id: resourceStateToUpdate.id}, {currentUsableQuantity: currentUsableQuantity})
					.exec(function(err, updated){
						if (err) {
							console.log("Error updating ResourceState for event spawn effect");
							console.log(err);
							return mapCb(err);
						}
						
						return mapCb(null, updated);
					})
					
				}, cb);
			});
		});
	},
	
	checkEventInstanceHandled: function(simulationId, tick, eventInstanceId, cb) {
		//todo: check EventInstanceResourcesApplied and EventResource tables to see if resources applied were enough to handle event.
		EventInstance.findOne({id: eventInstanceId, simulation: simulationId})
		.then(function(eventInstance){
			Event.findOne({id: eventInstance.event})
			.populate("requiredResources")
			.then(function(event){
				var requiredResources = event.requiredResources;
				EventInstanceResourcesApplied.find({eventInstance: eventInstanceId, simulation: simulationId, timeOfApplication: {'<=': tick}})
				.then(function(resourcesApplied){
					console.log("resources applied");
					console.log(resourcesApplied);
					console.log("________");
					var eventHandled = true;
					requiredResources.forEach(function(requiredResource){
						if(requiredResource.quantity > 0) {
							console.log(requiredResource);
							var thisResourceApplied = _.where(resourcesApplied, {resource: requiredResource.resource});
							console.log(thisResourceApplied);
							
							//add up total number of this resource that have been applied to this event
							var totalQuantityApplied = 0;
							thisResourceApplied.forEach(function(aResourceApplied){
								totalQuantityApplied += aResourceApplied.numberApplied;
							});
							console.log("resource: " + requiredResource.resource + ": " + totalQuantityApplied);
							if (totalQuantityApplied == 0) {
								//this resource has not been applied yet.
								eventHandled = false;
							} else if(totalQuantityApplied < requiredResource.quantity) {
								//correct resource has been applied but not enough.
								eventHandled = false;
								//update status of those resources applications to incomplete
								
							} else if (totalQuantityApplied > requiredResource.quantity) {
								//too many of a resource have been applied
							}
						}
					});
					var requiredResourceIds = _.pluck(_.reject(requiredResources,{quantity: 0}), 'resource');
					//update all incorrect resources to status: incorrect 
					EventInstanceResourcesApplied.update({simulation: simulationId, eventInstance: eventInstanceId, resource: {'!': requiredResourceIds}, timeOfApplication: {'<=': tick}}, {status: 3}) //status: 3 = incorrect
					.exec(function(err, updated){
						if (err) {
							console.log("error updating resourcesApplied table");
							console.log(err);
							return cb(err, null);
						}
						if (eventHandled) {
							console.log("event handled");
							//update event instance status to handled/complete
							EventInstance.update({simulation: simulationId, id: eventInstanceId}, {state: 2}) // state: 2 = handled/complete
							.exec(function(err, updated) {
								if (err) {
									console.log("error updating eventInstance table");
									return cb(err, null);
								}
								EventInstanceResourcesApplied.update({simulation: simulationId, eventInstance: eventInstanceId, resource: requiredResourceIds, timeOfApplication: {'<=': tick}}, {status: 2}) // status: 2 = complete
								.exec(function(err, updated){
									if (err) {
										return cb(err, null);
									}
									return cb(null, true);
								});
							});
						} else {
							console.log("event not handled");
							//update resources that were correct to status: incomplete and those that were incorrect to status: incorrect
							console.log(simulationId);
							console.log(eventInstanceId);
							console.log(requiredResourceIds);
							console.log(tick);
							EventInstanceResourcesApplied.update({simulation: simulationId, eventInstance: eventInstanceId, resource: requiredResourceIds, timeOfApplication: {'<=': tick}}, {status: 4}) //status: 4 = incomplete
							.exec(function(err, updated) {
								if (err) {
									console.log("error updating resourcesApplied for incomplete resources");
									return cb(err, null);
								}
								return cb(null, true);
							});
						}
					});
					
					/*console.log("required resources");
					console.log(requiredResources);
					console.log();
					console.log("resources applied");
					console.log(resourcesApplied);*/
				});
			});
		});
	},
	
	recycleResources: function(simulationId, tick, cb){
		//todo: check EventInstanceResourcesApplied for any rows that have time of appliction == tick and reusable = true 
	}
	
}