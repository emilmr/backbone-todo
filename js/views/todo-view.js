var app = app || {};

(function ($) {
	'use strict';

  app.TodoView = Backbone.View.extend({

    //DOM element for easch todo is a list tag
    tagName: 'li',

    // Cache the template function for a single item
    template: _.template($('#item-template').html()),

    // Events for a single todo item
    events: {
      'click .toggle': 'toggleCompleted',
			'dblclick label': 'edit',
			'click .destroy': 'clear',
			'keypress .edit': 'updateOnEnter',
			'keydown .edit': 'revertOnEscape',
			'blur .edit': 'close'
    },

    // Listen for changes to model and re-render
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'visible', this.toggleVisible);
    },

    // Re-renders the titles of the todo item.
    render: function() {
      // Backbone LocalStorage is adding `id` attribute instantly after
			// creating a model.  This causes our TodoView to render twice. Once
			// after creating a model and once on `id` change.  We want to
			// filter out the second redundant render, which is caused by this
			// `id` change.  It's known Backbone LocalStorage bug, therefore
			// we've to create a workaround.
			// https://github.com/tastejs/todomvc/issues/469
			if (this.model.changed.id !== undefined) {
				return;
			}

			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass('completed', this.model.get('completed'));
			this.toggleVisible();
			this.$input = this.$('.edit');
			return this;
    },

    toggleVisible: function () {
			this.$el.toggleClass('hidden', this.isHidden());
		},

		isHidden: function () {
			return this.model.get('completed') ?
				app.TodoFilter === 'active' :
				app.TodoFilter === 'completed';
		},

		// Toggle the `"completed"` state of the model.
		toggleCompleted: function () {
			this.model.toggle();
		},

    // Switch this view into edit mode, displaying the input field
    edit: function() {
      this.$el.addClass('editing');
			this.$input.focus();
    },

    // Close the edit mode, saving changes to the todo item
    close: function() {
      var value = this.$input.val();
			var trimmedValue = value.trim();

			if (!this.$el.hasClass('editing')) {
				return;
			}

			if (trimmedValue) {
				this.model.save({ title: trimmedValue });
			} else {
				this.clear();
			}

			this.$el.removeClass('editing');
    },

    // If user hits enter, close edit mode
    updateOnEnter: function (e) {
			if (e.which === ENTER_KEY) {
				this.close();
			}
		},

    //If user hits escape, just reset and leave the edit state
    revertOnEscape: function (e) {
      if (e.which === ESC_KEY) {
        this.$el.removeClass('editing');
        // Also reset the hidden input back to the original value
        this.$input.val(this.model.get('title'));
      }
    },

    // Remove the item and destroy the model
    clear: function () {
			this.model.destroy();
		}
	});
})(jQuery);
