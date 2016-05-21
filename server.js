var express = require('express');
var app = express();
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/*

 var routes = require('./routes/index');
 var users = require('./routes/users');
 */

var mongoose=require('mongoose');



var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
// view engine setup
/*app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'jade');*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));
//app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());



/*app.use('/', routes);
 app.use('/users', users);*/
//app.use('/register', register);
// Connection to MongoDB
var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/WHAM!';
mongoose.connect(connectionString);

// User Schema
var UserSchema= mongoose.Schema({
    firstName:String,
    lastName:String,
    email: String,
    year_of_birth:Number,
    gender: String,
    password:String,
    prefFlag : false,
    preferences : {type  : Array, "default" : []}
},{collection:'User'});

var UserModel= mongoose.model('UserModel',UserSchema);

// Passport at use
passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function (username, password, done) {
        UserModel.findOne({ email: username, password: password }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        })
    }));

// User signing for the first time
app.post('/register',function(req,res){
    var newuser= req.body;
    console.log(newuser);

    UserModel.findOne({email:newuser.email},function(err,user){
        if(err){console.log("failed");return next(err);}
        if(user){
            res.json("A user exists with this email id.");
            return;
        }

        var newUser= new UserModel(req.body);
        if(req.body.email==""){
            res.send("error");
        }
        newUser.save(function(err,user){
            /*  req.login(user,function(err){*/
            if(err){return next(err);}
            console.log(user);
            res.json(user);
            console.log(user);
            /*});*/
        });
    });
});

// Get User Info

app.get('/getUserInfo/:id',function(req,res) {
    // var newuser =req.body;
    //console.log(user);
    var email = req.params.id;

    console.log(email);
    UserModel.findOne({email: email}, function (err, user) {

        if (err) {
            // res.send('error');
            console.log('error occured');
            res.send('error');
        }
        else {
            if (user == null || user == "") {
                // user=null;
                res.send('error');
            }
            else {
                var userInfo = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    yob: user.year_of_birth
                };

                res.send(userInfo);
            }
        }
    });
});

// Login User
app.post('/login', passport.authenticate('local'), function (req, res) {
    var user = req.user;
    console.log(user);
    res.json(user);
});

//Logout User
app.post('/logout', function (req, res) {
    var user = req.body;
    req.logout();
    console.log(user);
    res.send(user);
});


// Serialize and Deserialize user
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.send(401);
    else
        next();
};

app.post('/getProfiles', function(req, res){
    UserModel.find(function(err, user){
        if(err) res.json(err);
        //console.log(user);
        res.json(user);
    });
});

// Delete user from DB (admin)
app.post('/deleteUser', function(req, res){
    var email = req.body;
    console.log(email);
    UserModel.remove({email : email.user}, function(err, user){
        if(err) res.json(err);
        //console.log(user);
        res.json(user);
    })
});


// Update Preferences
app.post('/updatePreferences', function(req, res){
    var user = req.body;
    console.log(user);
    if(user.preference == undefined){
        user.preference = [];
    }
    UserModel.update(
        {"email" : user.username},
        {
            $set : {
                "prefFlag": true,
                "preferences": user.preference
            }

        }, function(err, user){
            if (err) throw err;
            console.log(user);
            res.send("success")
        });
});

// Fetch preferences
app.post('/getPreferences', function(req, res){
    var username = req.body;
    console.log(username);
    UserModel.findOne({email: username.username},function(err,user){
        if(err){console.log("failed")}

        if(user) {
            res.json(user);
            console.log(user);

        }
    });
});


//Forgot Password
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "noreply.wham@gmail.com",
        pass: "wham@123"
    }
});

app.post('/forgetPass',  function (req, res) {
    var oldUser= req.body;
    console.log(oldUser);
    UserModel.findOne({email:oldUser.lost_email},function(err,user){
        if(user==null){
            console.log("No user exist with this emailId");
            res.send("error");
            // return next(err);
        }
        // console.log(err);
        // console.log(user);
        if(user){
            smtpTransport.sendMail({
                from: "noreply.wham@gmail.com", // sender address
                to: oldUser.lost_email, // comma separated list of receivers
                subject: "WHAM-Password ✔", // Subject line
                text: "The password for your account is :"+ user.password// plaintext body
            }, function(error, response){
                if(error){
                    res.send(error);
                }else{
                    res.json(response);
                    console.log(response);
                    console.log("Message sent: " + response.message);
                }
            });
        }
    })});

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8000;

app.listen(port,ip);

module.exports = app;
