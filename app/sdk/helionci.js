var klass = require('klass')
  , payloadURL = "http://localhost:3000/github/webhook/"
  , github = require('github');

var Helion = module.exports = klass(function () {
  // constructor
}).methods({
  // public methods
  addWebHook : function(token, user, done) {
    var webHook = {
          "user" : "Phanatic",
          "repo" : "OData4Excel2007",
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
    console.log(user);

    var gitClient =  this.getGitClient();

    console.log('adding web hook to repo');
    gitClient.repos.createHook(webHook, function(one,two,three) {
        debugger;
        console.log(one.message);
        done();
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
        "port": 443,});

      gitClient.authenticate({
        type: "oauth",
        token: token
      });

      return gitClient;
  }
});
