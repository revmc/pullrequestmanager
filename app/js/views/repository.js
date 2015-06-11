PullRequestManager.Views.Repository = Backbone.View.extend({

  tagName: 'li',
  
  template: _.template($('#tpl-repository').html()),
  
  events: {
    "click .deleteRepoButton" : "deleteRepo"
  },
  
  initialize: function() {
    this.listenTo(this.model, 'destroy', this.remove);
  },
  
  render: function() {
  
    var templateHTML = this.template(this.model.toJSON());
    this.$el.addClass('repoDataListItem');
    this.$el.append(templateHTML);
    
    return this;
    
  },
  
  deleteRepo: function() {
    this.model.destroy();
  }


});