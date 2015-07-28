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
			return res.view('Resource/viewResources', {
				simulationId: simulationId,
				resources: resources,
				page: '3',
				title: "View Resource Pool"
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
		var teams;
		
		//get all teams, roles, and resources for this simulation and send them to the page.		
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


				Resource.find({simulation: simulationId})
				.then(function(resources){
					
					ResourceAccess.find({simulation: simulationId})
					//.populate('role').populate('resource')
					.then(function (resourceAccessList) {
						//not necessary to populate anything in this list since we have the list of resources and roles already
						/*if (resourceAccessList.length != 0)
						{
							var sT = _.indexBy(teams, 'id');
							
							resourceAccessList = _.map(resourceAccessList, function(resourceAccess) {
								resourceAccess.role.team = sT[resourceAccess.role.team];
								
								return resourceAccess;
							});				

						}*/
						
						return res.view('Resource/resourceACL', {
							simulationId: simulationId, 
							teamsWithRoles: teamsWithRoles,
							resources: resources,
							resourceAccessList: resourceAccessList,
							page: '4'
						});
					});
				});	
			});
		});
	},
	
	processResourceACL: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		var resourceAccessList = params.resourceAccessList;
		
		//console.log(resourceAccessList);
		//console.log(simulationId);
		
		//var resourceAccess = resourceAccessList[0];
		//console.log(resourceAccess);
		
		
		if (resourceAccessList.length != 0)
		{
			ResourceAccess.destroy({simulation: simulationId}).then(function(err) {
				ResourceAccess.create(resourceAccessList)
				.exec(function(err, created){
					if (err) {
						console.log(err);
						return res.negotiate(err);
					}
					return res.send({simulationId: simulationId});
				});
			});
		}
		else
		{
			return res.send({simulationId: simulationId});
		}
		
	}
	
};

