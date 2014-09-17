var klass = require('klass')
  , mysql = require('mysql');;

var MySqlStore = module.exports = klass(function () {
  this.connection =  mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'helionci',
    database: 'users'
  });
  // constructor
}).methods({
  // public methods
  connectToStore : function (done) {
    this.connection.connect(function(err){
      done(err, this);
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

  runQuery : function(queryText, parameters, done) {

  }
});
