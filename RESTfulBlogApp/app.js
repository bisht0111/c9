var express = require("express");
var app = express();
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

var  blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

/*Blog.create({
    title: "Test Blog" ,
    image: "https://images.unsplash.com/photo-1539860033517-9dcef150c133?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ec5ac6ffaf5ab9d7513fe8f4bc64ad49&auto=format&fit=crop&w=500&q=60",
    body: "Hello!"
});
*/
app.get("/",function(req, res) {
    res.redirect("/blogs") ;
});

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("Error!!");
        } else {
            res.render("index",{blogs:blogs});
        }
    });
});

app.get("/blogs/new",function(req, res) {
    res.render("new") ;
});

app.post("/blogs",function(req,res){
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id",function(req, res) {
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show",{blog: foundBlog});
        }
    });
});

app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit",{blog: foundBlog});
        }
    }) ;
});

app.put("/blogs/:id", function(req, res){
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
       if(err){
           console.log(err);
       } else {
         var showUrl = "/blogs/" + blog._id;
         res.redirect(showUrl);
       }
   });
});

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    }) ;
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server is running") ;
});