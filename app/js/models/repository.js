PullRequestManager.Models.Repository = Backbone.Model.extend({
  defaults: {
    name: null,
    repoURL: null,
    openPullRequests: null,
    owner: null,
    monitored: false
  },
  
  initialize: function() {
    // alert("Initializing a new model, url: " + this.get('repoURL'));
  }
  
});