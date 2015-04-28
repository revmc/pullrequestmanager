 window.PullRequestManager = {
  
  Models: {},
  Collections: {},
  Views: {},
  Router: {},
  
  ownerObjArray: [],
  repoObjArray: [],
  
  ownerDataRequestCount: 0,
  
  start: function(data) {
  
    window.PullRequestManager.Router = Backbone.Router.extend({
    
      routes: {
        '': "index"
      },
      
      index: function() {
      
        var RepoManagerApp = new PullRequestManager.Views.RepoManagerApp();
        
      }

    });
    
    new window.PullRequestManager.Router();
    Backbone.history.start();
    
  }
  
};