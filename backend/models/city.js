var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var citySchema = new Schema({
	name : String,
	population : {
		count: { type : Number, default: 20 },
		rate: { type : Number, default: 1 }
	},
	coin : {
		count: { type : Number, default: 0 },
		ratePerCapita: { type : Number, default: 0.1 }
	},
	buildings : {
		houses : [
			{level: Number}
		]
	},
	last_updated : { type : Date, default: Date.now }
});

citySchema.methods.update = function(callback) {
	var now = new Date().getTime();
	var last = new Date(this.last_updated).getTime();

	// update tax revenue before population gets updated:
	this.coin.count += this.coin.ratePerCapita * this.population.count;

	// update population:
	this.population.count += ((now - last)/1000) * this.population.rate;
	this.last_updated = now;

	// write it back to DB
	return this.model('city').findByIdAndUpdate(this.id, { $set: this }, callback);
};

module.exports = {
	City: mongoose.model('city', citySchema)
};
