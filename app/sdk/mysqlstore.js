var klass = require('klass')
  , mysql = require('mysql');;

var MySqlStore = module.exports = klass(function () {
  this.connection =  mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'cisystem',
    password: 'fairgate'
  });
  // constructor
}).methods({
  // public methods
  connectToStore : function (done) {
    var self = this;
    this.connection.connect(function(err){
      self.runQuery("use Users", done);
    });
  },

  callFunction : function(functionName, parameters, done) {

    this.runQuery(" Select "+functionName+" ("+ parameters +")", function(err,results) {
      var sanitized = results;
      if(!err) {
        sanitized = results[0]
        var resultPropName = '';
        for(var prop in sanitized) {
           resultPropName = prop;
         }

        sanitized = sanitized[resultPropName];
      }

      done(err, sanitized);
    });
  },

  callStoredProcedude : function(procedureName, done) {
    this.connection.query(" call "+procedureName, function(err,results) {
        var sanitized = results;
        console.dir(results);
        if(!err) {
          sanitized = results[0]
        }

        done(err, sanitized);
    });
  },

  runQuery : function(queryText, done) {
    this.connection.query(queryText, function(err,result) {
      done(err, result);
    });
  }
});
