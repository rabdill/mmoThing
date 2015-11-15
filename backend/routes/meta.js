var structures = require('../meta/structures');
var gameData = require('../meta/game').gameData;
var secrets = require('../meta/secrets');
var https = require('https');
var http = require('http');
var User = require('../models/user').User;
var City = require('../models/city').City;

exports.lookup = function(req, res) {
	switch(req.params.category) {
		case "game" :
			res.json(200, gameData );
			break;
		default:
			res.json(200, structures[req.params.category]);
			break;
	}
};

exports.userLogin = function(req, res) {
	// verify that the token that was just sent has been issued for our app
	var reqUrl = "https://graph.facebook.com/v2.5/debug_token?input_token=" + req.body.token + "&access_token=" + secrets.appId + "|" + secrets.appSecret;

	https.get(reqUrl, function(fbook) {
		fbook.on("data", function(response) {	// wait for the body of the response
			response = JSON.parse(response);	// convert it to an object
			verifyToken(response.data, req.params.id);	// take facebook's response and make sure it matches what we want
	  });
	});

	var verifyToken = function(data, userId) {
		console.log("Verifying");
		if(data.app_id == secrets.appId && data.is_valid && data.user_id == userId) {
			// if the token's legit, check if we know the user
			/* (this doesn't use a method attached to the User model because
					doing so here made everything look like a damn car crash.) */
			User.findOne({ 'fbook.id' : userId }, function(err, user) {
				if(err) {
					console.log(err);
					res.json(500);
				}
				else if(!user) {
					res.json(404, null);	/* if you don't put "null" here, it sends
																	a 200 response with "404" as the body. */
				}
				else {
					res.json(200, user);
				}
			});
		} else {	// if the token is invalid or doesn't match
			console.log("HACKER ALARM");
			res.json(400);
		}
	};
};

exports.createUser = function(req, res) {
	var reqUrl = "https://graph.facebook.com/v2.5/debug_token?input_token=" + req.body.token + "&access_token=" + secrets.appId + "|" + secrets.appSecret;

	https.get(reqUrl, function(fbook) {
		fbook.on("data", function(response) {	// wait for the body of the response
			response = JSON.parse(response);	// convert it to an object
			console.log(response.data);
			createRuler(response.data);
	  });
	});

	var createRuler = function(data) {
		var newUser = new User({
			fbook : {
				id: req.body.userId,
				token : req.body.token,
				expires : data.expires_at * 1000
			}
		});
		newUser.save(function(err) {
			if(err) {
				res.json(500, { message: err });
			} else {
				createCity();
			}
		});
	};

	var createCity = function() {
		var timestamp = Math.floor(new Date() / 1000);
		var newCity = new City({
			name: req.body.town,
			ruler: req.body.userId
		});
		newCity.save(function(err) {
			if(err) {
				res.json(500, { message: err });
			} else {
				res.json(201, newCity);
			}
		});
	};

};

exports.newFakeGame = function(req, res) {
	var createCity, deleteUser, createUser;

	City.remove({}, function(err) {
		if(err) {
			res.json(500, { message: err });
		} else {
			deleteUser();
		}
	});

	createCity = function(user) {
		var timestamp = Math.floor(new Date() / 1000);
		var delran = new City({
			name: "Delran",
			ruler: secrets.richFbookId
		});
		delran.save(function(err) {
			if(err) {
				res.json(500, { message: err });
			} else {
				res.json(201, user);
			}
		});
	};

	deleteUser = function() {
		User.remove({}, function(err) {
			if(err) {
				res.json(500, { message: err });
			} else {
				createUser();
			}
		});
	};

	createUser = function() {
		var richard = new User({
			firstName : "Rich",
			fbook : {
				id: secrets.richFbookId,
				token : secrets.richsUserToken,
				expires : 1447524000000
			}
		});
		richard.save(function(err) {
			if(err) {
				res.json(500, { message: err });
			} else {
				createCity(richard);
			}
		});
	};
};
