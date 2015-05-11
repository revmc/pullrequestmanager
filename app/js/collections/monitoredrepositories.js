PullRequestManager.Collections.MonitoredRepositories = Backbone.Collection.extend({
  
  localStorage: new Backbone.LocalStorage('MonitoredRepositoriesCollection'),
  
  model: PullRequestManager.Models.Repository
  
});