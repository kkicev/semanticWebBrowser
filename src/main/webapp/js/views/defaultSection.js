/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
//When Defining new Section from Default Section in constructor you should 
//pass (collection,listID)

var app = app || {};
// The Application
app.DefaultSection = Backbone.View.extend({

// Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),
    // New
// Delegated events for creating new items, and clearing completed ones.
    events: {
          'click .next': 'next',
          'click .prev': 'prev',
          'keyup .searchBox': 'search',
          'click .selection': 'filter',
          'click .inPropertie': 'changeInPropertieStat',
          'click .outPropertie': 'changeOutPropertieStat'
    },
// At initialization we bind to the relevant events on the
// collection, when items are added or changed.
    initialize: function(options) {
        this.footerID=options.footerID;
        this.listID=options.listID;
        this.sectionID=options.sectionID;
        this.$el=$('#'+this.sectionID);
        this.listenTo(this.collection, 'add', this.addOne);
        this.listenTo(this.collection, 'reset', this.reset);
        this.listenTo(this.collection, 'fetch', this.addAll);  
        this.listenTo(this.collection, 'change:changed', this.selectionChanged);
        this.listenTo(this.collection, 'all', this.render);
    },
    // New
// Rerendering the app just means refreshing the statistics -- the rest
// of the app doesn't change.
    render: function() {
        
        var selected = this.collection.selected().length;

        var page=this.collection.page;
            $('#'+this.footerID).show();
            $('#'+this.footerID).html(this.statsTemplate({
                selected: selected,
                page:page
            }));
    },

    addOne: function(entity) {
        if(app.checkSelection(this.collection.resource,entity.attributes.resource.value))
        {
         entity.set("selected",true);    
        } 
        var view = new app.DefaultView({model: entity});
        $('#'+this.listID).append(view.render().el);
    },
// Add all items in the  collection at once.
        reset:function(){
        $('#'+this.sectionID+'SearchBox').val('');
        $('#'+this.sectionID+' :radio[value=Selected]').attr('checked', false);
        $('#'+this.sectionID+' :radio[value=All]').attr('checked', true);
        this.$('#'+this.listID).html('');
    },
    addAll: function() {
        this.$('#'+this.listID).html('');
        this.collection.each(this.addOne, this);
    }, 
selectionChanged:function(){
       var selected=this.collection.selected();
        var items=[];
       if(selected.length>0)
           {
            var i=0;
            for(i;i<selected.length;i++)
            {
            items.push(selected[i].attributes.resource.value);
            }
            app.selection[this.collection.resource]=items;
           }
        else
        {
            delete app.selection[this.collection.resource];
        }
        app.onSelectionChanged(this.collection.resource);
   },        
 prev: function() {
    if(this.collection.page===1)
    {
    return false;
    }
    else
    {
            --this.collection.page;
            this.collection.reset(); 
            this.collection.fetch();
    }    
  },
 
  next: function() {
            ++this.collection.page;
            this.collection.reset(); 
            this.collection.fetch(); 
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
         this.$('#'+this.listID).html('');
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
        
        $('#'+this.sectionID+'SearchBox').val('');
        this.$('#'+this.listID).html('');
        models.forEach(this.addOne, this);
    },
    changeInPropertieStat: function(event) {
        var newStat = event.target.value;
        var name=event.target.name;
        var changed=app.changePropStatByPropName("inPropertie",this.collection.resource,name,newStat);
        if(changed)
        {
         app.reloadDataForClass(this.collection.resource);
        }
    },
    changeOutPropertieStat: function(event) {
        var newStat = event.target.value;
        var name=event.target.name;
        var changed=app.changePropStatByPropName("outPropertie",this.collection.resource,name,newStat);
        if(changed)
        {
         app.reloadDataForClass(this.collection.resource);
        }
    }         
           
});

