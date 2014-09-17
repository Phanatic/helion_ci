var klass = require('klass')
  , _ = require('underscore');

var UserStore = module.exports = klass(function () {
  // constructor
  this.repos  = [{
    id : 0,
    name : "node-env",
    description : "Print server's environment variables",
    lastbuildfailed: false,
    builds : [{},{},{},{}]
  },
  {
    id: 1,
    name : "pkgcloud",
    description : "provider agnostic cloud library",
    lastbuildfailed: true,
    builds : [{},{},{},{}]
  }];
}).methods({

  userExists : function (user) {
    return false;
  },

  createOrUpdateUser: function(user, done) {

    done(null, { id : 1, name : user.profile.name ,
       githubUserId : user.profile.id});
  },

  createRepoSignup: function(user, repo, done) {
    this.repos.push(repo);
    done(user,repo);
  },

  getReposForUser : function (user, done) {
    done(user, this.repos);
  },

  getRepo : function(repoId, done) {
    var storedRepo = _.find(this.repos, function(repo){ return repo.id === repoId });
    debugger;
    done(storedRepo)
  }
});
