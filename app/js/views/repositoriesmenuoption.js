PullRequestManager.Views.RepositoriesMenuOption = Backbone.View.extend({

  tagName: 'option',
  
  render: function() {
  
    this.$el.append(this.model.get('name'));
    
    return this;
    
  }

});