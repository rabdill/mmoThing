var structures = require('../meta/structures');
var gameData = require('../meta/game').gameData;
var secrets = require('../meta/secrets');
var https = require('https');

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
	//console.log(req.body);
	// verify that the token that was just sent has been issued for our app
	var reqUrl = "https://graph.facebook.com/v2.5/debug_token?input_token=" + req.body.token + "&access_token=" + secrets.appId + "|" + secrets.appSecret;
	https.get(reqUrl, function(fbook) {
		fbook.on("data", function(response) {
			response = JSON.parse(response);	// convert it to an object
			verifyToken(response.data, req.params.id);	// take facebook's response and make sure it matches what we want
	  });
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});

	var verifyToken = function(data, userId) {
		if(data.app_id == secrets.appId && data.is_valid && data.user_id == userId) {
			console.log("WE DID IT!!!");
		} else {
			console.log("HACKER ALARM");
		}
	};
};
