var BaseRes = require('./base_res')
  , _ = require('underscore')
  , UserStore = require('../sdk/userstore');

var ReposRes = module.exports = BaseRes.extend({
  route: function (app) {
    app.get('/repos', _.bind(this.all, this));
  },

  all: function (req, res) {
    var store = new UserStore();
    store.getReposForUser(req.user, function(user, repos){
      res.render('app/userrepos' , {repos : repos});
    });
  }
});
