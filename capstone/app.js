var express                =  require("express"),
    app                    =  express(),
    bodyParser             =  require("body-parser"),
    mongoose               =  require("mongoose"),
    session                =  require("express-session"),
    methodOverride         =  require("method-override"),
    cookieParser           =  require("cookie-parser"),
    Admin                  =  require("./models/admin"),
    passport               =  require("passport"),
    LocalStrategy          =  require("passport-local"),
    passportLocalMongoose  =  require("passport-local-mongoose"),
    request                =  require("request"),
    flash                  =  require("connect-flash");
    
mongoose.connect("mongodb://localhost/capstone");
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(cookieParser('secret'));
app.set("view engine", "ejs");

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Capstone!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

//MODELS
var collectorSchema = new mongoose.Schema({
    collectorid: Number,
    name: String,
    email: String,
    mobile: Number
});
var Collector = mongoose.model("Collector", collectorSchema);

var dustbinSchema = new mongoose.Schema({
    dustbinid: Number,
    areanumber: Number,
    area: String,
    fill: Number
});
var Dustbin = mongoose.model("Dustbin", dustbinSchema);

//================================ROUTES==================================
app.get("/", function(req,res){
    res.render("home"); 
});

app.get("/login",function(req,res){
    res.render("login"/*{message: req.flash("error")}*/);
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/admin",
        failureRedirect: "/login"
    }), function(req, res){
});

app.get("/logout", function(req, res){
   req.logout();
//   req.flash("success","Successfully, Logged you out!");
   res.redirect("/login");
});

app.get("/admin",isLoggedIn,function(req,res){
    // req.flash("success","Successfully, Logged you in!");
    res.render("home_admin"); 
});

//=========================ADMIN=============================

//=========COLLECTORS==========
app.get("/admin/collectors", function(req, res){
   Collector.find({}, function(err, collectors){
       if(err){
           res.redirect("back");
       } else {
          res.render("collectors", {collector: collectors}); 
       }
   });
});

app.post("/admin/collectors",isLoggedIn,function(req,res){
    Collector.create(req.body.collector, function(err, newCollector){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/admin/collectors");
       }
    });
});

app.get("/collectors/new",isLoggedIn,function(req, res) {
    res.render("new_collector"); 
});

app.get("/collectors/:id",function(req, res) {
    Collector.findById(req.params.id, function(err,foundCollector){
        if(err){
            res.redirect("back");
        } else {
            res.render("show_collector",{collector: foundCollector});
        }
    }) ;
});

app.get("/collectors/:id/edit",isLoggedIn, function(req,res){
    Collector.findById(req.params.id,function(err,foundCollector){
       if(err){
           res.redirect("back");
       } else {
           res.render("edit_collector",{collector: foundCollector});
       }
    });
});

app.put("/collectors/:id",isLoggedIn,function(req,res){
    Collector.findByIdAndUpdate(req.params.id, req.body.collector, function(err,updatedCollector){
       if(err){
           res.redirect("back");
       } else{
            res.redirect("/collectors/"+req.params.id);
       }
    });
});

app.delete("/collectors/:id",isLoggedIn,function(req,res){
     Collector.findByIdAndRemove(req.params.id, function(err){
         if(err){
             res.redirect("back");
         } else {
             res.redirect("/admin/collectors");
         }
     });
});

app.post("/search/collectors", function(req, res){
  Collector.find({collectorid:req.body.collector.collectorid}, function(err, foundCollector){
      if(err){
          res.redirect("back");
      } else {
          res.render("collectors", {collector: foundCollector}); 
      }
  });
});

//===================DUSTBINS========================
app.get("/admin/dustbins", function(req, res){
   Dustbin.find({}, function(err, dustbins){
       if(err){
           res.redirect("back");
       } else {
          res.render("dustbins", {dustbin: dustbins}); 
       }
   });
});

app.post("/admin/dustbins",isLoggedIn,function(req,res){
    Dustbin.create(req.body.dustbin, function(err, newDustbin){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/admin/dustbins");
       }
    });
});

app.get("/dustbins/new",isLoggedIn,function(req, res) {
    res.render("new_dustbin"); 
});

app.get("/dustbins/:id",function(req, res) {
    Dustbin.findById(req.params.id, function(err,foundDustbin){
        if(err){
            res.redirect("back");
        } else {
            res.render("show_dustbin",{dustbin: foundDustbin});
        }
    }) ;
});

app.get("/dustbins/:id/edit",isLoggedIn, function(req,res){
    Dustbin.findById(req.params.id,function(err,foundDustbin){
       if(err){
           res.redirect("back");
       } else {
           res.render("edit_dustbin",{dustbin: foundDustbin});
       }
    });
});

app.put("/dustbins/:id",isLoggedIn,function(req,res){
    Dustbin.findByIdAndUpdate(req.params.id, req.body.dustbin, function(err,updatedDustbin){
       if(err){
           res.redirect("back");
       } else{
            res.redirect("/dustbins/"+req.params.id);
       }
    });
});

app.delete("/dustbins/:id",isLoggedIn,function(req,res){
     Dustbin.findByIdAndRemove(req.params.id, function(err){
         if(err){
             res.redirect("back");
         } else {
             res.redirect("/admin/dustbins");
         }
     });
});

app.post("/search/dustbins", function(req, res){
  Dustbin.find({dustbinid:req.body.dustbin.dustbinid}, function(err, foundDustbin){
      if(err){
          res.redirect("back");
      } else {
          res.render("dustbins", {dustbin: foundDustbin}); 
      }
  });
});


//======================OTHERS=========================

app.get("/collector/login",function(req, res) {
    res.render("login_collector"); 
});

app.get("/user/login",function(req, res) {
    res.render("login_user"); 
});

app.get("/collector",function(req, res) {
    res.render("home_collector"); 
});

app.get("/user",function(req, res) {
    res.render("home_user"); 
});

app.get("/collector/work",function(req, res) {
    res.render("collector_work"); 
});
app.get("/home_collector",function(req,res){
    res.render("home_collector");
});

//==========AUTH ROUTES============
/* app.get("/adminregister",function(req, res) {
     res.render("register");
 });

 app.post("/register", function(req, res){
     var newAdmin = new Admin({username: req.body.username});
     Admin.register(newAdmin, req.body.password, function(err, user){
         if(err){
             return res.render("register");
         }
         passport.authenticate("local")(req, res, function(){
           res.redirect("/login"); 
         });
     });
 });*/

//===========MIDDLEWARE===========
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // req.flash("error", "Please! Log in first.");
    res.redirect("/login");
} 

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!");
});