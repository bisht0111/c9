var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

var campgroundSchema = new mongoose.Schema({
   name : String,
   image : String,
   description : String
});

var Campground = mongoose.model("Campground",campgroundSchema);

/*Campground.create({
    name:"Granite Hill",
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwcCaxq2RkGYvD2JHf9EPz-srh-vZhdLOBdf6NXDWRqBWPqoA_",
    description: "This is a huge Mountain!"
    },function(err, campground){
         if(err){
             console.log(err);
         }else{
             console.log("Newly created campground:");
             console.log(campground);
         }
});*/

app.get("/",function(req,res){
    res.render("home"); 
});

app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("index",{campgrounds:allCampgrounds});
        }
    })
});

app.post("/campgrounds",function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground={name:name, image:image, description:desc};
    Campground.create(newCampground,function(err,newlyCreated){
       if(err){
           console.log(err);
       } else {
           res.redirect("/campgrounds");
       }
    });
});

app.get("/campgrounds/new",function(req, res) {
   res.render("new"); 
});

app.get("/campgrounds/:id",function(req, res) {
    Campground.findById(req.params.id,function(err,foundCampground){
       if(err){
           console.log(err);
       } else {
            res.render("show",{campground:foundCampground}) ;    
       }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Yelpcamp started!");
});