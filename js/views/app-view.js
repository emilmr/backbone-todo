var app = app || {};

(function ($) {
	'use strict';

  app.AppView = Backbone.View.extend({

    // Bind to the todoapp section in index.html
    el: '.todoapp',

    // Template for the line of statistics at the bottom of the app
    statsTemplate: _.template($('#stats-template').html()),

    // Events for creating new items and clearing completed ones
    events: {
     'keypress .new-todo': 'createOnEnter',
     'click .clear-completed': 'clearCompleted',
     'click .toggle-all': 'toggleAllComplete'
    },

    // At initialization, bind to the relevant events on the todos collection
    initialize: function() {
      this.allCheckbox = this.$('.toggle-all')[0];
      this.$input = this.$('.new-todo');
      this.$footer = this.$('.footer');
      this.$main = this.$('.main');

      this.listenTo(app.todos, 'add', this.addOne);
      this.listenTo(app.todos, 'reset', this.addAll);
      this.listenTo(app.todos, 'change:completed', this.filterOne);
      this.listenTo(app.todos, 'filter', this.filterAll);
      this.listenTo(app.todos, 'all', _.debounce(this.render, 0));

      app.todos.fetch({reset: true});
    },

    // Re-rendering to refresh the statistics
    render: function() {
      var completed = app.todos.completed().length;
      var remaining = app.todos.remaining().length;

      if ( app.todos.length ) {
        this.$main.show();
        this.$footer.show();

        this.$footer.html(this.statsTemplate({
         completed: completed,
         remaining: remaining
        }));

        this.$('.filters li a')
         .removeClass('selected')
         .filter('[href="#/' + ( app.TodoFilter || '' ) + '"]')
         .addClass('selected');
      } else {
        this.$main.hide();
        this.$footer.hide();
      }

      this.allCheckbox.checked = !remaining;
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`
    addOne: function( todo ) {
			var view = new app.TodoView({ model: todo });
		  $('.todo-list').append( view.render().el );
    },

    // Add all items in the todos collection at once
    addAll: function() {
			this.$('.todo-list').html('');
      app.todos.each(this.addOne, this);
    },

    filterOne: function (todo) {
      todo.trigger('visible');
    },

    filterAll: function () {
      app.todos.each(this.filterOne, this);
    },

    // Generate the attributes for a new Todo item.
    newAttributes: function() {
      return {
        title: this.$input.val().trim(),
        order: app.todos.nextOrder(),
        completed: false
      };
    },

    // Create new todo on hitting enter
    createOnEnter: function (e) {
      if (e.which === ENTER_KEY && this.$input.val().trim()) {
        app.todos.create(this.newAttributes());
        this.$input.val('');
      }
    },

    // Clear all completed todo items and destroy their models
    clearCompleted: function () {
      _.invoke(app.todos.completed(), 'destroy');
      return false;
    },

    toggleAllComplete: function () {
			var completed = this.allCheckbox.checked;

			app.todos.each(function (todo) {
				todo.save({
					completed: completed
				});
			});
		}
	});
})(jQuery);
