var BaseRes = require('./base_res')
  , _ = require('underscore')
  , ciSystem = require('../sdk/inabox');

var CISystem_Res = module.exports = BaseRes.extend({
  route: function (app) {
    app.get('/jobs', this.ensureAuthenticated, this.jobs);
    app.get('/builds', this.ensureAuthenticated, this.builds);
    app.get('/job', this.ensureAuthenticated, , _.bind(this.job, this));
  },

  jobs: function (req, res) {
    var ciClient = new ciSystem();
    ciClient.getJobs( function(jobs) {
      res.render('app/jobs', {jobs : jobs.results});
    })
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
