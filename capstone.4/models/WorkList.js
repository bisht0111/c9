var mongoose = require("mongoose");
//var collectorschema=require("./collector").schema;
var areaschema=require("./Area").schema;
var dustbinschema=require("./Dustbins").schema;
//var passportLocalMongoose = require("passport-local-mongoose");

var workListSchema = new mongoose.Schema({
  //  coll: collectorschema,
    area: areaschema,
    dustbin: [dustbinschema],
    RequestArrived: Date,
    RequestFulfilled: Date
});
 
//collectorSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("WorkList", workListSchema);