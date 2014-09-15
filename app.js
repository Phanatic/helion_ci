var PORT = (process.env.VMC_APP_PORT || 3000)
  , HOST = (process.env.VCAP_APP_HOST || 'localhost');

var fs = require('fs')
  , express = require('express')
  , app = express.createServer()
  , passport = require('passport')
  , GitHubStrategy = require('passport-github').Strategy
  , GITHUB_CLIENT_ID = "258704db5e0a41019729"
  , GITHUB_CLIENT_SECRET = "a0e1d15b31367ff445e7c1265d6c1018de41d37e"
  , HelionCI = require('./app/sdk/helionci');

// Config
app.set('views', __dirname + '/app/views');
app.register('.html', require('ejs'));
app.set('view engine', 'html');

app.configure(function(){
  app.use(express.logger('\x1b[33m:method\x1b[0m \x1b[32m:url\x1b[0m :response-time'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.static(__dirname + '/public'));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

// Resources
function bootResources(app) {
  fs.readdir(__dirname + '/app/resource', function (err, files){
    if (err) { throw err; }
    files.forEach(function (file){
      if ((file.indexOf("~") > -1) || (file.indexOf(".svn") > -1)) {
        return;
      }

      var name = file.replace('.js', '')
        , Res = require('./app/resource/' + name);

      if (typeof Res !== 'function') {
        return; // since this isn't a resource
      }

      if (typeof Res.prototype.route !== 'function') {
        return; // since this isn't a resource
      }

      var r = new Res();
      r.route(app);
    });
  });
}

bootResources(app);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

function addWebHook(userToken, user, done) {
  var helionClient = new HelionCI();
  helionClient.addWebHook(userToken, user, done);
}

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    addWebHook(accessToken, profile, done);
  }
));

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHubwill redirect the user
//   back to this application at /auth/github/callback
app.get('/auth/github',
  passport.authenticate('github', { scope: 'admin:repo_hook'}),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/github/callback',
  passport.authenticate('github', {failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/github/addwebhook');
  });

if (!module.parent) {
  app.listen(PORT);
  console.log('App started on port: ' + PORT);
}

module.exports = app;
