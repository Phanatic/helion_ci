var klass = require('klass')
  , BaseRes = require('./base_res')
  , _ = require('underscore')
  , github = require('github');

var GithubRes = module.exports = klass(function () {
  // constructor
}).methods({
  route: function (app) {
    app.post('/github/webhook', _.bind(this.recievewebhook, this));
  },

  recievewebhook: function(req, res) {
    res.render('app/index');
  }
});
