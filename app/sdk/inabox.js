var klass = require('klass')
  , request = require('request');


var InaBox = module.exports = klass(function () {
  // constructor
}).methods({
  // public methods

  getJobs : function (done) {
    request.get(this.getJobsUri(), function(error, response, body) {
      var response = JSON.parse(body);
      done(response);
    });
  },

  getUsers : function (done) {
    request.get(this.getUsersUri(), function(error, response, body) {
      var response = JSON.parse(body);
      done(response);
    });
  },

  getBuilds : function (done) {
    request.get(this.getBuildsUri(), function(error, response, body) {
      var response = JSON.parse(body);
      done(response);
    });
  },

  getUsersUri : function () {
    return "http://Stackato:asdf@inabox.15.126.228.197.xip.io/users/";
  },

  getBuildsUri : function () {
    return "http://Stackato:asdf@inabox.15.126.228.197.xip.io/builds/";
  },

  getJobsUri : function () {
    return "http://Stackato:asdf@inabox.15.126.228.197.xip.io/jobs/";
  }
});
