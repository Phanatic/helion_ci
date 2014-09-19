var klass = require('klass')
  , request = require('request');


var InaBox = module.exports = klass(function () {
  // constructor
}).methods({
  // public methods

  getJobs : function (done) {
    var self = this;
    request.get(this.getJobsUri(), function(error, response, body) {
      var results = self.safeParse(body);
      done(results);
    });
  },

  addJob : function (job, done) {
    job.command = "set -x \r\n "+
      "PATH=${PATH}:~/bin \r\n "+
      "DOMAIN=15.126.228.197.xip.io \r\n"+
      "stackato target https://api.${DOMAIN} \r\n"+
      "stackato login terryhowe --password mypassword \r\n"+
      "stackato push -n --as "+job.name +" --reset";
    var options = {
        uri: this.getJobsUri().url,
        rejectUnauthorized: false,
        method: 'POST',
        json: job
      };
    var self = this;
    request.post(options, function(error, response, body) {
      self.startJob(body.name, function(startError, startResponse, startBody) {
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
    var self = this;
    request.post(options, function(error, response, body) {
      debugger;
      var results = self.safeParse(body);
      done(results);
    });
  },

  getUsers : function (done) {
    var self = this;
    request.get(this.getUsersUri(), function(error, response, body) {
      var results = self.safeParse(body);
      done(results);
    });
  },

  getBuilds : function (repoName, done) {
      var self = this;
    request.get(this.getBuildsUri(repoName), function(error, response, body) {
      var results = self.safeParse(body);
      done(results);
    });
  },

  getConsoleText : function (jobName, buildNumber, done) {
      var self = this;
    request.get(this.getJobOutputUri(jobName, buildNumber), function(error, response, body) {
      debugger;
      done(body);
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
  },

  getJobOutputUri : function (jobId, buildNumber) {
    var url = "http://admin:mypassword@15.125.78.44:8080/job/"+jobId+"/"
            + buildNumber+"/consoleText";
    console.log(url);
    return { url : url
           , rejectUnauthorized: false};
  },

  safeParse : function (text) {
    var parsedObj = [];
    try {
      parsedObj = JSON.parse(text);
    }
    catch (e) {
    }
    return parsedObj;
  }

});
