var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');
require('dotenv').config()

var userModel = require('./users.js');
const { name } = require('ejs');
var router = express.Router();
git
passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: [ 'email','profile' ]
}, async function verify(issuer, profile, cb) {
  console.log(profile)
  try{
    var loginUser = await userModel.findOne({email: profile.emails[0].value})
    if(loginUser){
      return cb(null, loginUser)
    }else{
      let newUser = await userModel.create({username:profile.displayName,email:profile.emails[0].value })
      return cb(null, newUser)
    }
  }catch{
    return ("try Onthe Id")
  }
}));

// id: '118348116513721349',
// displayName: 'Dammy',
// name: { familyName: 'Dam', givenName: 'Da' },
// emails: [ { value: 'dammy@gmail.com' } ]
// }

// /* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user){
    res.render('index', { title: 'Express' });
  }else{
    res.redirect('login')
  }
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/login/federated/google', passport.authenticate('google'));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

module.exports = router;
