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
				var now = new Date().getTime();
				console.log("Now: " + now);
				var last = new Date(city.last_updated).getTime();
				console.log("Then: " + last);
				var elapsed = Math.floor((now - last)/1000);
				city.population += elapsed;
				console.log("Elapsed: " + elapsed);
				City.findByIdAndUpdate(city.id, { $set:{
					population : city.population,
					last_updated : now
				}}, function (err, data) {
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
				population: 20
			});
			delran.save(function(err) {
				if(err) {
					res.json(500, { message: err });
				} else {
					res.json(201, { message: delran.population });
				}
			});
		}
	});
};
