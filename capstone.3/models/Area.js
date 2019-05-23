var mongoose = require("mongoose");
//var passportLocalMongoose = require("passport-local-mongoose");

var areaSchema = new mongoose.Schema({
    AreaNumber: Number,
    Name: String,
    noDustbins: Number,
    filled: Number
    
});
 
//collectorSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Area", areaSchema);