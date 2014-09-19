var BaseRes = require('./base_res')
  , _ = require('underscore')
  , UserStore = require('../sdk/userstore')
  , ciSystem = require('../sdk/inabox')
  , HelionCI = require('../sdk/helionci');

var ReposRes = module.exports = BaseRes.extend({
  route: function (app) {
    app.get('/repos', this.ensureAuthenticated, _.bind(this.all, this));
    app.get('/repos/webhooks', this.ensureAuthenticated, _.bind(this.getWebHooks, this));
    app.get('/repo', this.ensureAuthenticated, _.bind(this.getRepo, this));
    app.post('/repo/registerdeploytarget', this.ensureAuthenticated, _.bind(this.registerdeploytarget, this));
    app.get('/github/reposignup', this.ensureAuthenticated, _.bind(this.signuprepo, this));
  },

  all: function (req, res) {
    var store = new UserStore();
    store.getReposForUser(req.user, function(user, repos){
      var ciClient = new ciSystem();
      ciClient.getJobs(function(jobs) {

        var combinedRepos = [];
        _.each(repos, function(repo){
          var jobForRepo = _.find(jobs.results, function(job) { return job.name === repo.name ;});
          repo.job = jobForRepo;
          combinedRepos.push(repo);
        });

        res.render('app/userrepos' , {repos : combinedRepos});
      })
    });
  },

  getRepo : function (req, res) {
    var store = new UserStore()
      , repoId = parseInt(req.query.id, 10);
    store.getRepo(repoId, function(repo, err) {
      res.render('app/reposignup' , {repo : repo});
    });
  },

  getWebHooks : function (req, res) {
    var store = new UserStore()
      , repoId = parseInt(req.query.repoId, 10);
      store.getWebHookCalls(repoId, function(webhooks, err) {

        res.render('app/webhooks' , {webhooks : webhooks});
      });
  },

  signuprepo: function (req, res) {
    var store = new UserStore(),
    self = this;
    store.createRepoSignup(req.user, { name : req.query.repo, url : req.query.url, id : req.query.id},
      function(repo, err) {
        console.log('created repo signup');
        var ciClient = new ciSystem();
        var wireJob = {
            name : repo.name,
            description : repo.name,
            gitrepo : repo.repoUrl
          };

        ciClient.addJob(wireJob, function(job) {
            console.log('added job to inabox server');
            store.registerCIJob(repo.id, job, function(storeRepo) {

              var helion = new HelionCI();
              helion.addWebHook(req.user.token, req.user.profile.username,
                  storeRepo.name, function (err, hook) {
                    console.log('added webhook to github');
                    res.redirect('/repos');
                });

            });
        });
    });
  },

  registerdeploytarget: function(req, res) {
    var store = new UserStore();
    store.registerDeployTarget(req.body.repoId, req.body.creds, function(repo, err) {
      res.json({status: "success"});
    });
  },

  ensureAuthenticated : function(req, res, next) {
    if (req.isAuthenticated()) { return next();
    }
    res.redirect('/signup')
  },

  helion : function () {
    var helion = new HelionCI();
    return helion;
  }
});
