
  var app = app || {};

  var TodoList = Backbone.Collection.extend({

    // Reference to this collection's model
    model: app.Todo,

    // Save all of the todo items under the todos-backbone namespace
    localStorage: new Backbone.LocalStorage('todos-backbone'),

    // Filter for all todo items that are completed
    completed: function() {
      return this.filter(function( todo ) {
        return todo.get('completed');
      });
    },

    // Filter for todo items that are not yet completed
    remaining: function() {
      return this.without.apply( this, this.completed() );
    },

    // Generate sequential order for new todo items
    nextOrder: function() {
      if ( !this.length ) {
        return 1;
      }
      return this.last().get('order') + 1;
    },

    // Sort todos by their original insertion order
    comparator: function( todo ) {
      return todo.get('order');
    }
  });

  // Create global collection of todos
  app.Todos = new TodoList();
