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
    this.connection.query(" call functionName ("+ parameters.serialize() +"')", function(err,result) {
    });
  },

  callStoredProcedude : function(procedureName, parameters, done) {
    this.connection.query(" call CreateorUpdateUser ("+ user.profile.id
    +", '"+ user.profile.name +"')", function(err,result) {

    });
  },

  runQuery : function(queryText, done) {
    this.connection.query(queryText, function(err,result) {
      done(err, result);
    });
  }
});
