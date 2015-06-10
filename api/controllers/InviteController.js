/**
 * InvitesController
 *
 * @description :: Server-side logic for managing Invites
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	dashboard: function(req, res) {
		User.findOne({ id: req.user.id }).exec(function(err, user) {
			console.log(user);
		});
		
		return res.view('dashboard', {
			//data to be transmitted to view to be added here
		});
	}
	
};

