/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var app = app || {};

app.DefaultModel = Backbone.Model.extend({

    defaults: {
        resource: '',
        name:'',
        selected: false,
        changed:false

    },
// Toggle the `selected` state of this item.
    toggle: function() {
        this.set("selected",!this.get('selected'));
        this.set("changed",!this.get('changed'));
    }
    
});

