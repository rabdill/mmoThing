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

exports.demolish = function(req, res) {
	City.remove({ name: "Delran" }, function(err) {
		if(err) {
			res.json(500, { message: err });
		} else {
			var timestamp = Math.floor(new Date() / 1000);
			var delran = new City({	name: "Delran"});
			delran.save(function(err) {
				if(err) {
					res.json(500, { message: err });
				} else {
					res.json(201, { message: delran.population.count });
				}
			});
		}
	});
};
