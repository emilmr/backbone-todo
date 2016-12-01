var app = app || {};

(function () {
	'use strict';

  var Todos = Backbone.Collection.extend({

    // Reference to this collection's model
    model: app.Todo,

    // Save all of the todo items under the todos-backbone namespace
    localStorage: new Backbone.LocalStorage('todos-backbone'),

    // Filter for all todo items that are completed
    completed: function() {
      return this.where({completed: true});
    },

    // Filter for todo items that are not yet completed
    remaining: function() {
      return this.where({completed: false});
    },

    // Generate sequential order for new todo items
    nextOrder: function() {
      return this.length ? this.last().get('order') + 1 : 1;
    },

    // Sort todos by their original insertion order
    comparator: 'order'

  });

  // Create global collection of todos
  app.todos = new Todos();

})();
