var mongoose = require("mongoose");
//var autoIncrement =  require('mongoose-auto-increment');

var truckSchema = new mongoose.Schema({
   truckid: Number,
   capacity: Number,
   model: String,
   lat: Number,
   long: Number
});
 
//truckSchema.plugin(autoIncrement.plugin, 'Truck');

module.exports = mongoose.model("Truck", truckSchema);