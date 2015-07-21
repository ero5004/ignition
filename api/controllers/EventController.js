/**
 * EventController
 *
 * @description :: Server-side logic for managing Events
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	viewEvents: function(req, res) {
		var params = req.params.all();
		
		var simulationId = params.simulationId;
		
		Event.find({simulation: simulationId})
		.populateAll()
		.then(function(events){
			Team.find({simulation: simulationId}).then(function(teams){
				//var viewPath = "Event" + process.env.DIRCHAR + "viewEvents";
				return res.view("Event/viewEvents", {
					simulationId: simulationId,
					events: events,
					teams: teams
				});
			});
		});
	}, 
	
	addEvent: function(req, res) {
		var params = req.params.all();
		
		var simulationId = params.simulationId;
		
		Event.create(params).exec(function(err, created){
			if (err) {
				console.log(err);
				return res.negotiate(err);
			}
			
			return res.send({simulationId: created.simulation});
		});
	},
	
	viewEventACL: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		var teams;
		
		//get all teams, roles, and events for this simulation and send them to the page.		
		Simulation.findOne({id: simulationId})
		.populateAll()
		.then(function(simulation) {
			Role.find({simulation: simulationId})
			.then(function(roles) {
				
				teams = simulation.teams;
				var teamsWithRoles = [];
				
				teams.forEach(function(team) {
					roles.forEach(function (role) {
						if (role.team == team.id)
						{
							teamsWithRoles.push({team: team,role: role});
						}
					});
				});


				Event.find({simulation: simulationId})
				.then(function(events){
					
					EventAccess.find({simulation: simulationId})
					.then(function (eventAccessList) {
						//var viewPath = "Event" + process.env.DIRCHAR + "eventACL";
						return res.view("Event/eventACL", {
							simulationId: simulationId, 
							teamsWithRoles: teamsWithRoles,
							events: events,
							teams: teams,
							eventAccessList: eventAccessList
							});
					});
				});	
			});
		});
	},
	
	processEventACL: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		var eventAccessList = params.eventAccessList;
		
		if (eventAccessList.length != 0)
		{
			EventAccess.destroy({simulation: simulationId}).then(function(err) {
				EventAccess.create(eventAccessList).exec(function(err, created){
					if (err) {
						console.log(err);
						return res.negotiate(err);
					}
					
					return res.send({simulationId: created[0].simulation});
				});
			});
		}
		else
		{
			return res.send({simulationId: simulationId});
		}
	},
	
	viewEventInstances: function(req, res) {
		var params = req.params.all();
		var eventId = params.eventId;
		var simulationId = params.simulationId;
		
		Event.findOne({id: eventId})
		.populateAll()
		.then(function(event) {
			EventInstance.find({event: eventId})
			.then(function(eventInstances) {
				return res.view("Event/viewEventInstances", {
					event: event,
					eventInstances: eventInstances,
					simulationId: simulationId
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
		if (spawnType == 'r')
		{
			//currently picking a random time between 0 and 1000, this will be changed to the number of ticks per simulation
			params.spawnTime = Math.random() * 1000;
		}
		else 
		{
			//slider returns value between 0 and 100 - normalize to number of simulation ticks
			//params.spawnTime = (params.spawnTime/100) * 1000
		}
		
		
		EventInstance.create(params).exec(function(err, created){
			if (err) {
				console.log(err);
				return res.negotiate(err);
			}
			
			return res.send({simulationId: created.simulation, eventId: created.event});
		});
	},
	
	viewEventResources: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		var eventId = params.eventId;
		
		Event.findOne({id: eventId})
		.populateAll()
		.then(function(event) {
			Resource.find({simulation: simulationId})
			.populateAll()
			.then(function(resources) {
				ResourceAccess.find({simulation: simulationId})
				.populateAll()
				.then(function(resourceAccessList) {
					EventResource.findOne({event: event.id})
					.then(function(eventResource) {
						//var viewPath = "Event" + process.env.DIRCHAR + "viewEventResources";
						return res.view("Event/viewEventResources", {
							event: event,
							resources: resources,
							resourceAccessList: resourceAccessList,
							eventResource: eventResource
						});
					});
				});
			});
		});
	},
	
	addEventResources: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulation;
		var eventId = params.eventId;
		
		EventResource.destroy({event: eventId}).then(function(err) {
			EventResource.create(params).exec(function(err, created){
				if (err) {
					console.log(err);
					return res.negotiate(err);
				}
				
				return res.send({simulationId: created.simulation});
			});
		});
	}
};

