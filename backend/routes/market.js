var City = require('../models/city').City;
var structures = require('../meta/structures');
var sellPrice = require('../meta/market').sellPrice;
var q = require('q');

var self = this;

exports.build = function(req, res) {
	City.findByName(req.params.city).
	then(function(city) {
		return city.update();
	}).
	then(function (city) {
		console.log(req.body.level);
		if(city.coin.count < structures[req.params.structure].levels[req.body.level].cost) {
			res.json(403, { message: "Not enough coin. Cost is " + structures[req.params.structure].levels[req.body.level].cost + "."});
		} else {
			// pay for it:
			city.coin.count -= structures[req.params.structure].levels[req.body.level].cost;

			// made the structure-specific modifications to the city:
			switch(req.params.structure) {
				case "house":
					city.population.capacity += structures[req.params.structure].levels[req.body.level].capacity;
					city.buildings.houses.push({level: req.body.level});
					break;
				case "farm":
					city.food.rate += structures[req.params.structure].levels[req.body.level].rate;
					city.buildings.farms.push({level: req.body.level});
					break;
			}
			// if it's an old one, remove the old one
			if(req.body.level > 0) {
				var oldLevel = req.body.level - 1;
				var corpus;
				switch(req.params.structure) {
					case "house":
						corpus = city.buildings.houses;
						city.population.capacity -= structures[req.params.structure].levels[oldLevel].capacity;
						break;
					case "farm":
						corpus = city.buildings.farms;
						city.food.rate -= structures[req.params.structure].levels[oldLevel].rate;
						break;
				}

				for(var i=0, item; item = corpus[i]; i++) {
					if(item.level == oldLevel) {
						corpus.splice(i,1);	/* passed by reference;
															will update the actual array automatically */
						break;
					}
				}
			}
			// re-save the updated city:
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
		res.json(500, { message: err });
	});
};

exports.sell = function(req, res) {
	City.findByName(req.params.city).
	then(function(city) {
		return city.update();
	}).
	then(function (city) {
		// made the structure-specific modifications to the city:
		switch(req.params.item) {
			case "food":
				if(city.food.count >= req.body.qty) {
					city.food.count -= req.body.qty;
					city.coin.count += req.body.qty * sellPrice.food;
				} else {
					res.json(403, { message: "Not enough food to sell that many."});
				}
				break;
		}
		// re-save the updated city:
		City.findByIdAndUpdate(city.id, { $set: city }, function(err, city) {
			if(err) res.json(500, { message: err });
			else {
				res.json(200, { message: "Sold " + req.body.qty + " " + req.params.item + "."});
			}
		});
	}).
	fail(function(err) {
		console.log(err);
		res.json(500, { message: err });
	});
};
