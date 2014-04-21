/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var app = app || {};
// The Application

app.MainSection = Backbone.View.extend({
// Instead of generating a new element, bind to the existing skeleton of
// the app already present in the HTML.
    el: '#selectSection',
// Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),
    
    // New
// Delegated events for creating new items, and clearing completed ones.
    events: {
          'click .next': 'next',
          'click .prev': 'prev',
          'keyup .searchBox': 'search',
          'click .selection': 'filter'
    },
// At initialization we bind to the relevant events on the `Movies`
// collection, when items are added or changed.
    initialize: function() {
        this.$main = this.$('#selectMain');
        this.listenTo(this.collection, 'add', this.addOne);
        this.listenTo(this.collection, 'reset', this.reset);
        this.listenTo(this.collection, 'fetch', this.addAll);  
        this.listenTo(this.collection, 'change:changed', this.registerComponent);
        this.listenTo(this.collection, 'all', this.render);
    },

//    render: function() {
//        if (this.collection.length) {
////            this.$main.show();
//        } else {
////            this.$main.hide();
//        }
//    },

    addOne: function(defaultModel) {
        var view = new app.DefaultView({model: defaultModel});
        $('#select-list').append(view.render().el);
    },
// Add all items in the **Movies** collection at once.
        reset:function(){
        $('#searchBoxClasses').val('');
        $('#selectSection :radio[value=Selected]').attr('checked', false);
        $('#selectSection :radio[value=All]').attr('checked', true);
        this.$('#select-list').html('');
    },
    addAll: function() {
        this.$('#select-list').html('');
       this.collection.each(this.addOne, this);
    },
   registerComponent:function(model){
       var value=model.attributes.resource.value;
       var selected=model.attributes.selected;
       var c=app.getClass(value);
       if(c!=="")
       {
        app.removeComponent(c);
        app.onSelectionChanged(value);
       }
       else
       app.createComponent(value);
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
        this.$('#select-list').html('');
        models.each(this.addOne, this);
    },
      filter: function(event) {
        var v = event.target.value;
        
        var models;
        if (v === "Selected")
        {
          models = this.collection.selected(); 
        }
        else
        {
          models=this.collection;
        }
        $('#searchBoxClasses').val('');
        this.$('#select-list').html('');
        models.forEach(this.addOne, this);
    }        
});

