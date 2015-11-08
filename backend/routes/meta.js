var houseData = require('../meta/structures').house;
var gameData = require('../meta/game').gameData;

exports.lookup = function(req, res) {
	switch(req.params.category) {
		case "house" :
			res.json(200, houseData );
			break;
		case "game" :
			res.json(200, gameData );
			break;
	}

};
