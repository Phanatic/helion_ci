var BaseRes = require('./base_res')
  , _ = require('underscore')
  , UserStore = require('../sdk/userstore');

var ReposRes = module.exports = BaseRes.extend({
  route: function (app) {
    app.get('/repos', _.bind(this.all, this));
    app.get('/repo', _.bind(this.getRepo, this));
    app.get('/github/reposignup', _.bind(this.signuprepo, this));
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
      res.render('app/repo' , {repo : repo});
    });
  },

  signuprepo: function (req, res) {
    var store = new UserStore();
    store.createRepoSignup(req.user, { name : req.query.repo, url : req.query.url}, function(repo, err) {
      res.render('app/reposignup' , { repo: repo});
    });
  }
});
