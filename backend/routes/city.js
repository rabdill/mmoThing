var City = require('../models/city').City;

var update = function(city) {
	var now = new Date().getTime();
	console.log("Now: " + now);
	var last = new Date(city.last_updated).getTime();
	console.log("Then: " + last);
	var elapsed = Math.floor((now - last)/1000);
	console.log("Elapsed: " + elapsed);

	city.population.value += elapsed * city.population.rate;
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
			var delran = new City({
				name: "Delran",
				population: {value: 20}
			});
			delran.save(function(err) {
				if(err) {
					res.json(500, { message: err });
				} else {
					res.json(201, { message: delran.population.value });
				}
			});
		}
	});
};
