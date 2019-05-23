var mongoose = require("mongoose");


var truckSchema = new mongoose.Schema({
   truckId: Number,
   capacity: Number,
   model: String,
   lat: Number,
   long: Number
});
 


module.exports = mongoose.model("Truck", truckSchema);