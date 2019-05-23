var express                =  require("express"),
    app                    =  express(),
    bodyParser             =  require("body-parser"),
    mongoose               =  require("mongoose"),
    //autoIncrement          =  require('mongoose-auto-increment'),
    session                =  require("express-session"),
    methodOverride         =  require("method-override"),
    cookieParser           =  require("cookie-parser"),
    Admin                  =  require("./models/admin"),
    Collector              =  require("./models/collector"),
    User                   =  require("./models/user"),
    Area                   =  require("./models/Area"),
    Dustbin                =  require("./models/Dustbins"),
    Truck                  =  require("./models/Truck"),
    WorkList               =  require("./models/WorkList"),
    passport               =  require("passport"),
    LocalStrategy          =  require("passport-local"),
    passportLocalMongoose  =  require("passport-local-mongoose"),
    request                =  require("request"),
    api_key = 'fe5eb88b65e4a86ddc5e70b7320bd8cf-52b0ea77-f554903c',
    domain = 'sandbox91ddc3b80a714fa5a772d16acdc43e26.mailgun.org',
    mailgun = require('mailgun-js')({apiKey: api_key, domain: domain}),
    flash                  =  require("connect-flash");

mongoose.connect("mongodb://localhost/capstone", {useNewUrlParser:true});
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

passport.use('Admin', new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

passport.use('Collector', new LocalStrategy(Collector.authenticate()));
passport.serializeUser(Collector.serializeUser());
passport.deserializeUser(Collector.deserializeUser());

passport.use('User', new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//===============TO SENT MAIL AUTOMATICALLY====================
/*var data = {
  from: 'Tribhuvan Bisht <tbisht0111@gmail.com>',
  to: 'tbisht0111@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!'
};

mailgun.messages().send(data, function (error, body) {
  if(error){
    console.log(error);
  }
  console.log(body);
});*/



//================================ROUTES==================================
app.get("/", function(req,res){
    res.render("home"); 
});
app.get("/About", function(req,res){
    res.render("About"); 
});
app.get("/Contact", function(req,res){
    res.render("Contact"); 
});


app.get("/login",function(req,res){
    res.render("login"/*{message: req.flash("error")}*/);
});

app.post("/login", passport.authenticate('Admin', 
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


app.post("/admin/collectors",isLoggedIn, function(req, res) {
    //saving the truck details
       var truck= new Truck({
         truckId: req.body.truckId,
   capacity: req.body.capacity,
   model: req.body.model,
     });
    truck.save(function (err) {
  if (err) {
      console.log(err);
  }
});
 //registering the collector
    var newCollector = new Collector({
        collectorid: req.body.collectorid,
    username: req.body.name + req.body.age,
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    gender: req.body.gender, 
    age: req.body.age,
    Address: req.body.address,
    truck:truck
    });
    var password= req.body.gender + req.body.mobile;
    var username=req.body.name + req.body.age;
     Collector.register(newCollector, password, function(err, user){
         if(err){
             return res.render("back");
         }
         passport.authenticate("local")(req, res, function(){
           res.redirect("/admin/collectors"); 
         });
     });
     //sending the credentials to the collector
     var data = {
  from: 'Tribhuvan Bisht <tbisht0111@gmail.com>',
  to: req.body.email,
  subject: 'Registration',
  text: 'Welcome to Intelitter! Your registration is completed. Username: '+username+" and Password: "+password
};

mailgun.messages().send(data, function (error, body) {
  if(error){
    console.log(error);
  }
  console.log(body);
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
    Truck.findByIdAndUpdate(req.body.truck.truckId,req.body.truck,function(err, updatedTruck) {
        if(err)
        {
            res.redirect("back");
        }
    });
    Collector.findByIdAndUpdate(req.params.id, req.body.collector, function(err,updatedCollector){
       if(err){
           res.redirect("back");
       } else{
            res.redirect("/collectors/"+req.params.id);
       }
    });
});

app.delete("/collectors/:id",isLoggedIn,function(req,res){
    Truck.findByIdAndRemove(req.params.id.truck.truckId,function(err) {
       if(err)
       {
           res.redirect("back");
       }
    });
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
    var area;
  Area.find(req.body.areanumber,function(err, foundArea) {
      if(err)
      {
           area=new Area({
              AreaNumber: req.body.areanumber,
    Name: req.body.area,
    noDustbins: 1,
    filled: 0
          });
      } else
      {
          foundArea.noDustbins=foundArea.noDustbins+1;
             foundArea.save(function (err) {
  if (err) {
      console.log(err);
  }
});
          
      }
  });
  var dustbin=new Dustbin(req.body.dustbin);
  dustbin.area=area;
  dustbin.save(function(err){
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
    var area=Dustbin.findById(req.params.id).area;
    area.noDustbins=area.noDustbins-1;
    area.save(function(err)
    {
        if(err){
            res.redirect("back");
        }
    });
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
app.get("collector/logout",function(req,res)
{
    req.logout();
    res.redirect("/collector/login");
});
app.post("/collector/login", passport.authenticate('Collector', 
    {
        successRedirect: "/collector",
        failureRedirect: "/collector/login"
    }), function(req, res){
});
app.get("/user/login",function(req, res) {
    res.render("login_user"); 
});
app.post("/user/login", passport.authenticate('User', 
    {
        successRedirect: "/user",
        failureRedirect: "/user/login"
    }), function(req, res){
});
app.get("/collector",function(req, res) {
    res.render("home_collector"); 
});

app.get("/user",function(req, res) {
    res.render("home_user"); 
});

app.get("/collector/work",isLoggedIn, function(req, res) {
    //console.log(req.collector);
    // res.render("collector_work", {work:req.collectorid.workList}); 
      
});
app.get("/home_collector",function(req,res){
    res.render("home_collector");
});

//==========AUTH ROUTES============
 app.get("/userRegister",function(req, res) {
     res.render("register");
 });

 app.post("/register", function(req, res){
     var newUser = new User({username: req.body.username});
     User.register(newUser, req.body.password, function(err, user){
         if(err){
             return res.render("register");
         }
         passport.authenticate("local")(req, res, function(){
           res.redirect("/user/login"); 
         });
     });
 });

//===========MIDDLEWARE===========
function isLoggedIn(req, res, next){
    console.log(req);
    if(req.isAuthenticated()){
        return next();
    }
    // req.flash("error", "Please! Log in first.");
    res.redirect("back");
} 
//===========change streams=====
/*var count_collectors=0;
Collector.countDocuments({},function(err, count){
    if(err){
        console.log(err);
    }else
    {
        count_collectors=count;
    }
})
const changeStream=Dustbin.watch();
changeStream.on("update",function(updatedDustbin){
    var area=updatedDustbin.area;
    var number=area.filled+1;
    area.filled=number;
    area.save(function(err){
        if(err)
        {
            console.log(err);
        }
    });
});
const changeStreamArea=Area.watch();
changeStreamArea.on("update",function(updatedArea){
   var total=updatedArea.noDustbins;
   var fill=updatedArea.filled;
   if( fill === total/2)
   {
       
   }
});
*/
app.listen(process.env.PORT, process.env.IP, function(err){
    if(err)
    {
        console.log(err);
    } else
    {
         console.log("The Server Has Started!");
    }
  
});