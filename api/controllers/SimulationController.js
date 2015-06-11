/**
 * SimulationController
 *
 * @description :: Server-side logic for managing Simulations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	newSimulation: function(req, res) {
		return res.view('Simulation/newSimulation');
	},
	
	processNewSimulation: function(req, res) {
		
		var params = req.params.all();
		params.owner = req.user.id;
		Simulation.create(params).exec(function(err, created){
			if (err) {
				console.log(err);
				return res.negotiate(err);
			}
			return res.redirect('/dashboard');
		});
	}
};

