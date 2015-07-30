/**
 * TeamController
 *
 * @description :: Server-side logic for managing Teams
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	viewTeams: function (req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		
		Team.find({simulation: simulationId})
			.populateAll()
			.then(function(teams) {
				return res.view('Team/viewTeams', 
				{
					simulationId: simulationId,
					teams: teams,
					page: '2',
					title: "Add Teams to Simulation"
				});
			});
	},
	
	addTeam: function (req, res) {
		var params = req.params.all();
		
		Team.create(params).exec(function(err, created){
			if (err) {
				console.log(err);
				return res.negotiate(err);
			}
			
			return res.send({simulationId: created.simulation});
		});
	},
	
	deleteTeam: function(req, res) {
		var params = req.params.all();
		var teamId = params.teamId;
		
		if (DeleteService.deleteTeam(teamId)) {
			return res.send({successful: true});
		}
		
	},
	
	checkTeamEvents: function(req, res) {
		var params = req.params.all();
		var teamId = params.teamId;
		
		Event.find({leadTeam: teamId})
		.then(function(events){
			console.log(events);
			if (events){
				return res.send({associatedEvents: true});
			}
			else {
				return res.send({associatedEvent: false});
			}
		});
		
		
	}
	
};

