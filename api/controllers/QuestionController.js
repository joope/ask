/**
 * QuestionController
 *
 * @description :: Server-side logic for managing questions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getAll: function(req, res) {
		Question.find()
		.sort('createdAt DESC')
		.then(function(questions) {
			return res.view('index', { questions: questions });
		})
		.catch(function(err) {
			return res.view('500');
		});
	},

	show: function(req, res) {
		Question.findOne({id: req.params.id})
		.populate('suggestions')
		.then(function(question) {
			console.log(question);
			return res.view('question', { question: question });
		})
		.catch(function(err) {
			return res.view('500');
		});
	},

	new: function(req, res) {
		Question.create({
			name: req.param('name'),
			user_id: "anon",
			suggestions_deadline: "2017-12-26T22:02:49.501Z",
			vote_deadline: "12-28-2017"
		})
		.then(function(question) {
			return res.redirect('/question/' + question.id)
		})
		.catch(function(err) {
			return res.view('500');
		});
	},

	vote: function(req, res) {
		console.log(req.param('suggestion'));
		var votes = req.param('suggestion');

		if (!votes) {
			return res.view(403);
		}
		if (!Array.isArray(votes)) {
			votes = [votes];
		}
		votes.forEach(function(id){

			Suggestion.findOne({id: id})
			.then(function(suggestion){
				console.log('1');
				Suggestion.update({id: id}, {votes: suggestion.votes + 1})
				.then(function(suggestion){
					console.log('2');
					return res.redirect('/question/' + req.params.id);
				})
				.catch(function(err){
					console.log(err);
					return res.view('500');
				});
			})
			.catch(function(err){
				console.log(err);
				return res.view('500');
			});
		});
		return res.view('500');
	}
};

