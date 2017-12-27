
module.exports = {
	userVoted: function(object, userId) {
		for (var i = 0; i < object.voters.length; i++) {
			if (object.voters[i].id === userId) return true;
		};
		return false;
	}
}