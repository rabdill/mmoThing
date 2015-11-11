var City = require('../models/city').City;
var structures = require('../meta/structures');
var sellPrice = require('../meta/market').sellPrice;
var q = require('q');

var self = this;

exports.purchase = function(req, res) {
	City.findByName(req.params.city).
	then(function(city) {
		return city.update();
	}).
	then(function (city) {
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

exports.upgrade = function(req, res) {
	City.findByName(req.params.city).
	then(function(city) {
		return city.update();
	}).
	then(function (city) {
		// figure out what the old one looked like, then throw it away
		var oldLevel;

		// figure out where we're searching
		var corpus;
		switch(req.params.structure) {
			case "house":
				corpus = city.buildings.houses;
				break;
			case "farm":
				corpus = city.buildings.farms;
				break;
		}

		for(var i=0, item; item = corpus[i]; i++) {
			if(item._id == req.body.id) {
				oldLevel = item.level;
				corpus.splice(i,i+1);	/* passed by reference;
													will update the actual array automatically */
				break;
			}
		}

		switch(req.params.structure) {
			case "house":
				city.population.capacity -= structures[req.params.structure].levels[oldLevel].capacity;
				break;
			case "farm":
				city.food.rate -= structures[req.params.structure].levels[oldLevel].rate;
				break;
		}

		City.findByIdAndUpdate(city.id, { $set: city }, function(err, city) {
			if(err) res.json(500, { message: err });
			else {
				// once it's saved with the old one removed, add the new upgraded one
				self.purchase({
					params : {
						city : city.name,
						structure : req.params.structure
					},
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
