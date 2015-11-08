var City = require('../models/city').City;
var houseData = require('../structures').house;
var q = require('q');

exports.purchase = function(req, res) {
	City.findByName(req.params.city).
	then(function(city) {
		return city.update();
	}).
	then(function (city) {
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
	}).
	fail(function(err) {
		console.log(err);
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
