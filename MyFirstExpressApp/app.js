var express = require("express");
var app = express();

app.get("/", function(req,res) {
    res.send("Hi there, welcome to my assignment!");
});

app.get("/speak/:animalname",function(req, res) {
    var animal=req.params.animalname.toLowerCase();
    var sound="";
    if(animal==="cow")
    {
        sound="moo";
    }
    else if(animal==="pig")
    {
        sound="oink";
    }
    res.send("The "+animal+" says '"+sound+"'");
});

app.get("/repeat/:name/:number", function(req,res) {
    var nam=req.params.name;
    var num=Number(req.params.number);
    var sen="";
    for(var i=0; i<num; i++)
    {
        sen+=nam+" ";
    }
    res.send(sen);
});

app.get("*", function(req,res) {
    res.send("Sorry, page not found...What are you doing with your life?");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!!");
})