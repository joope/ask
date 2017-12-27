/**
 * Suggestion.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

  	createdBy: {
  		model: 'user'
  	},

  	name: {
  		type: 'string'
  	},

  	question: {
  		model: 'question'
  	},

  	votes: {
      type: 'integer'
    },

    voters: {
      collection: 'user',
      via: 'voted'
    }
  }
};

