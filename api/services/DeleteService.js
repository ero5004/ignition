/**
 * DeleteService
 *
 * @description :: Service to handle deletion of models 
 */
 
module.exports = {
	
	deleteRole: function(roleId) {
		Role.destroy({id: roleId}).then(function(err){
			if (err) {
				console.log(err);
				return false;
			}
			
			return DeleteService.cleanupDeleteRole(roleId);
		});
	},
	
	cleanupDeleteRole: function(roleId) {
		ResourceAccess.destroy({role: roleId}).then(function(err){
			if (err) {
				console.log(err);
				return false;
			}
			MetricAccess.destroy({role: roleId}).then(function(err){
				if (err) {
					console.log(err);
					return false;
				}	
				EventAccess.destroy({role: roleId}).then(function(err){
					if (err) {
						console.log(err);
						return false;
					}
					return true;
				});
			});
		});
	},
	
	deleteTeam: function(teamId) { 
		Team.destroy({id: teamId}).exec(function(err){
			if (err) {
				console.log(err);
				return false;
			}
			
			Role.destroy({team: teamId}).exec(function(err, roles){
				if (err) {
					console.log(err);
					return false;
				}
				roles.forEach(function(role){
					if (!DeleteService.cleanupDeleteRole(role.id)){
						return false;
					}
				});
			});
		});
	
	}
	
}