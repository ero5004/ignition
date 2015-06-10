/**
 * SimulationController
 *
 * @description :: Server-side logic for managing Simulations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	newSimulation: function(req, res) {
		console.log('new simulation');
		return res.view('Simulation/newSimulation');
	},
	
	processNewSimulation: function(req, res) {
		var params = req.params.all();
		console.log(params);
		return res.json({
			todo: 'process data from new simulation form'
		})
	}
};

