var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var q = require('q');
var gameData = require('../meta/game').gameData;

var citySchema = new Schema({
	name : String,
	ruler : String,
	population : {
		count: { type : Number, default: gameData.basePopulationCount },
		rate: { type : Number, default: gameData.basePopulationGrowth },
		capacity: { type : Number, default: gameData.basePopulationCap },
	},
	coin : {
		count: { type : Number, default: gameData.baseCoinCount },
		ratePerCapita: { type : Number, default: gameData.baseTaxRevenue }
	},
	buildings : {
		houses : [{level : Number}],
		farms : [{ level : Number }]
	},
	food : {
		count: { type : Number, default : gameData.baseFoodCount },
		rate: { type : Number, default : gameData.baseFoodProduction},
		consumptionPerCapita: { type : Number, default : gameData.baseFoodConsumption }
	},
	last_updated : { type : Date, default: Date.now }
});

citySchema.methods.update = function() {
	var self = this;	// in this case, will be a particular city
	var now = new Date().getTime();
	var last = new Date(self.last_updated).getTime();

	// fast-forward however many ticks have happened since last update:
	for(var i=0; i < ((now - last)/1000); i++) {
		// check if there's room for more people, add them:
		if(self.population.count < self.population.capacity) {
			if(self.population.count + self.population.rate > self.population.capacity) {
				self.population.count = self.population.capacity;
			} else {
				self.population.count += self.population.rate;
			}
		}
		// add tax revenue:
		self.coin.count += self.coin.ratePerCapita * self.population.count;
		// add food:
		self.food.count += self.food.rate - (self.food.consumptionPerCapita * self.population.count);
	}
	self.last_updated = now;

	// save update:
	return q.promise(function(resolve, reject) {
		self.model('city').update({ _id: self.id }, { $set: self }, function(err) {
			if(err) reject(err);
			else resolve(self);
		});
	});
};

citySchema.statics.findByName = function(search) {
	var self = this;	// in this case, will be the "city" schema as a whole
	return q.promise(function(resolve, reject) {
		self.findOne({ name: search }, function(err, city) {
			if(err) reject(err);
			else if(!city) reject(new Error("No city named " + search));
			else {
				resolve(city);
			}
		});
	});
};

citySchema.statics.findByUser = function(search) {
	var self = this;	// in this case, will be the "city" schema as a whole
	return q.promise(function(resolve, reject) {
		self.findOne({ ruler: search }, function(err, city) {
			if(err) reject(err);
			else if(!city) reject(new Error("No city for userId " + search));
			else {
				resolve(city);
			}
		});
	});
}


module.exports = {
	City: mongoose.model('city', citySchema),
};
