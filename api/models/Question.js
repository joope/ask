/**
 * Question.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

  	name: {
  		type: 'string'
  	},

  	createdBy: {
  		model: 'user'
  	},

  	suggestions: {
  		collection: 'suggestion',
  		via: 'question'
  	},

    voters: {
      collection: 'user',
      via: 'voted'
    }
  }
};

