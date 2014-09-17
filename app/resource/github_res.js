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
    console.log(req.body);
    res.render('app/index');
  },

  addwebhook: function(req, res) {
    this.helion().addWebHook(req.user.token, req.user.profile.username,
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
      this.helion().getRepos(req.user.token, req.user.profile.username, function(error, repos) {
          res.render('app/repos' , {repos : repos});
      });
  },

  signuprepo: function (req, res) {
    res.render('app/reposignup' , { repoName : req.query.repo});
  },

  ensureAuthenticated : function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/signup')
  },

  helion : function () {
    var helion = new HelionCI();
    return helion;

  }
});
