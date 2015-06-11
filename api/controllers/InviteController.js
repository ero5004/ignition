/**
 * InvitesController
 *
 * @description :: Server-side logic for managing Invites
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	dashboard: function(req, res) {
		User.findOne({ id: req.user.id }).populate('simulations').exec(function(err, user) {
			//user.simulations contains all simulations owned by that user
			return res.view('dashboard', {
				simulations: user.simulations
			});
		});
	},
	
	invite: function(req, res) {
		var params = req.params.all();
		var simulation = params.simulation;
		console.log(simulation);
		
		User.find().exec(function(err, users) {
			return res.view('Invite/invite', {
				users: users
			});		
		});
	}
	
};

