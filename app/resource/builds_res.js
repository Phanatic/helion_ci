var BaseRes = require('./base_res')
  , _ = require('underscore')
  , BuildStore = require('../sdk/buildstore');

var ReposRes = module.exports = BaseRes.extend({
    route: function (app) {
              
        app.get('/repos/builds', _.bind(this.all, this));
        app.get('/repos/builds/:jobid', _.bind(this.getBuild, this));
    },
    
    all: function (req, res) {
        var store = new BuildStore();
        var repoId = req.query.repoId;
        store.getBuildsForUser(repoId, function (builds) {
            res.render('app/builds' , { builds : builds });
        });
    },
    
    
    getBuild : function (req, res) {
        var store = new BuildStore()
      , buildId = req.query.jobId;
        
        store.getBuildsForUser(buildId, function (build) {
            debugger;
            res.render('app/build' , { build : build });
        }

);
    }
});