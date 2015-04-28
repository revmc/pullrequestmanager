PullRequestManager.Collections.Repositories = Backbone.Collection.extend({
  
  localStorage: new Backbone.LocalStorage("RepositoriesCollection"),
   
  model: PullRequestManager.Models.Repository
  
});