var mongoose = require("mongoose");
var area=require("./Area").schema;
//var passportLocalMongoose = require("passport-local-mongoose");

var dustbinSchema = new mongoose.Schema({
    dustbinid: Number,
    area: area,
    fill: Number,
    lat: Number,
    long: Number
});
 
//dustbinSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Dustbin", dustbinSchema);