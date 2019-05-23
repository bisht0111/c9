var express=require("express");
var app=express();

var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var friends=["Tony", "Mary", "Ruby", "Sam"];

app.get("/",function(req,res){
   res.render("home.ejs");
});

app.post("/addfriend",function(req,res){
    var name=req.body.name;
    friends.push(name);
   res.redirect("/friends");
});

app.get("/friends", function(req, res) {
    res.render("friends.ejs",{friends,friends});
});

app.get("*", function(req, res){
    res.send("Wrong URL");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Started!");
});