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
		DeleteService.deleteTeam(teamId, function(status){
			return res.send({successful: status});
		});
	},
	
	checkTeamEvents: function(req, res) {
		var params = req.params.all();
		var teamId = params.teamId;
		
		Event.find({leadTeam: teamId})
		.then(function(events){
			if (events.length > 0){
				return res.send({associatedEvents: true});
			}
			else {
				return res.send({associatedEvent: false});
			}
		});
		
		
	}
	
};

