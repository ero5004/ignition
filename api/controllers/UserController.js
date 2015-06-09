/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 
var passport = require('passport');

module.exports = {
	login: function(req, res) {
        passport.authenticate('local', function(err, user, info) {
            if ((err) || (!user)) {
                return res.send({
                    message: info.message,
                    user: user
                });
            }
            req.logIn(user, function(err) {
                if (err) res.send(err);
				res.redirect('/Dashboard');
                /*return res.send({
                    message: info.message,
                    user: user
                });*/
            });

        })(req, res);
    },

    logout: function(req, res) {
        req.logout();
        res.redirect('/');
    },
	
	signup: function(req, res) {
		var params = req.params.all();
		
		/*var email = params.email;
		var password = params.password;
		var name = params.name;
		var bio = params.bio;*/
		
		User.create(params).exec(function(err, created){
			if (err) {
				console.log(err);
				return res.negotiate(err);
			}
			return res.redirect('/');
		});
	}
};

