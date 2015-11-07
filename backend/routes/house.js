


var City = require('../models/city').City;
var houseData = require('../structures').house;

exports.purchase = function(req, res) {
	City.findOne({ name: req.params.city }, function(err, city) {
		if(err) res.json(500, { message: err });
		else {
			if(!city) res.json(404, { message: "No city called " + req.params.city });
			else {
				city.update(function (err, data) {
					if(err) res.json(500, { message: err });
					else {
						if(city.coin.count < houseData.levels[0].cost) {
							res.json(403, { message: "Not enough coin. Cost is " + houseData.levels[0].cost + "."});
						} else {
							city.coin.count -= houseData.levels[0].cost;
							city.buildings.houses.push({level: 0});
							City.findByIdAndUpdate(city.id, { $set: city }, function(err, city) {
								if(err) res.json(500, { message: err });
								else {
									res.json(200, { message: "House purchased!"});
								}
							});
						}
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
