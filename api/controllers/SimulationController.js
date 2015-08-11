/**
 * SimulationController
 *
 * @description :: Server-side logic for managing Simulations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	newSimulation: function(req, res) {
		return res.view('Simulation/newSimulation',
		{
			page: '1',
			title: "Create New Simulation"
		});
	},
	
	processNewSimulation: function(req, res) {
		
		var params = req.allParams();
		
		params.owner = req.session.user.id;
		Simulation.create(params).exec(function(err, created){
			if (err) {
				console.log(err);
				return res.negotiate(err);
			}
			
			return res.send({simulationId: created.id});
		});
	},
	
	editSimulation: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		
		Simulation.findOne({id: simulationId})
		.then(function(simulation){
			return res.view('Simulation/editSimulation',
			{
				page: '1',
				title: 'Edit Existing Simulation',
				simulation: simulation
			});
		});
	},
	
	processEditSimulation: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulationId;
		
		Simulation.update({id: simulationId}, params)
		.exec(function(err, updated){
			if (err) {
				console.log(err);
				return res.negotiate(err);
			}
			return res.send({simulationId: updated[0].id});
		});
	}
};

