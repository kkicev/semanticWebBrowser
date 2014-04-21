/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var app = app || {};
// Todo Item View
// --------------
// The DOM element for a  item...
app.DefaultView = Backbone.View.extend({
//... is a list tag.
    tagName: 'li',
// Cache the template function for a single item.
    template: _.template($('#default-template').html()),

      events: {
        'click .toggle': 'toggleselected' // NEW
    },
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },
// Rerenders the titles of the items.
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.toggleClass('completed', this.model.get('selected')); 
        return this;
    },
// Toggle the `"selected"` state of the model.
    toggleselected: function() {
        this.model.toggle();
    }
});

