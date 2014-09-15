var klass = require('klass')
  , BaseRes = require('./base_res')
  , _ = require('underscore')
  , github = require('github')
  , HelionCI = require('../sdk/helionci');

var GithubRes = module.exports = klass(function () {
  // constructor
}).methods({
  route: function (app) {
    app.post('/github/webhook', _.bind(this.recievewebhook, this));
    app.get('/github/repos', this.ensureAuthenticated, _.bind(this.showrepos, this));
  },

  recievewebhook: function(req, res) {
    res.render('app/index');
  },

  showrepos: function(req,res) {
      var helion = new HelionCI();
      helion.getRepos(req.user.token, req.user.profile.username, function(error, repos) {
          debugger;
          res.render('app/repos' , {repos : repos});
      });
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
