PullRequestManager.Views.Repositories = Backbone.View.extend({
  
  template: _.template($('#tpl-repositories').html()),
  
  initialize: function() {
    this.listenTo(this.collection, 'change', this.render);
  },
  
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