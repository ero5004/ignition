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
	
	cleanupDeleteRole: function(roleId, cb) {
		ResourceAccess.destroy({role: roleId}).exec(function(err, resourceAccesses){
			if (err) {
				console.log(err);
				return cb(false);
			}
			MetricAccess.destroy({role: roleId}).exec(function(err, metricAccesses){
				if (err) {
					console.log(err);
					return cb(false);
				}
				EventAccess.destroy({role: roleId}).exec(function(err, eventAccesses){
					if (err) {
						console.log(err);
						return cb(false);
					}
					return cb(true);
				});
			});
		});
	},
	
	deleteTeam: function(teamId, cb) { 
		Team.destroy({id: teamId}).exec(function(err){
			if (err) {
				console.log(err);
				return cb(false);
			}
			
			Role.destroy({team: teamId}).exec(function(err, roles){
				if (err) {
					console.log(err);
					return cb(false);
				}
				
				//create list of all role ids that were associated with that team
				var rolesArray = [];
				roles.forEach(function(role){
					rolesArray.push(role.id);
					
				});
				
				DeleteService.cleanupDeleteRole(rolesArray, function(status){
					return cb(status);
				});
			});
		});
	
	}
	
}