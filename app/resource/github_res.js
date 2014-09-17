var klass = require('klass')
  , BaseRes = require('./base_res')
  , _ = require('underscore')
  , github = require('github')
  , HelionCI = require('../sdk/helionci');

var GithubRes = module.exports = klass(function () {
  // constructor
}).methods({
  route: function (app) {
    app.post('/github/addwebhook', _.bind(this.addwebhook, this));
    app.post('/github/webhook', _.bind(this.recievewebhook, this));
    app.get('/github/repos', this.ensureAuthenticated, _.bind(this.showrepos, this));
    app.get('/github/reposignup', this.ensureAuthenticated, _.bind(this.signuprepo, this));
  },

  recievewebhook: function(req, res) {
    res.render('app/index');
  },

  addwebhook: function(req, res) {
    var helion = new HelionCI();
    helion.addWebHook(req.user.token, req.user.profile.username,
      req.body.repoName, function (err, hook) {
        if(err) {
          res.json(err);
        }
        else {
          res.json(hook);
        }
      });
  },

  showrepos: function (req, res) {
      var helion = new HelionCI();
      helion.getRepos(req.user.token, req.user.profile.username, function(error, repos) {

          res.render('app/repos' , {repos : repos});
      });
  },

  signuprepo: function (req, res) {
    res.render('app/reposignup' , { repoName : req.query.repo});
  },

  // Simple route middleware to ensure user is authenticated.
  //   Use this route middleware on any resource that needs to be protected.  If
  //   the request is authenticated (typically via a persistent login session),
  //   the request will proceed.  Otherwise, the user will be redirected to the
  //   login page.
  ensureAuthenticated : function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/signup')
  }
});
