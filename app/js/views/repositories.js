PullRequestManager.Views.Repositories = Backbone.View.extend({
  
  template: _.template($('#tpl-repositories').html()),
  
  renderRepo: function(repository) {
    
    var repositoryView = new PullRequestManager.Views.Repository({model: repository});
    this.$('#repositories-list').append(repositoryView.render().$el);
    
  },
  
  render: function() {
  
    var templateHTML = this.template();
    this.$el.html(templateHTML);
    
    this.collection.each(this.renderRepo, this);
    
    return this;
    
  }
  
});