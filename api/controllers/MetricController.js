/**
 * MetricController
 *
 * @description :: Server-side logic for managing Metrics
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	viewMetrics: function(req, res) {
		var params = req.params.all();
		
		var simulationId = params.simulationId;
		
		Metric.find({simulation: simulationId}).then(function(metrics) {
			return res.view('\\Metric\\viewMetrics', {
				simulationId: simulationId,
				metrics: metrics
			});
		});
	},
	
	addMetric: function(req, res) {
		var params = req.params.all();
		
		var simulationId = params.simulationId;
		
		Metric.create(params).exec(function(err, created){
			if (err) {
				console.log(err);
				return res.negotiate(err);
			}
			
			return res.send({simulationId: created.simulation});
		});
	},
	
	viewMetricACL: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		var teams;
		
		//get all teams, roles, and metrics for this simulation and send them to the page.		
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


				Metric.find({simulation: simulationId})
				.then(function(metrics){
					
					MetricAccess.find({simulation: simulationId})
					.then(function (metricAccessList) {
						
						return res.view('\\Metric\\metricACL', {
							simulationId: simulationId, 
							teamsWithRoles: teamsWithRoles,
							metrics: metrics,
							metricAccessList: metricAccessList
							});
					});
				});	
			});
		});
	},
	
	processMetricACL: function(req, res) 
	{
		var params = req.params.all();
		var simulationId = params.simulationId;
		var metricAccessList = params.metricAccessList;
		
		if (metricAccessList.length != 0)
		{
			MetricAccess.destroy({simulation: simulationId}).then(function(err) {
				MetricAccess.create(metricAccessList).exec(function(err, created){
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
	}
	
	
	
};

