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
        alert("Na koho to skúšaš, chlapec?");
      }
      else {
        Options.update(this._id, {$inc: {votes: 1}});
        Session.set("voted", true);
      }
    }
  };

  Template.panel.events = {
    'click .reset' : function () {
      if ( prompt('Že heslo?')==='cislo kleslo' ) {
        Options.find().forEach(function(item) {
          Options.update(item._id, {$set: {votes: 0}});
        });
        Session.set("voted", false);
      }
    }
  };
}

if (Meteor.is_server) {
  Meteor.startup(function () {
    if (Options.find().count() === 0) {
      var venues = [
        {name: "Český Budík"},
        {name: "Furman", link: "http://furman.sk/"},
        {name: "Diana", link: "http://diana.sk/Downloads/denne-menu-en.pdf"},
        {name: "BLUE*S", link: "http://blue-s.sk/"}
      ];
      for (var i=0; i<venues.length; i++) {
        Options.insert({title: venues[i].name, link: venues[i].link, votes: 0});
      }
    }
  });
}