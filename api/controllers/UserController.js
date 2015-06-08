/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	login: function(req, res) {
		//search for username in db and check if password matches.
	},
	
	signup: function(req, res) {
		var params = req.params.all();
		var email = params.email;
		var password = params.password;
		var name = params.name;
		var bio = params.bio;
		
		User.create(params).exec(callback);
	}
};

