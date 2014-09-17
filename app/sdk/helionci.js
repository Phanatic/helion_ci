var klass = require('klass')
  , payloadURL = "http://localhost:3000/github/webhook/"
  , github = require('github');

var Helion = module.exports = klass(function () {
  // constructor
}).methods({
  // public methods
  addWebHook : function(token, userName, repoName, done) {
    var webHook = {
          "user" : userName,
          "repo" : repoName,
          "name": "web",
          "active": true,
          "events": [
            "push",
            "pull_request"
          ],
          "config": {
            "url": payloadURL,
            "content_type": "json"
          }
        }
    console.log(token);
    console.log(webHook);

    var gitClient =  this.getGitClient(token);

    console.log('adding web hook to repo');
    gitClient.repos.createHook(webHook, function(err, hook) {
        done(err, hook);
      });
  },

  getRepos: function(token, userName, done) {
    var gitClient =  this.getGitClient(token);
    gitClient.repos.getFromUser( { user: userName}, done);
  },

  getGitClient: function(token) {
      var gitClient = new github({
        "version": "3.0.0",
        "protocol": "https",
        "host": "api.github.com",
        "port": 443});
      gitClient.authenticate({
        type: "oauth",
        token: token
      });

      return gitClient;
  }
});
