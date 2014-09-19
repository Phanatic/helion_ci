var BaseRes = require('./base_res')
  , _ = require('underscore')
  , ciSystem = require('../sdk/inabox')
  , UserStore = require('../sdk/userstore');

var BuildsRes = module.exports = BaseRes.extend({
  route: function (app) {
    app.get('/repos/builds', this.ensureAuthenticated, this.all);
    app.post('/repos/builds', this.ensureAuthenticated, this.startBuild);
    app.get('/signup', _.bind(this.signup, this));
  },

  all: function (req, res) {
    var repoName = req.query.repoName
      , repoId = parseInt(req.query.id)
      , ciClient = new ciSystem()
      , self = this;
    ciClient.getBuilds(repoName, function(builds) {
        var store = new UserStore();
        store.getWebHookCalls(repoId, function(webhooks, err) {
          debugger;
          var combinedBuilds = [];
          _.each(builds, function(build){
            var hookForBuild = _.find(webhooks, function(hook) { return hook.buildNumber === build.number ;});
            build.hook = hookForBuild;
            combinedBuilds.push(build);
          });

          res.render('app/builds', {repo: { name : repoName } , builds: combinedBuilds});
        });
    });
  },

  startBuild: function(req, res) {
    var repoName = req.body.jobId;

    var ciClient = new ciSystem();
    ciClient.startJob(repoName, function(build) {
        res.json(build);
    });
  },

  signup : function(req, res){
    res.render('app/signup');
  },

  combineBuildMetadata : function (builds, webhooks) {
    var combinedBuilds = [];
    _.each(builds, function(build){
      var hookForBuild = _.find(webhooks, function(hook) { return hook.buildNumber === build.number ;});
      combinedBuilds.push( _.extend(build, hookForBuild));
    });


    return combinedBuilds;
  },

  ensureAuthenticated : function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/signup')
  }
});
