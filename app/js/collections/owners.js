PullRequestManager.Collections.Owners = Backbone.Collection.extend({

  model: PullRequestManager.Models.Owner,
  
  comparator: 'name'
  
});