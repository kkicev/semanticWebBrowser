/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var app = app || {};
// MoviesList Collection
// ---------------
// The collection of movies is backed by *localStorage* instead of a remote
// server.
var DefaultList = Backbone.Collection.extend({
// Reference to this collection's model.
    model: app.DefaultModel,
    page:1,
    
    initialize : function(models, options) {
    this.query = options.query;
    this.resource=options.class;
  },
  url : function() {
    return '/semanticWebBrowser/SparqlServlet?q='+this.query+'&dataset='+encodeUrlComponent(app.dataset)+'&class='+encodeUrlComponent(this.resource)+'&page='+this.page+'&filter='+encodeUrlComponent(getFilterForClass(this.resource));
  },
  parse : function(data) {
 
    if(data && data.results && data.results.bindings) {
        for(var i=0;i<data.results.bindings.length;i++) {
            var x=data.results.bindings[i];
            if(!x.name.value) {
                x.name.value=x.resource.value;
            }
        }
    }

    if(data.error)
    {
     alert(data.error);
     return [];
    }
    else if(data.results)
    return data.results.bindings;
  },

    selected: function() {
        return this.filter(function(entity) {
            return entity.get('selected');
        });
    },
// Filter down the list to only entities that are not selected.
    remaining: function() {
        return this.without.apply(this, this.selected());
    }
});


