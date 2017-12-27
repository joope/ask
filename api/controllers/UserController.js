/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req, res) {
		User.findOne({
			name: req.body.name,
		})
		.then(function(user){
			if (user) {
				// if (user.password === req.body.password) {
					req.session.userId = user.id;	
					return res.redirect(req.session.redirectURL || '/');
				// } else {
				//	return res.redirect('/login/');
				// }
			}
			User.create({
				name: req.body.name
			})
			.then(function(user){
				console.log(user);
				req.session.userId = user.id;	
				return res.redirect(req.session.redirectURL || '/');
			}).catch(function(err){
				return res.err(err);
			})
		})
		.catch(function(err){
			return res.err(err);
		})
	},

	// login: function(req, res) {
	// 	var name = req.body.name;
	// 	var password = req.body.password;
	// 	if (name && password) {
	// 		User.findOne({name: name, password: password})
	// 		.then(function(user){
	// 			if (user){
	// 				req.session.authenticated = true;
	// 				req.session.user = user;
	// 				return res.redirect('/');
	// 			} else {
	// 				return res.redirect('/login');	
	// 			}
	// 		})
	// 	}
	// }
};

