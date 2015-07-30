/**
 * RoleController
 *
 * @description :: Server-side logic for managing Roles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	viewRoles: function(req,res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		var teamId = params.teamId;
		
		Team.findOne({id: teamId}).then(function(team) {
			Role.find({team: teamId})
			.then(function(roles) {
				return res.view('Role/viewRoles', {
					simulationId: simulationId,
					team: team,
					roles: roles,
					page: '2a',
					title: "Add Roles to Team"
				});
			});
		});
	},
	
	addRole: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulation;
		var teamId = params.team;
		
		Role.create(params).exec(function(err, created){
			if (err) {
				console.log(err);
				return res.negotiate(err);
			}
			
			return res.send({simulationId: simulationId, teamId: teamId});
		});
	},
	
	deleteRole: function(req, res) {
		var params = req.params.all();
		var roleId = params.roleId;
		
		if (DeleteService.deleteRole(roleId)){
			return res.send({successful: true});
		}
	}
};

