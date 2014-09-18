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

  addJob : function (job, done) {
    job.command = "ls";
    var options = {
        uri: this.getJobsUri().url,
        rejectUnauthorized: false,
        method: 'POST',
        json: job
      };
    var self = this;
    request.post(options, function(error, response, body) {
      debugger;
      self.startJob(body.name, function(startError, startResponse, startBody) {
        debugger;
        done(body);
      });
    });
  },

  startJob : function (jobId, done) {
    var options = {
        uri: this.getJobUri(jobId).url +"start/",
        rejectUnauthorized: false,
        method: 'POST'
      };

    request.post(options, function(error, response, body) {
      done(body);
    });
  },

  getUsers : function (done) {
    request.get(this.getUsersUri(), function(error, response, body) {
      var response = JSON.parse(body);
      done(response);
    });
  },

  getBuilds : function (repoName, done) {
    request.get(this.getBuildsUri(repoName), function(error, response, body) {
      debugger;
      var response = JSON.parse(body);
      done(response);
    });
  },

  getUsersUri : function () {
    return { url : "https://Stackato:asdf@inabox.15.126.228.197.xip.io/users/"
             , rejectUnauthorized: false};
  },

  getBuildsUri : function (repoName) {
    return { url : "https://Stackato:asdf@inabox.15.126.228.197.xip.io/jobs/"+repoName+"/builds/"
           , rejectUnauthorized: false};

  },

  getJobsUri : function () {
    return { url : "https://Stackato:asdf@inabox.15.126.228.197.xip.io/jobs/"
           , rejectUnauthorized: false};
  },

  getJobUri : function (jobId) {
    return { url : "https://Stackato:asdf@inabox.15.126.228.197.xip.io/jobs/"+jobId+"/"
           , rejectUnauthorized: false};
  }
});
