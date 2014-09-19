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
           return done(results[0], err);
         })
       });
  },

  createRepoSignup: function(user, repo, done) {

    this.storeContext( function (context) {
         context.callStoredProcedude("RegisterRepo ("+user.db.id+" , " + repo.id + ", '"+ repo.name+"', '"+ repo.url+"')", function (err, results) {

           return done(results[0], err);
         })
       });
  },

  registerWebHook: function(repo, done) {
    this.storeContext( function (context) {
         context.callStoredProcedude("RegisterRepoWebHook ("+repo.id+")", function (err, results) {
           return done(results[0], err);
         })
       });
  },

  registerWebHookCall: function(webHook, build, done) {

    this.storeContext( function (context) {
         context.callStoredProcedude("RegisterWebHookCall ("+webHook.repository.id+
            ", '"+webHook.head_commit.url+"'" +
            ", '"+webHook.compare+"'" +
            ", '"+webHook.head_commit.committer.name+"'"+
            ", '"+webHook.head_commit.message+"'"+
            ", "+build.build_number+")",
             function (err, results) {
               return done(results[0], err);
             })
       });
  },

  registerCIJob: function(repoId, job, done) {
    this.storeContext( function (context) {
         context.callStoredProcedude("RegisterRepoCIJob ("+repoId+",'"+ job.name+"')", function (err, results) {
           return done(results[0], err);
         })
       });
  },

  registerDeployTarget: function(repoId, creds, done) {
    console.log(creds);
    this.storeContext( function (context) {
         context.callStoredProcedude("RegisterRepoDeployTarget ("+ repoId +","+
         "'"+creds.server+"', '"+creds.username+"', '"+creds.password+"')",
           function (err, results) {
             return done(results[0], err);
           })
       });
  },

  getReposForUser : function (user, done) {
    this.storeContext( function (context) {
      context.callStoredProcedude("GetUserRepos ("+user.db.id+")", function (err, results) {
        return done(user, results, err);
      })
    });
  },

  getRepo : function(repoId, done) {
    this.storeContext( function (context) {
         context.callStoredProcedude("GetRepo ("+repoId+")", function (err, results) {
           return done(results[0], err);
         })
       });
  },

  getWebHookCalls : function(repoId, done) {
    this.storeContext( function (context) {
         context.callStoredProcedude("GetWebHookCallsForRepo ("+repoId+")", function (err, results) {
           return done(results, err);
         })
       });
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
