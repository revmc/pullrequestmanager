PullRequestManager.Models.Owner = Backbone.Model.extend({
  defaults: {
    name: null
  },
  
  initialize: function() {
    // alert("Initializing a new owner, name: " + this.get('name'));
  }
  
});