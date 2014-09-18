var BaseRes = require('./base_res')
  , _ = require('underscore')
  , ciSystem = require('../sdk/inabox')
  , UserStore = require('../sdk/userstore');

var BuildsRes = module.exports = BaseRes.extend({
  route: function (app) {
    app.get('/repos/builds', this.ensureAuthenticated, this.all);
    app.get('/signup', _.bind(this.signup, this));
  },

  all: function (req, res) {
    var repoName = req.query.repoId;
    var ciClient = new ciSystem();
    ciClient.getBuilds(repoName, function(builds) {
        res.render('app/builds', {repo: { name : repoName } , builds: builds});
    });
  },

  signup : function(req, res){
    res.render('app/signup');
  },

  ensureAuthenticated : function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/signup')
  }
});
