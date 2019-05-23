var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

var campgrounds = [
        {name:"Salmon Creek", image:"https://invinciblengo.org/photos/event/slider/mount-abu-trekking-camp-aravalli-hills-rajasthan-nbMgzbA-1440x810.jpg"},
        {name:"Granite Hill", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwcCaxq2RkGYvD2JHf9EPz-srh-vZhdLOBdf6NXDWRqBWPqoA_"},
        {name:"Mountain Goat's Rest", image:"https://www.outsideonline.com/sites/default/files/styles/img_948x622/public/2017/05/05/best-car-camping-tents-dusk-campsite_h.jpg?itok=Fd-Vh4hw"}
    ]

app.get("/",function(req,res){
    res.render("home"); 
});

app.get("/campgrounds",function(req,res){
    res.render("campgrounds",{campgrounds:campgrounds});
});

app.post("/campgrounds",function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground={name:name, image:image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new",function(req, res) {
   res.render("new"); 
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Yelpcamp started!");
});