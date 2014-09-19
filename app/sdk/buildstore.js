var klass = require('klass')
  , _ = require('underscore')
  , request = require('request');

var BuildStore = module.exports = klass(function () {
    // constructor

}).methods({    
    
    getBuildsForUser : function (repoId, done) {

        var username = 'stackato'
        var password = 'asdf'
        var options = {
                        rejectUnauthorized: false,
                        url: 'http://inabox.15.126.228.197.xip.io/jobs/' + repoId + '/builds/',
                        auth:
                          {
                            user: username,
                            password: password
                          }
                       }

        request(options, function (err, res, body) {
        if (err) {
        console.dir(err)                
        }
            console.dir('headers', res.headers)
            console.dir('status code', res.statusCode)
            console.dir(JSON.parse(body))
            done(JSON.parse(body));
            
        })
    },
    
    getBuild : function (id, done) {        
        
        var tyest;
        //var username = 'stackato'
        //var password = 'asdf'
        //var options = 
        //            {
        //                rejectUnauthorized: false,
        //                url: 'http://inabox.15.126.228.197.xip.io/jobs/' + repoId + '/builds/' + id,
        //                auth:
        //                {
        //                    user: username,
        //                    password: password
        //                }
        //            }
        
        //request(options, function (err, res, body)
        //     {
        //      if (err) {
        //            console.dir(err)
        //        }
        //        console.dir('headers', res.headers)
        //        console.dir('status code', res.statusCode)
        //        console.dir(JSON.parse(body))
        //        done(JSON.parse(body));
            
        //    })
    }
});
