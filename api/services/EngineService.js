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
	
	checkEventInstancesHandled: function(simulationId, tick, eventInstanceId, cb) {
		//todo: check EventInstanceResourcesApplied and EventResource tables to see if resources applied were enough to handle event.
		EventInstance.findOne({id: eventInstanceId, simulation: simulationId})
		.then(function(eventInstance){
			Event.findOne({id: eventInstance.event})
			.populate("requiredResources")
			.then(function(event){
				var requiredResources = event.requiredResources;
				EventInstanceResourcesApplied.find({eventInstance: eventInstanceId, simulation: simulationId})
				.then(function(resourcesApplied){
					requiredResources.forEach(function(requiredResource){
						var thisResourceApplied = _.where(resourcesApplied, {resource: requiredResource.resource});
						//thisResourceApplied.forEach()
					});
					
					console.log("required resources");
					console.log(requiredResources);
					console.log();
					console.log("resources applied");
					console.log(resourcesApplied);
				});
			});
		});
	},
	
	recycleResources: function(simulationId, tick, cb){
		//todo: check EventInstanceResourcesApplied for any rows that have time of appliction == tick and reusable = true 
	}
	
}