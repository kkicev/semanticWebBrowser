/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var app = app || {};
// The Application

app.DatasetSection = Backbone.View.extend({
// Instead of generating a new element, bind to the existing skeleton of
// the app already present in the HTML.
    el: '#datasetSection',
// Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),
    // New
// Delegated events for creating new items, and clearing completed ones.
    events: {
        'click .next': 'next',
        'click .prev': 'prev',
        'keyup .searchBox': 'search'
    },
// At initialization we bind to the relevant events on the `Movies`
// collection, when items are added or changed.
    initialize: function() {
        this.$main = this.$('#datasetMain');
        this.listenTo(this.collection, 'add', this.addOne);
        this.listenTo(this.collection, 'reset', this.reset);
        this.listenTo(this.collection, 'fetch', this.addAll);
        this.listenTo(this.collection, 'change:changed', this.getClassesForDataset);
        this.listenTo(this.collection, 'all', this.render);
    },
    addOne: function(defaultModel) {
        var view = new app.DefaultView({model: defaultModel});
        $('#dataset-list').append(view.render().el);
    },
    reset: function() {
        this.$('#dataset-list').html('');
    },
    addAll: function() {
        this.$('#dataset-list').html('');
        this.collection.each(this.addOne, this);
    },
    getClassesForDataset: function(model) {
        var select = model.attributes.selected;

        document.getElementById("wraperClasses").innerHTML = "";
        app.selectedClasses = {};
        app.selection = {};
        app.classesSection.collection.reset();

        if (select)
        {
            var value = model.attributes.resource.value;
            var selected = this.collection.selected();
            var i = 0;
            for (i = 0; i < selected.length; i++)
            {
                if (selected[i].attributes.resource.value !== value)
                {
                    selected[i].set("selected", false);
                }
                app.dataset = value;
                app.classesSection.collection.fetch();

            }
        }
        else
        {
            app.dataset = "";
        }
    },
   search: function(event) {
        var v = event.target.value;
        
        var models;
        if (v !== "")
        {
            models = this.collection.chain()
                    .filter(function(item) {
                return checkExists(item.get("name"),v);
            });
            
        }
        else
        {
          models=this.collection;
        }
        this.reset();
        models.each(this.addOne, this);
    }
});

