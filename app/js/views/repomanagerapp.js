PullRequestManager.Views.RepoManagerApp = Backbone.View.extend({

  el: $('#repomanagerapp'),
  
  events: {
    "click #monitorbutton":	"monitorRepo",
    "click #loginbutton":	"login",
    "change #ownersmenu":	"updateRepositoriesMenu",
    "keypress #password":	"evalPasswordKeyPress"
  },

  initialize: function() {
  
	this.arrOwnerObjs = [];
	this.arrRepoObjs = [];
	
	this.repositoryByOrgRequestCount = 0;
	this.repositoryByOrgResponseCount = 0;
	
	$('#username').focus();
	    
  },
  
  evalPasswordKeyPress: function(e) {
    if (e.keyCode == 13) {
      this.login();
    }
  },
  
  login: function() {
    
    var username = $('#username').val(); // prompt("Github user name");
    this.username = username;
    var password = $('#password').val(); // prompt("Github password");

    // configure ajax to always send the username + password in the header
	$.ajaxSetup(
      {
        headers: {
		  "Authorization": "Basic " + btoa(this.username + ":" + password)
        }
      }
    );
    
    var repoManager = this;
    
    $.ajax(
      {
        type: 'GET',
        contentType: 'application/json',
        url: 'https://api.github.com/users/' + this.username + '/repos'
      }
    ).done(
    
      function(data) {
        repoManager.parseUserRepos(data);
      }
      
    ).fail(
        
      function(data) {
        alert("failed");
      }
        	
    );
    
  },
  
  parseUserRepos: function(data) {
    
    var repoManager = this;
    
    if (data.length > 0) {
    
      // store the user's name in the array of owner objects
      var owner = repoManager.username;
      this.arrOwnerObjs.push(
        {
          name: owner,
          repositories: []
        }
      );
      
      // cycle through the users repositories, storing 
      // each in the array of repository objects
      _.each(
        data,
        function(element, index, list) {
            
          repoManager.arrRepoObjs.push(
            {
              name: element.name,
              repoURL: element.html_url,
              openPullRequests: element.open_issues_count,
              owner: owner
            }
          );
        
        }
        
      );
      
      this.requestUserOrgs();
        
    }

  }, 
  
  requestUserOrgs: function() {
  
    var repoManager = this;
    
    $.ajax(
      {
        type: 'GET',
        contentType: 'application/json',
        url: 'https://api.github.com/users/' + this.username + '/orgs'
      }
    ).done(

      function(data) {
        repoManager.parseUserOrgs(data);
      }
    
    ).fail(

      function(data) {
        alert("failed");
      }
    
    );
    
  },
  
  parseUserOrgs: function(data) {
    
    var repoManager = this;
    
    if (data.length > 0) {
    
      _.each(
        data,
        function(element, index, list) {
          repoManager.arrOwnerObjs.push(
            {
              name: element.login,
              repositories: []
            }
          );
        }
      );
      
      var owners = new PullRequestManager.Collections.Owners(repoManager.arrOwnerObjs);
      var ownersMenu = new PullRequestManager.Views.OwnersMenu({collection: owners});
      $('#ownersmenu').html(ownersMenu.render().$el.html());
      
      repoManager.getRepositoriesForAllOrgs();
      
    }
    
  },
  
  getRepositoriesForAllOrgs: function() {
  
    var repoManager = this;
    
    _.each(
      repoManager.arrOwnerObjs, 
      function(ownerObj, index, list) {
      
        var ownerName = ownerObj.name;
      
        // if this element of the owner objects array
        if (ownerName != repoManager.username) {
          
          var url = 'https://api.github.com/orgs/' + ownerName + '/repos';
    
          repoManager.getRepositoriesByOwner(url, ownerName);
          
        }
      
    });
    
  },
  
  getRepositoriesByOwner: function(url, ownerName) {
    
    var repoManager = this;
    
    // increment the count of requests so that the app knows how many responses to expect
    repoManager.repositoryByOrgRequestCount++;
    
    $.ajax(
      {
        type: 'GET',
        contentType: 'application/json',
        url: url
      }
    ).done(
      
      function(data, textStatus, request) {
        repoManager.parseRepositoriesByOwnerResponse(data, ownerName, request);
      }
        
    ).fail(

      function(data) {
        alert("failed");
      }
    
    );
    
  },
  
  parseRepositoriesByOwnerResponse: function(data, ownerName, request) {
  
    var repoManager = this;
    
    repoManager.repositoryByOrgResponseCount++;
    
    // parse the repo info in the data that came back
    _.each(
      data,
      function(repoObj, index, list) {
      
        repoManager.arrRepoObjs.push(
          {
            name: repoObj.name,
            repoURL: repoObj.url,
            openPullRequests: repoObj.open_issues,
            owner: ownerName
          }
        );
          
      }
    );
        
    // determine if there are any more pages of repositories for this org
    var linkResponseHeaders = request.getResponseHeader('Link');
        
    // if there are any other pages of repositories for this org...
    if (linkResponseHeaders != null) {
          
      // ...then cycle through the other page links to see 
      // if any of them are "Next" pages
      var arrLinkResponseHeaders = linkResponseHeaders.split(',');
      var foundNextLink = false;
      _.each(
        arrLinkResponseHeaders,
        function(element, index, list) {
        
          if (element.indexOf('rel="next"') != -1) {
          
            foundNextLink = true;
            var posOfClosingBracket = element.indexOf('>');
            var nextPageURL = element.substring(1, posOfClosingBracket);
            repoManager.getRepositoriesByOwner(nextPageURL, ownerName);
            
          }
              
        }
      );
      
      // if none of the links were a "Next" link and all the requests have been parsed
      if ((!foundNextLink) && (repoManager.repositoryByOrgResponseCount == repoManager.repositoryByOrgRequestCount)) {
        // ...then that was the last page of the paginated data, 
        // so proceed to the next step in the GUI setup: building 
        // the repositories menu
        repoManager.buildRepositoriesMenu();
      }
          
    } else if ((linkResponseHeaders == null) && (repoManager.repositoryByOrgResponseCount == repoManager.repositoryByOrgRequestCount)) {
    
      // ...else if there were no Link Response Headers, then 
      // proceed to the next step in the GUI setup: building 
      // the repositories menu
      repoManager.buildRepositoriesMenu();
      
    }
        
  },
  
  buildRepositoriesMenu: function() {
  
    var repoManager = this;
    
    // create a master collection from all the repos
    this.allRepositoriesCollection = new PullRequestManager.Collections.Repositories(this.arrRepoObjs, {comparator: 'name'});
    
    /************************************
    ** START MONITORED REPOSITORY VIEW **
    ************************************/
    
	this.monitoredRepositories = new PullRequestManager.Collections.Repositories(
	  [],
	  {
	    comparator: function(model) {
	      return(-(model.get('openPullRequests')));
	    }
	  }
	);
	this.monitoredRepositories.fetch();
	
	// sync the Monitored Repositories collection with the collection that holds all the repos
	this.monitoredRepositories.forEach(
	  function(repoObj) {
	    repoManager.allRepositoriesCollection.add(repoObj);
	  }
	);
	
    this.monitoredRepositoriesView = new PullRequestManager.Views.Repositories(
      {collection: this.monitoredRepositories}
    );
    
    $('#repositoriesview').html(this.monitoredRepositoriesView.render().$el);
    
    /************************************
    ** END MONITORED REPOSITORY VIEW **
    ************************************/


    /*******************************
    ** START REPOSITORY MENU VIEW **
    *******************************/

    // create a collection for the repositories menu based on the 
    // selected value in the owners dropdown menu
    var selectedOwner = $('#ownersmenu option:selected').text();

	var reposMenuRepositoriesCollection = new Backbone.Collection(
	  this.allRepositoriesCollection.filter(
	    function(repo) {
	      return((repo.get('owner') == selectedOwner) && (repo.get('monitored') == false));
	    }
	  )
	);
    
    // alert("reposMenuRepositoriesCollection.length: " + reposMenuRepositoriesCollection.length);
    
    // build the repositories menu
    this.reposMenu = new PullRequestManager.Views.RepositoriesMenu(
      {
        collection: reposMenuRepositoriesCollection,
        el: $('#reposmenu')
      }
    );
    this.reposMenu.render();
    
    /*****************************
    ** END REPOSITORY MENU VIEW **
    *****************************/
    
    $('#loginform').remove();
    $('#addrepositorypanel').toggleClass('hidden');
	$('#repositoriesview').toggleClass('hidden');

  },
  
  updateRepositoriesMenu: function() {
    
    var selectedOwner = $('#ownersmenu option:selected').text();

    var filteredReposCollection = new Backbone.Collection(
      this.allRepositoriesCollection.filter(
        function(repoObj) {
          return((repoObj.get('owner') == selectedOwner) && (repoObj.get('monitored') == false));
        }
      )
    );
    
    // alert("filteredReposCollection.length: " + filteredReposCollection.length);
    this.reposMenu.collection = filteredReposCollection;
    
    this.reposMenu.render();
    
  },
  
  monitorRepo: function() {
    
    var selectedOwner = $('#ownersmenu option:selected').text();

    var selectedRepo = $('#reposmenu option:selected').text();
    
    var repoToMonitor = this.allRepositoriesCollection.findWhere(
      {
        owner: selectedOwner,
        name: selectedRepo
      }
    );
    
    repoToMonitor.save({monitored: true});
    
    this.updateRepositoriesMenu();
    
    this.updateRepositoriesView();
    
  },
  
  updateRepositoriesView: function() {
  
    var newMonitoredReposCollection = new Backbone.Collection(
      this.allRepositoriesCollection.filter(
        function(repoObj) {
          return(repoObj.get('monitored') == true);
        }
      ),
      {
        comparator: function(model) {
	      return(-(model.get('openPullRequests')));
	    }
      }
    );

    this.monitoredRepositoriesView.collection = newMonitoredReposCollection;
    
    $('#repositoriesview').html(this.monitoredRepositoriesView.render().$el);

  }

});