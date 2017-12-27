/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req, res) {
		var password = Math.random().toString(6).slice(2);
		User.create({
			name: req.body.name,
			password: req.body.password,
		})
		.then(function(user){
			console.log(user);
			res.redirect('/');
		})
		.err(function(err){
			res.err(err);
		})
	},

	login: function(req, res) {
		var name = req.body.name;
		var password = req.body.password;
		if (name && password) {
			User.findOne({name: name, password: password})
			.then(function(user){
				if (user){
					res.cookie('user', user, { signed: true });
					res.redirect('/');
				} else {
					res.redirect('/login');	
				}
			})
		}
	}
};

