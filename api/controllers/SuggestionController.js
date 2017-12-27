/**
 * SuggestionController
 *
 * @description :: Server-side logic for managing suggestions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	new: function(req, res) {
		Question.findOne({id: req.param('question')})
		.populate('suggestions')
		.then(function(question){
			console.log(question);
			if (new Date(question.suggestion_dealine) < new Date()) {
				return res.redirect('/question/' + req.param('question'));
			}
			question.suggestions.add({
				name: req.param('name'),
				question: req.param('question'),
				votes: 0
			});
			question.save({}, function(err) {
				return res.redirect('/question/' + req.param('question'));
			});

		})
		.catch(function(err) {
			console.log(err);
			return res.view('500');
		});
	},

	vote: function(req, res){
		return res.send('Äänestettiin');
	}
};

