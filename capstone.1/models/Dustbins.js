var mongoose = require("mongoose");
var area=require("./Area").schema;
//var autoIncrement          =  require('mongoose-auto-increment');
//var passportLocalMongoose = require("passport-local-mongoose");

var dustbinSchema = new mongoose.Schema({
    dustbinid: Number,
    area: area,
    fill: Number,
    lat: Number,
    long: Number
});
 
//dustbinSchema.plugin(passportLocalMongoose);
//dustbinSchema.plugin(autoIncrement.plugin, 'Dustbin');
module.exports = mongoose.model("Dustbin", dustbinSchema);