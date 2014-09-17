var klass = require('klass')
  , _ = require('underscore')
  , mySqlStore = require('./mysqlstore');

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

  createOrUpdateUser: function(profile, done) {
    this.storeContext( function (context) {
         context.callStoredProcedude("CreateOrUpdateUser ("+profile.id+" , '"+ profile.displayName+"')", function (err, results) {
           debugger;
           return done(results[0], err);
         })
       });
  },

  createRepoSignup: function(user, repo, done) {
    this.storeContext( function (context) {
         context.callStoredProcedude("RegisterRepo ("+user.db.id+" , '"+ repo.name+"', '"+ repo.url+"')", function (err, results) {
           debugger;
           return done(results[0], err);
         })
       });
  },

  getReposForUser : function (user, done) {
    this.storeContext( function (context) {
      context.callStoredProcedude("GetUserRepos ("+user.db.id+")", function (err, results) {
        debugger;
        return done(user, results, err);
      })
    });
  },

  getRepo : function(repoId, done) {
    var storedRepo = _.find(this.repos, function(repo){ return repo.id === repoId });
    return done(storedRepo)
  },

  storeContext: function(done) {
    var sqlStore = new mySqlStore();
    sqlStore.connectToStore(function(err,connection){
      if(!err) {
        return done(sqlStore);
      }
    })
  }
});
