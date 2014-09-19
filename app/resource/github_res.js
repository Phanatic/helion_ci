var klass = require('klass')
  , BaseRes = require('./base_res')
  , _ = require('underscore')
  , github = require('github')
  , HelionCI = require('../sdk/helionci')
  , ciSystem = require('../sdk/inabox')
  , UserStore = require('../sdk/userstore');

var GithubRes = module.exports = klass(function () {
  // constructor
}).methods({
  route: function (app) {
    app.post('/github/addwebhook', this.ensureAuthenticated, _.bind(this.addwebhook, this));
    app.post('/github/webhook', _.bind(this.recievewebhook, this));
    app.get('/github/repos', this.ensureAuthenticated, _.bind(this.showrepos, this));
  },

  recievewebhook: function(req, res) {
    var jobId = req.body.repository.name;
    var ciClient = new ciSystem();
    ciClient.startJob(jobId, function(build){
      var store = new UserStore();
      debugger;
      store.registerWebHookCall(req.body, build, function (loggedCall) {
        res.json(loggedCall);
      })
    })
  },

  addwebhook: function(req, res) {
    var repoId = parseInt(req.body.repoId);
    this.helion().addWebHook(req.user.token, req.user.profile.username,
      req.body.repoName, function (err, hook) {
        var store = new UserStore();
        store.registerWebHook(repoId, function (repo, err2){
          if(err) {
            res.json(err);
          }
          else {
              res.json(hook);
          }
        });
      });
  },

  showrepos: function (req, res) {
      this.helion().getRepos(req.user.token, req.user.profile.username,
        function(error, gitRepos) {
          var store = new UserStore();
          store.getReposForUser(req.user, function (user, enlistedRepos){
            var repos = _.reject(gitRepos, function(gitRepo) {
              return _.any(enlistedRepos, function (repo){
                console.log( gitRepo.html_url + " === "+ repo.repoUrl + " : " + (gitRepo.html_url === repo.repoUrl) );
                return gitRepo.html_url === repo.repoUrl;
              })
            });
            res.render('app/repos' , {repos : repos});
          });
      });
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
