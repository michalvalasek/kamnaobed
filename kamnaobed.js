Options = new Meteor.Collection("options");

if (Meteor.is_client) {
  Template.board.options = function () {
    return Options.find({}, {sort: {votes: -1, title: 1}});
  };

  Template.option.color = function () {
    return this.votes > 2 ? 'red' :
           this.votes > 1 ? 'orange' :
           this.votes > 0 ? 'yellow' :
           'grey';
  };

  Template.option.events = {
    'click .title' : function () {
      if ( Session.equals("voted", true) ) {
        alert("You already voted!");
      }
      else {
        Options.update(this._id, {$inc: {votes: 1}});
        Session.set("voted", true);
      }
    }
  };
}

if (Meteor.is_server) {
  Meteor.startup(function () {
    if (Options.find().count() === 0) {
      var titles = ["Český Budík", "Furman", "Diana", "BLUE*S"];
      for (var i=0; i<titles.length; i++) {
        Options.insert({title: titles[i], votes: 0});
      }
    }
  });
}