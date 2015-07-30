/**
 * EventInstanceController
 *
 * @description :: Server-side logic for managing Eventinstances
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	viewEventInstances: function(req, res) {
		var params = req.params.all();
		var eventId = params.eventId;
		var simulationId = params.simulationId;
		
		Simulation.findOne({id: simulationId})
		.then(function(simulation){
			Event.findOne({id: eventId})
			.populateAll()
			.then(function(event) {
				EventInstance.find({event: eventId})
				.then(function(eventInstances) {
					return res.view("Event/viewEventInstances", {
						event: event,
						eventInstances: eventInstances,
						simulationId: simulationId,
						simulation: simulation,
						page: '7a',
						title: "Add Event Instances"
					});
				});
			});
		});
	},
	
	addEventInstance: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulation;
		var eventId = params.event;
		var spawnType = params.spawnType;
		
		//if spawnType is set as random, pick a random time for this event to spawn
		if (spawnType == 'r') {
			
			Simulation.findOne({id: simulationId})
			.then(function(simulation) {
				params.spawnTime = Math.random() * simulation.numTicks;
				
				EventInstance.create(params).exec(function(err, created){
					if (err) {
						console.log(err);
						return res.negotiate(err);
					}
					
					return res.send({simulationId: created.simulation, eventId: created.event});
				});
			});
		}
		else if (spawnType == "rl") {
			//find the time of the last instance of this event and pick a random time between then and the end of the simulation
			EventInstance.find({event: eventId})
			.then(function(instances) {
				var latest = 0;
				if (instances.length > 0) {
					instances.forEach(function(instance) {
						if (instance.spawnTime > latest) {
							latest = instance.spawnTime;
						}
					});
				}
				Simulation.findOne({id: simulationId})
				.then(function(simulation) {
					var randMax = simulation.numTicks - latest + 1;
					params.spawnTime = (Math.random() * randMax) + latest;					
					EventInstance.create(params).exec(function(err, created){
						if (err) {
							console.log(err);
							return res.negotiate(err);
						}
						
						return res.send({simulationId: created.simulation, eventId: created.event});
					});
				});
			});
		}
		else {
			//don't have to do anything here, slider on page returns value between 0 and simulation.numTicks
			EventInstance.create(params).exec(function(err, created){
				if (err) {
					console.log(err);
					return res.negotiate(err);
				}
				
				return res.send({simulationId: created.simulation, eventId: created.event});
			});
		}

		
	},
	
	deleteEventInstance: function(req, res) {
		var params = req.params.all();
		var eventInstanceId = params.eventInstanceId;
		
		EventInstance.destroy({id: eventInstanceId})
		.exec(function(err){
			if (err) {
				console.log(err);
				return res.negotiate(err);
			}
			
			return res.send({successful: true});
		});
	}
};

