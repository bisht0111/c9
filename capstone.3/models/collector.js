var mongoose = require("mongoose");
var truckSchema=require("./Truck").schema;
var workListSchema=require("./WorkList").schema;
var passportLocalMongoose = require("passport-local-mongoose");


var collectorSchema = new mongoose.Schema({
    collectorid: Number,
    username: String,
    password: String,
    name: String,
    email: String,
    mobile: Number,
    gender: String, 
    age: Number,
    Address: String,
    worklist:[workListSchema],
    truck: truckSchema
});
 
collectorSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Collector", collectorSchema);