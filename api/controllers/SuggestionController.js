/**
 * SuggestionController
 *
 * @description :: Server-side logic for managing suggestions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	newSuggestion: function(req, res){
		Suggestion.create({
			name: req.param('name'),
			question: req.param('question'),
			votes: 0
		})
		.then(function(suggestion){
			res.redirect('/question/' + req.param('question'));
		})
		.catch(function(err) {
			return res.view('500');
		});
	}
};
