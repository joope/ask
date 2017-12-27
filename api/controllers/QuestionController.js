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
		Question.findOne({ id: req.params.id })
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
			createdBy: req.session.userId,
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
			return res.redirect('/question/' + req.params.id);
		}
		if (!Array.isArray(votes)) {
			votes = [votes];
		}
		Question.findOne({ id: req.params.id })
		.populate('suggestions')
		.populate('voters')
		.then(function(question) {
			var canVote = true;
			question.voters.forEach(function(voter){
				if (voter.id === req.session.userId) {
					canVote = false;
				}
			});
			if (!canVote) return  res.redirect('/question/' + req.params.id);
			question.voters.add(req.session.userId);
			question.save({ populate: false }, function(err){});
			question.suggestions.forEach(function(suggestion, index) {
				var vote = (votes.indexOf(suggestion.id) === -1) ? -1: 1;
				suggestion.votes = suggestion.votes + vote;
			});
			console.log(question);
			question.save({ populate: false }, function(err) {
				return res.redirect('/question/' + req.params.id);
			});
		})
		.catch(function(err){
			console.log(err);
			return res.view('500');
		})
	}
};

