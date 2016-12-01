var app = app || {};

(function () {
	'use strict';

	var TodoRouter = Backbone.Router.extend({
		routes: {
			'*filter': 'setFilter'
		},

		setFilter: function (param) {
			// Set the current filter to be used
			app.TodoFilter = param || '';

			// Trigger a collection filter event
			app.todos.trigger('filter');
		}
	});

	app.TodoRouter = new TodoRouter();
	Backbone.history.start();
  
})();
