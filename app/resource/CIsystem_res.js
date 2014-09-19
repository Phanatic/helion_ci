var BaseRes = require('./base_res')
  , _ = require('underscore')
  , ciSystem = require('../sdk/inabox')
  , UserStore = require('../sdk/userstore');

var CISystem_Res = module.exports = BaseRes.extend({
  route: function (app) {
    app.get('/jobs', this.ensureAuthenticated, this.jobs);
    app.get('/builds', this.ensureAuthenticated, this.builds);
    app.get('/builds/console', this.ensureAuthenticated, this.getOutputText);
    app.get('/job', this.ensureAuthenticated, _.bind(this.job, this));
    app.post('/jobs', this.ensureAuthenticated, _.bind(this.addJob, this));
  },

  jobs: function (req, res) {
    var ciClient = new ciSystem();
    ciClient.getJobs( function(jobs) {
      res.render('app/jobs', {jobs : jobs.results});
    })
  },

  addJob: function(req, res) {
    var ciClient = new ciSystem();
    ciClient.addJob(req.body, function(job) {
      var store = new UserStore();
      store.registerCIJob(req.repoId, job, function(err, repo) {
        res.render('app/jobs', {jobs : jobs.results});
      });
    })
  },

  getOutputText : function (req, res) {
    var jobName = req.query.jobName,
    buildNumber = parseInt(req.query.build);

    var ciClient = new ciSystem();
    ciClient.getConsoleText(jobName, buildNumber, function(consoleText) {
        res.render('app/buildoutput', {consoleText:consoleText,
           jobName : jobName,
           buildNumber : buildNumber});
    });
  },

  builds: function (req, res) {
    var ciClient = new ciSystem();
    ciClient.getBuilds( function(builds) {
      res.render('app/builds', {builds : builds.results});
    })
  },

  job : function(req, res){
    res.render('app/signup');
  },

  build : function(req, res){
    res.render('app/signup');
  },

  ensureAuthenticated : function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/signup')
  }
});
