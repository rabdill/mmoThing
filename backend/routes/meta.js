var structures = require('../meta/structures');
var gameData = require('../meta/game').gameData;

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
