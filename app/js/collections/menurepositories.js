PullRequestManager.Collections.MenuRepositories = Backbone.Collection.extend({
  
  localStorage: new Backbone.LocalStorage('MenuRepositoriesCollection'),
   
  model: PullRequestManager.Models.Repository,
  
  comparator: 'name'
  
});