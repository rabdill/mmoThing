var City = require('../models/city').City;

exports.square = function(req, res) {
	City.findOne({ name: req.params.city }, function(err, city) {
		if(err) {
			res.json(500, { message: err });
		} else {
			if(!city) {
				console.log(req.query);
				res.json(404, { message: "No city called " + req.params.city });
			}
			else {
				city.update(function (err, data) {
					if(err) res.json(500, { message: err });
					else {
						res.json(200, city);
					}
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
