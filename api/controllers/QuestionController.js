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
		var timer = new Date();
		Question.findOne({ id: req.params.id })
		.populate('voters')
		.populate('createdBy')
		.then(function(question) {
			console.log(question);
			if (!question) return res.redirect('/');

			var status = '';
			question.votes = question.voters.length;

			if (UserService.userVoted(question, req.session.userId)) {
				status = 'voted';
			} else if (new Date(question.suggestions_deadline) > new Date()) {
				status = 'suggesting';
			} else if (new Date(question.vote_deadline) > new Date()) {
				status = 'voting';
			}
			if (new Date(question.vote_deadline) <= new Date()){
				status = 'closed';
			}

			var sort = (status === 'voted' || status === 'closed') ?
				'votes DESC': 
				'createdAt DESC';

			Suggestion.find({
				where: { question: question.id },
				limit: 100,
				sort: sort
			})
			.populate('voters')
			.then(function(suggestions) {
				// if (status === 'voting') { 
				// 	suggestions = UtilsService.shuffle(suggestions);
				// }
				return res.view('question', { 
					question: question, 
					suggestions: suggestions, 
					status: status 
				});
			})
			.catch(function(err){ 
				console.log(err);
				return res.view('500')} );
		})
		.catch(function(err) { 
			console.log(err);
			return res.view('500')
		});
	},

	new: function(req, res) {
		var now = new Date();
		now.setMinutes(now.getMinutes() + 5);
		suggestions_deadline = now.toISOString();
		now.setMinutes(now.getMinutes() + 5);
		vote_deadline = now.toISOString();
		Question.create({
			name: req.param('name'),
			createdBy: req.session.userId,
			suggestions_deadline: suggestions_deadline,
			vote_deadline: vote_deadline
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
			var voted = UserService.userVoted(question, req.session.userId);
			if (voted) return  res.redirect('/question/' + req.params.id);

			question.voters.add(req.session.userId);
			question.save({ populate: false }, function(err){});
			question.suggestions.forEach(function(suggestion, index) {
				var vote = (votes.indexOf(suggestion.id) === -1) ? 0: 1;
				suggestion.votes = suggestion.votes + vote;
				suggestion.save({}, function(err){});
			});
			console.log(question);
			question.save({}, function(err) {
				return res.redirect('/question/' + req.params.id);
			});
		})
		.catch(function(err){
			console.log(err);
			return res.view('500');
		})
	}
};

