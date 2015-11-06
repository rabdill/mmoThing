var City = require('../models/city').City;

exports.square = function(req, res) {
	City.findOne({ name: req.params.city }, function(err, city) {
		if(err) {
			res.json(500, { message: err });
		} else {
			if(!city) {
				console.log(req.query);
				res.json(404, { message: "No city called " + req.params.city });
			} else {
				res.json(200, {
					name: city.name,
					population: city.population
				});
			}
		}
	});
};

exports.demolish = function(req, res) {
	City.remove({ name: "Delran" }, function(err) {
		if(err) {
			res.json(500, { message: err });
		} else {
			var delran = new City({ name: "Delran", population: 20});
			delran.save(function(err) {
				if(err) {
					res.json(500, { message: err });
				} else {
					res.json(201, { message: delran.name });
				}
			});
		}
	});
};
