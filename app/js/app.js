 window.PullRequestManager = {
  
  Models: {},
  Collections: {},
  Views: {},
  Router: {},
  
  ownerObjArray: [],
  repoObjArray: [],
  
  ownerDataRequestCount: 0,
  
  start: function(data) {
  
    var RepoManagerApp = new PullRequestManager.Views.RepoManagerApp();
    
  }
  
};