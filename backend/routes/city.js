var City = require('../models/city').City;

var update = function(city) {
	var now = new Date().getTime();
	var last = new Date(city.last_updated).getTime();

	// update tax revenue before population gets updated:
	city.coin.count += city.coin.ratePerCapita * city.population.count;

	// update population:
	city.population.count += ((now - last)/1000) * city.population.rate;
	city.last_updated = now;
	return city;
};

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
				city = update(city);
				City.findByIdAndUpdate(city.id, { $set: city }, function (err, data) {
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
