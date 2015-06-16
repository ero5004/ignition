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
				{
					id: _.pluck(user.sentInvitations, 'invitee') 
				}
			).then(function(invitedUsers) {
				return invitedUsers;
			});
			return [user, invitedUsers]
			})
			.spread(function (user, invitedUsers) {
				var iU = _.indexBy(invitedUsers, 'id');
				
				user.sentInvitations = _.map(user.sentInvitations, function(invitation) {
					invitation.invitee = iU[invitation.invitee];
					return invitation;
				});
				return res.view('dashboard', {
					simulations: user.simulations,
					receivedInvitations: user.receivedInvitations,
					sentInvitations: user.sentInvitations
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
		var simulation = params.simulation;
		
		Simulation.findOne({ id: simulation }).populate('invitations').exec(function(err, simulation) {
			//change query to get all users except currently logged in one
			User.find( {id: {'!': req.user.id } } ).exec(function(err, users) {
				var invitedUsers = [];
				var userIds = [];
				simulation.invitations.forEach(function(invite) {
					//could also include inviter to show who sent each invite
					invitedUsers.push(invite.invitee);
				});
				
				return res.view('Invite/invite', {
					users: users,
					invitedUsers: invitedUsers,
					simulationId: simulation.id
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
			Invite.create({
				inviter: user.id,
				invitee: userToInvite,
				simulation: simulationId,
				inviteStatus: 0 //invite is pending
			}).exec(function (err, created) {
					if (err) {
						console.log(err);
						return res.negotiate(err);
					}
				});
		});
	}
	
};

