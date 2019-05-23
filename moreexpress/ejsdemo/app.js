var express = require("express");
var app = express();

app.get("/", function(req, res){
   res.send("Hi!") ;
});

app.get("/file/:name", function(req, res){
   var name=req.params.name;
   res.render("file.ejs",{name:name}) ;
});

app.get("/friends",function(req, res) {
   var friends=["Tony", "Miranda", "Justin", "Pierre", "Lilly"];
   res.render("friends.ejs",{friends,friends}); 
});

app.get("*",function(req, res) {
   res.send("Wrong url!") ;
});

app.listen(process.env.PORT,process.env.IP, function() {
   console.log("Server is running");
});