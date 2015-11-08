var City = require('../models/city').City;
var houseData = require('../meta/structures').house;
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
			city.population.capacity += houseData.levels[0].capacity;
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
