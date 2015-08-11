/**
 * InvitesController
 *
 * @description :: Server-side logic for managing Invites
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 
module.exports = {
	/* use this: http://stackoverflow.com/questions/23446484/sails-js-populate-nested-associations
	to get the users (and simulations) populated into each invite
	*/
	dashboard: function(req, res) {
		User.findOne({ id: req.user.id })
			.populateAll()
			.then(function(user) {
				var invitedUsers = User.find(
				{ id: _.pluck(user.sentInvitations, 'invitee') })
				.then(function(invitedUsers) {
					return invitedUsers;
				});
				
				var invitedSimulations = Simulation.find(
				{ id: _.pluck(user.sentInvitations, 'simulation') })
				.then(function(invitedSimulations) {
					return invitedSimulations;
				});
				
				//other users that sent this user an invitation
				var userInviters = User.find(
				{ id: _.pluck(user.receivedInvitations, 'inviter') })
				.then(function(userInviters) {
					return userInviters;
				});
				
				var simulationsInvited = Simulation.find(
				{ id: _.pluck(user.receivedInvitations, 'simulation') })
				.then(function(simulationsInvited) {
					return simulationsInvited;
				});
				
				return [user, invitedUsers, invitedSimulations, userInviters, simulationsInvited]
			})
			.spread(function (user, invitedUsers, invitedSimulations, userInviters, simulationsInvited) {
				var iU = _.indexBy(invitedUsers, 'id');
				var iS = _.indexBy(invitedSimulations, 'id');
				var uI = _.indexBy(userInviters, 'id');
				var sI = _.indexBy(simulationsInvited, 'id');
				
				user.sentInvitations = _.map(user.sentInvitations, function(invitation) {
					invitation.invitee = iU[invitation.invitee];
					invitation.simulation = iS[invitation.simulation];
					return invitation;
				});
				
				user.receivedInvitations = _.map(user.receivedInvitations, function(invitation) {
					invitation.inviter = uI[invitation.inviter];
					invitation.simulation = sI[invitation.simulation];
					return invitation;
				});
				
				return res.view('dashboard', {
					simulations: user.simulations,
					receivedInvitations: user.receivedInvitations,
					sentInvitations: user.sentInvitations,
					page: '0',
					title: "Dashboard"
				});
			})
			.catch (function (err)
			{
				if (err) {
					return res.serverError(err)
				}
			});
	},
	
	invite: function(req, res) {
		var params = req.params.all();
		var simulationId = params.simulation;
		
		Simulation.findOne({ id: simulationId })
		.populate('invitations')
		.populate('teams')
		.exec(function(err, simulation) {
			//change query to get all users except currently logged in one
			User.find( {id: {'!': req.user.id } } ).exec(function(err, users) {
				var invitedUsers = [];
				var userIds = [];
				simulation.invitations.forEach(function(invite) {
					//could also include inviter to show who sent each invite
					invitedUsers.push({invitee: invite.invitee, role: invite.role});
				});
				
				var iU = _.indexBy(invitedUsers, 'invitee');
				
				Role.find({simulation: simulationId})
				.then(function(roles) {
					
					teams = simulation.teams;
					
					teams.forEach(function(team) {
						roles.forEach(function (role) {
							if (role.team == team.id)
							{
								role.team = team;
							}
						});
					});
					
					var rolesSorted = _.indexBy(roles, 'id');
					
					return res.view('Invite/invite', {
						users: users,
						invitedUsers: iU,
						simulationId: simulation.id,
						roles: rolesSorted,
						page: '0',
						title: "Invite Users to Simulation"
					});
				});
			});
		});
	},
	
	processInvitations: function(req, res) {
		var params = req.params.all();
		var usersToInvite = params.usersToInvite;
		var simulationId = params.simulationId;
		var user = req.user;
		
		usersToInvite.forEach(function (userToInvite) {
			
			Invite.findOrCreate({
					inviter: user.id,
					invitee: userToInvite.invitee,
					simulation: simulationId,
				},{
					inviter: user.id,
					invitee: userToInvite.invitee,
					simulation: simulationId,
				}
				).then(function (record) {
					console.log(record);
					Invite.update({id: record.id}, {
						inviteStatus: 0, //invite is pending
						role: userToInvite.role
						})
						.exec(function(err, updated){
							if (err) {
								console.log(err);
								return res.negotiate(err);
							}
						});
					
				
					
					
				});
		});
	}
	
};

