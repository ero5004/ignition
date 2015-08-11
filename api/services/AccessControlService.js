/**
 * DeleteService
 *
 * @description :: Service to determine which resources, metrics, and events a user has access to
 */
 
module.exports = {
	
	getResourceAccessInfo: function(simulationId, roleId, cb) {
		ResourceAccess.find({simulation: simulationId, role: roleId})
		.populate("resource")
		.then(function(resourceAccesses){
			return cb(resourceAccesses);
		});
	},
	
	getMetricAccessInfo: function(simulationId, roleId, cb) {
		MetricAccess.find({simulation: simulationId, role: roleId})
		.populate("metric")
		.then(function(metricAccesses){
			return cb(metricAccesses);
		});
	},
	
	getEventAccessInfo: function(simulationId, roleId, cb) {
		EventAccess.find({simulation: simulationId, role: roleId})
		.populate("owningTeam")
		.then(function(eventAccesses){
			return cb(eventAccesses);
		});
	}
}