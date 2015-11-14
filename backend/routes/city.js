var City = require('../models/city').City;

exports.square = function(req, res) {
	City.findByName(req.params.city).
	then(function(city) {
		return city.update();
	}).
	then(function(data) {
		res.json(200, data);
	}).
	fail(function(err) {
		res.json(500, { message: "Something broke somewhere else." });
	});
};
