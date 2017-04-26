var authConfig = require('./config/auth'),
  express = require('express'),
  passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  WechatStrategy = require('passport-wechat'),
  WeiboStrategy = require('passport-weibo');
var port = process.env.PORT || 8000;

// Passport session setup.
//
//   For persistent logins with sessions, Passport needs to serialize users into
//   and deserialize users out of the session. Typically, this is as simple as
//   storing the user ID when serializing, and finding the user by ID when
//   deserializing.
passport.serializeUser(function(user, done) {
  // done(null, user.id);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  // Users.findById(obj, done);
  done(null, obj);
});


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
//   See http://passportjs.org/docs/configure#verify-callback
passport.use(new GoogleStrategy(

  // Use the API access settings stored in ./config/auth.json. You must create
  // an OAuth 2 client ID and secret at: https://console.developers.google.com
  authConfig.google,

  function(accessToken, refreshToken, profile, done) {

    // Typically you would query the database to find the user record
    // associated with this Google profile, then pass that object to the `done`
    // callback.
    return done(null, profile);
  }
));


// Express 4 boilerplate

var app = express();
//app.set('view engine', 'hbs');

var http = require('http').Server(app);
var io = require('socket.io')(http);

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/app'));


// Application routes

app.get('/', function(req, res) {
  res.render('index.html', {
    user: req.user
  });
});

app.get('/login', function(req, res) {
  res.render('login', {
    user: req.user
  });
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: ['openid email profile'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/oauth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    // Authenticated successfully
    res.redirect('http://localhost:8000/#!/view2');
  });

app.get('/auth/wechat',
  passport.authenticate('google', { scope: ['openid email profile'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/oauth/wechat/callback',
  passport.authenticate('wechat', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    // Authenticated successfully
    res.redirect('http://localhost:8000/#!/view2');
  });

app.get('/auth/weibo',
  passport.authenticate('weibo', { scope: ['openid email profile'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/oauth/weibo/callback',
  passport.authenticate('weibo', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    // Authenticated successfully
    res.redirect('http://localhost:8000/#!/view2');
  });

app.get('/account', ensureAuthenticated, function(req, res) {
  res.render('account', {
    user: req.user
  });
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

io.on('connection', function(socket){
  socket.on('userChat', function(msg){
    io.emit('userChat', msg);
  });
});

app.listen(port, function() {
  console.log("Listening Port..."+port );
});


// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
