var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


var User=require('../models/user');

var session = require('express-session');
var jwt = require('jsonwebtoken'); // Import JWT Package
var secret = 'rubikscube'; // Create custom secret to use with JWT

module.exports=function(app,passport){


  app.use(passport.initialize());
  app.use(passport.session());
   app.use(session({secret: 'harrypotter',resave: false,saveUninitialized: true,cookie: { secure: false }}));
 
 passport.serializeUser(function(user, done) {
    // If account active, give user token
  //console.log(user);
  token=jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '5h' });
  done(null, user.id);
   });

  passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
   // console.log(user);
    done(err, user);
   });
   });

  passport.use(new FacebookStrategy({
    clientID: '135764670403041',
    clientSecret:'0ae007573ae71abca98cc7510f8e8415',
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
   },


  function(req,accessToken, refreshToken, profile, done) {
   // User.findOrCreate(..., function(err, user) {
    //  if (err) { return done(err); }
   //   done(null, user);
   // });
   //null=no error,profile=fb profile
  // console.log(profile._json.email);
  
   User.findOne({ email: profile._json.email}).select('username email').exec(function(err,user){
         if (err)  done(err);

                if (user && user != null) {
                	
                     done(null, user);
                } else {
                    done(err);
                }
            });
        


  }
    ));

/*
   passport.use(new TwitterStrategy({
    consumerKey: ' QVRvSWCWJ43qMN2QPdpGSxTmP',
    consumerSecret: 'wcBPXM1Co9w7LSy2QnkkdCpF0dTD4fphkxZ7cI4BuGYF5BkWzF',
    callbackURL: "http://localhost:3000/auth/twitter/callback",
     userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
  },
  function(token, tokenSecret, profile, done) {
    console.log(profile);
    done(null,profile);
   
  }
   ));

*/

passport.use(new GoogleStrategy({
    clientID: '351217440159-l2kr2m4to088ac7kbvc49iud30nslrnt.apps.googleusercontent.com',
    clientSecret: '9GO03ZoqCXgB4FHm9EK_EGt5' ,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        // console.log(profile); 
       //});

     User.findOne({ email: profile.emails[0].value}).select('username password email').exec(function(err,user){
         if (err)  done(err);

                if (user && user != null) {
                	console.log(user);
                      done(null, user);
                } else {
                     done(err);
                }
            });

  }
));

app.get('/auth/google',passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login','profile','email']}));


app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }),function(req, res) {
   console.log(token);
    res.redirect('/google/' + token);
  });
/*
  app.get('/auth/twitter', passport.authenticate('twitter'));


  app.get('/auth/twitter/callback',passport.authenticate('twitter', { failureRedirect: '/twittererror' }));
*/
 app.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/facebookerror'}),function(req, res) {
        res.redirect('/facebook/' + token ); });
  
 app.get('/auth/facebook', passport.authenticate('facebook' ,{ scope: 'email' }));



	return passport;
}


