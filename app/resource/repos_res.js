var BaseRes = require('./base_res')
  , _ = require('underscore')
  , UserStore = require('../sdk/userstore');

var ReposRes = module.exports = BaseRes.extend({
  route: function (app) {
    app.get('/repos', this.ensureAuthenticated, _.bind(this.all, this));
    app.get('/repo', this.ensureAuthenticated, _.bind(this.getRepo, this));
    app.post('/repo/registerdeploytarget', this.ensureAuthenticated, _.bind(this.registerdeploytarget, this));
    app.get('/github/reposignup', this.ensureAuthenticated, _.bind(this.signuprepo, this));
  },

  all: function (req, res) {
    var store = new UserStore();
    store.getReposForUser(req.user, function(user, repos){
      res.render('app/userrepos' , {repos : repos});
    });
  },

  getRepo : function (req, res) {
    var store = new UserStore()
      , repoId = parseInt(req.query.id, 10);
    store.getRepo(repoId, function(repo, err) {
      res.render('app/reposignup' , {repo : repo});
    });
  },

  signuprepo: function (req, res) {
    var store = new UserStore();
    debugger;
    store.createRepoSignup(req.user, { name : req.query.repo, url : req.query.url}, function(repo, err) {
      res.render('app/reposignup' , { repo: repo});
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
  }
});
