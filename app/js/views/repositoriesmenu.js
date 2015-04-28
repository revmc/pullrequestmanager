PullRequestManager.Views.RepositoriesMenu = Backbone.View.extend({

  renderReposMenu: function(repository) {
    
    var reposMenuOption = new PullRequestManager.Views.RepositoriesMenuOption({model: repository});
    this.$el.append(reposMenuOption.render().$el);
    
  },
  
  render: function() {
    
    this.$el.empty();
    
    this.collection.forEach(this.renderReposMenu, this);
    
    return this;
    
  }

});