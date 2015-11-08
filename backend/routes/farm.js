var City = require('../models/city').City;
var farmData = require('../meta/structures').farm;
var q = require('q');

exports.purchase = function(req, res) {
	City.findByName(req.params.city).
	then(function(city) {
		return city.update();
	}).
	then(function (city) {
		if(city.coin.count < farmData.levels[0].cost) {
			res.json(403, { message: "Not enough coin. Cost is " + farmData.levels[0].cost + "."});
		} else {
			city.coin.count -= farmData.levels[0].cost;
			city.food.rate += farmData.levels[0].rate;
			city.buildings.farms.push({level: 0});
			City.findByIdAndUpdate(city.id, { $set: city }, function(err, city) {
				if(err) res.json(500, { message: err });
				else {
					res.json(200, { message: "Farm purchased!"});
				}
			});
		}
	}).
	fail(function(err) {
		console.log(err);
	});
};
