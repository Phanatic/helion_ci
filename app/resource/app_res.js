var BaseRes = require('./base_res')
  , _ = require('underscore');

var AppRes = module.exports = BaseRes.extend({
  route: function (app) {
    app.get('/', this.ensureAuthenticated, this.all);
    app.get('/signup', _.bind(this.signup, this));
  },

  all: function (req, res) {
    res.redirect('/github/repos');
  },

  signup : function(req, res){
    res.render('app/signup');
  },

  ensureAuthenticated : function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/signup')
  }
});
