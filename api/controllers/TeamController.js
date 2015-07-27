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
					page: '2'
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
	
};

