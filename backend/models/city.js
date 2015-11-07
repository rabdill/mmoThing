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
		ratePerCapita: { type : Number, default: 1 }
	},
	last_updated : { type : Date, default: Date.now }
});

module.exports = {
	City: mongoose.model('city', citySchema)
};
