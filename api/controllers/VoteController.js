/**
 * VoteController
 *
 * @description :: Server-side logic for managing votes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	new: function(req, res) {
		console.log(req.param('vote'));
		Suggestion.findOne({id: req.params.id})
		.populate('votes')
		.then(function(suggestion){
			console.log(suggestion);
			Vote.create({
				createdBy: req.session.user,
				suggestion: req.params.id,
				value: 1
			})
		})
	}

};

