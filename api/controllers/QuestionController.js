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

	newQuestion: function(req, res) {
		Question.create({name: req.param('name')})
		.then(function(question) {
			return res.redirect('/question/' + question.id)
		})
		.catch(function(err) {
			return res.view('500');
		});
	}
};

