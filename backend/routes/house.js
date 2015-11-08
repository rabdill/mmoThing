var City = require('../models/city').City;
var houseData = require('../meta/structures').house;
var q = require('q');

var self = this;

exports.purchase = function(req, res) {
	City.findByName(req.params.city).
	then(function(city) {
		return city.update();
	}).
	then(function (city) {
		if(city.coin.count < houseData.levels[req.body.level].cost) {
			res.json(403, { message: "Not enough coin. Cost is " + houseData.levels[req.body.level].cost + "."});
		} else {
			city.coin.count -= houseData.levels[req.body.level].cost;
			city.population.capacity += houseData.levels[req.body.level].capacity;
			city.buildings.houses.push({level: req.body.level});
			City.findByIdAndUpdate(city.id, { $set: city }, function(err, city) {
				if(err) res.json(500, { message: err });
				else {
					res.json(200, { message: "Level " + req.body.level + " house added!"});
				}
			});
		}
	}).
	fail(function(err) {
		console.log(err);
	});
};

exports.upgrade = function(req, res) {
	City.findByName(req.params.city).
	then(function(city) {
		return city.update();
	}).
	then(function (city) {
		// figure out what the old one looked like, then throw it away
		var oldLevel;
		for(var i=0, house; house = city.buildings.houses[i]; i++) {
			if(house._id == req.body.id) {
				oldLevel = house.level;
				city.buildings.houses.splice(i,i+1);
				break;
			}
		}
		city.population.capacity -= houseData.levels[oldLevel].capacity;
		City.findByIdAndUpdate(city.id, { $set: city }, function(err, city) {
			if(err) res.json(500, { message: err });
			else {
				self.purchase({
					params : {city : city.name},
					body : {level : (oldLevel + 1)}
				},
				res); /* this has to pass a "res" value because the "purchase" method
									expects requests to be structured like the ones it gets directly
									from the browser. */
			}
		});
	}).
	fail(function(err) {
		console.log(err);
	});
};
