/**
 * ResourceController
 *
 * @description :: Server-side logic for managing Resources
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	viewResources: function(req, res) {
		var params = req.params.all();
		
		var simulationId = params.simulationId;
		
		Resource.find({simulation: simulationId}).then(function(resources) {
			return res.view('\\Resource\\viewResources', {
				simulationId: simulationId,
				resources: resources
			});
		});
	},
	
	addResource: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		
		Resource.create(params).exec(function(err, created){
			if (err) {
				console.log(err);
				return res.negotiate(err);
			}
			
			return res.send({simulationId: simulationId});
		});
	},
	
	viewResourceACL: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		
		
		//get all teams, roles, and resources for this simulation and send them to the page.		
		
		Simulation.findOne({id: simulationId})
		.populateAll()
		.then(function(simulation) {
			Role.find({simulation: simulationId})
			.then(function(roles) {
				
				var teams = simulation.teams;
				var teamsWithRoles = [];
				
				teams.forEach(function(team) {
					roles.forEach(function (role) {
						if (role.team == team.id)
						{
							teamsWithRoles.push({team: team,role: role});
						}
					});
				});


				Resource.find({simulation: simulationId})
				.then(function(resources){
					return res.view('\\Resource\\resourceACL', {
						simulationId: simulationId, 
						simulation: simulation,
						teamsWithRoles: teamsWithRoles,
						resources: resources
						});
				});
				
				
			});
		});
		
		
		
		
	}
	
};

