var express = require('express'),
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy;

var users = [];

passport.use(new TwitterStrategy({
	    consumerKey: 'twitter-app-consumer-key',
	    consumerSecret: 'twitter-app-consumer-secret',
	    callbackURL: "http://test.passport-twitter.com:3000/auth/twitter/callback"
	},
	function(token, tokenSecret, profile, done) {
		var user = users[profile.id] || 
				   (users[profile.id] = { id: profile.id, name: profile.username });
		done(null, user);
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	var user = users[id];
	done(null, user);
});

application = express.createServer();

application.configure(function() {
	application.use(express.bodyParser());
	application.use(express.methodOverride());
	application.use(express.cookieParser());
	application.use(express.session( { secret: '498f99f3bbee4ae3a075eada02488464' } ));
	application.use(passport.initialize());
	application.use(passport.session());
	application.use(application.router);
	application.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
	application.set('view engine', 'jade');
});

application.get('/', function(request, response) {
	console.log(request.user);

	response.render('index', {
		user: request.user
	});
});

application.get('/auth/twitter', passport.authenticate('twitter'));

application.get('/auth/twitter/callback', 
	passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/auth/twitter' }));

application.listen(3000);