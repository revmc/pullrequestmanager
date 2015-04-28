PullRequestManager.Views.OwnersMenu = Backbone.View.extend({
  
  renderOwnersMenuOption: function(owner) {
    
    var ownersMenuOption = new PullRequestManager.Views.OwnersMenuOption({model: owner});
    this.$el.append(ownersMenuOption.render().$el);
    
  },
  
  render: function() {
  
    this.collection.each(this.renderOwnersMenuOption, this);
    
    return this;
    
  }
  
});