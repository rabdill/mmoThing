var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var citySchema = new Schema({
	name : String,
	population : Number
});

module.exports = {
	City: mongoose.model('city', citySchema)
};
