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
const path                 =  require("path");
    
mongoose.connect("mongodb://localhost/soft_lib");
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static(__dirname+ "/public"));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));
app.use(cookieParser('secret'));
app.set("view engine", "ejs");

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Library For Girls Hostel!",
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
var bookSchema = new mongoose.Schema({
    bookid: Number,
    title: String,
    author: String,
    copies: Number,
    genre: String,
    description: String
});
var Book = mongoose.model("Book", bookSchema);

var studentSchema = new mongoose.Schema({
    studentid: Number,
    name: String,
    email: String,
    fine: String,
    issue: [{
            bookid: Number,
            issuedate: Number,
            duedate: Number
            }],
    reserve:[{
            booksid: Number,
            reservedate: Number
            }]
});
var Student = mongoose.model("Student", studentSchema);

//================================ROUTES==================================
app.get("/", function(req,res){
    res.render("home"); 
});

app.get("/login",function(req,res){
    res.render("login"/* {message: req.flash("error")}*/);
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

app.get("/user",function(req,res){
    res.render("home_user"); 
});

app.post("/user",function(req,res){
    res.render("home_user"); 
});

//=========================ADMIN=============================

//=========BOOKS==========
app.get("/admin/books", function(req, res){
   Book.find({}, function(err, books){
       if(err){
           res.redirect("back");
       } else {
          res.render("books", {book: books}); 
       }
   });
});

app.post("/admin/books",isLoggedIn,function(req,res){
    Book.create(req.body.book, function(err, newBook){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/admin/books");
       }
    });
});

app.get("/books/new",isLoggedIn,function(req, res) {
    res.render("new_book"); 
});

app.get("/books/:id",function(req, res) {
    Book.findById(req.params.id, function(err,foundBook){
        if(err){
            res.redirect("back");
        } else {
            res.render("show_book",{book: foundBook});
        }
    }) ;
});

app.get("/books/:id/edit",isLoggedIn, function(req,res){
    Book.findById(req.params.id,function(err,foundBook){
       if(err){
           res.redirect("back");
       } else {
           res.render("edit_book",{book: foundBook});
       }
    });
});

app.put("/books/:id",isLoggedIn,function(req,res){
    Book.findByIdAndUpdate(req.params.id, req.body.book, function(err,updatedBook){
       if(err){
           res.redirect("back");
       } else{
            res.redirect("/books/"+req.params.id);
       }
    });
});

app.delete("/books/:id",isLoggedIn,function(req,res){
     Book.findByIdAndRemove(req.params.id, function(err){
         if(err){
             res.redirect("back");
         } else {
             res.redirect("/admin/books");
         }
     });
});

app.post("/search/books", function(req, res){
  Book.find({title:req.body.book.title}, function(err, foundBook){
      if(err){
          res.redirect("back");
      } else {
          res.render("books", {book: foundBook}); 
      }
  });
});

//===================STUDENTS========================
app.get("/admin/students", function(req, res){
   Student.find({}, function(err, students){
       if(err){
           res.redirect("back");
       } else {
          res.render("students", {student: students}); 
       }
   });
});

app.post("/admin/students",isLoggedIn,function(req,res){
    var newStud = req.body.student;
    var issue = [];
    issue.push(req.body.student0);
    issue.push(req.body.student1);
    issue.push(req.body.student2);
    newStud.issue = issue;
    var reserve = [];
    reserve.push(req.body.student0);
    reserve.push(req.body.student1);
    newStud.reserve = reserve;
    Student.create(newStud, function(err, newStudent){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/admin/students");
       }
    });
});

app.get("/students/new",isLoggedIn,function(req, res) {
    res.render("new_student"); 
});

app.get("/students/:id",function(req, res) {
    Student.findById(req.params.id, function(err,foundStudent){
        if(err){
            res.redirect("back");
        } else {
            res.render("show_student",{student: foundStudent});
        }
    }) ;
});

app.get("/students/:id/edit",isLoggedIn, function(req,res){
    Student.findById(req.params.id,function(err,foundStudent){
       if(err){
           res.redirect("back");
       } else {
           res.render("edit_student",{student: foundStudent});
       }
    });
});

app.get("/students/:id/issue",isLoggedIn, function(req,res){
    Student.findById(req.params.id,function(err,foundStudent){
       if(err){
           res.redirect("back");
       } else {
           res.render("issue_book",{student: foundStudent});
       }
    });
});

app.get("/students/:id/return",isLoggedIn, function(req,res){
    Student.findById(req.params.id,function(err,foundStudent){
       if(err){
           res.redirect("back");
       } else {
           res.render("return_book",{student: foundStudent});
       }
    });
});

app.get("/students/:id/fineupdate",isLoggedIn, function(req,res){
    Student.findById(req.params.id,function(err,foundStudent){
       if(err){
           res.redirect("back");
       } else {
           res.render("fine_update",{student: foundStudent});
       }
    });
});

app.put("/students/:id",isLoggedIn,function(req,res){
    var newStud = req.body.student;
    var issue = [];
    issue.push(req.body.student0);
    issue.push(req.body.student1);
    issue.push(req.body.student2);
    newStud.issue = issue;
    var reserve = [];
    reserve.push(req.body.student0);
    reserve.push(req.body.student1);
    newStud.reserve = reserve;
    Student.findByIdAndUpdate(req.params.id, newStud, function(err,updatedStudent){
       if(err){
           res.redirect("back");
       } else{
            res.redirect("/students/"+req.params.id);
       }
    });
});

app.delete("/students/:id",isLoggedIn,function(req,res){
     Student.findByIdAndRemove(req.params.id, function(err){
         if(err){
             res.redirect("back");
         } else {
             res.redirect("/admin/students");
         }
     });
});

app.post("/search/students", function(req, res){
  Student.find({studentid:req.body.student.studentid}, function(err, foundStudent){
      if(err){
          res.redirect("back");
      } else {
          res.render("students", {student: foundStudent}); 
      }
  });
});

app.get("/issue",isLoggedIn,function(req, res){
    res.render("issue_book"); 
});

app.get("/return",isLoggedIn,function(req, res){
    res.render("return_book"); 
});

app.get("/fineupdate",isLoggedIn,function(req, res){
    res.render("fine_book"); 
});

// ==========AUTH ROUTES============
// app.get("/adminregister",function(req, res) {
//     res.render("register");
// });

// app.post("/register", function(req, res){
//     var newAdmin = new Admin({username: req.body.username});
//     Admin.register(newAdmin, req.body.password, function(err, user){
//         if(err){
//             return res.render("register");
//         }
//         passport.authenticate("local")(req, res, function(){
//           res.redirect("/login"); 
//         });
//     });
// });

//===========MIDDLEWARE===========
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // req.flash("error", "Please! Log in first.");
    res.redirect("/login");
} 


//=============================USER=================================

//================BOOKS================

app.get("/user/books", function(req, res){
   Book.find({}, function(err, books){
       if(err){
           res.redirect("back");
       } else {
          res.render("books_user", {book: books}); 
       }
   });
});

app.get("/user/books/:id",function(req, res) {
    Book.findById(req.params.id, function(err,foundBook){
        if(err){
            res.redirect("back");
        } else {
            res.render("show_book_user",{book: foundBook});
        }
    }) ;
});

app.post("/user/search/books", function(req, res){
  Book.find({title:req.body.book.title}, function(err, foundBook){
      if(err){
          res.redirect("back");
      } else {
          res.render("books_user", {book: foundBook}); 
      }
  });
});

//======================STUDENTS=====================
app.get("/user/students", function(req, res){
   Student.find({}, function(err, students){
       if(err){
           res.redirect("back");
       } else {
          res.render("students_user", {student: students}); 
       }
   });
});

app.get("/user/students/:id",function(req, res) {
    Student.findById(req.params.id, function(err,foundStudent){
        if(err){
            res.redirect("back");
        } else {
            res.render("show_student_user",{student: foundStudent});
        }
    }) ;
});

app.get("/user/students/:id/reserve", function(req,res){
    Student.findById(req.params.id,function(err,foundStudent){
       if(err){
           res.redirect("back");
       } else {
           res.render("reserve_book",{student: foundStudent});
       }
    });
});

app.get("/user/students/:id/cancel", function(req,res){
    Student.findById(req.params.id,function(err,foundStudent){
       if(err){
           res.redirect("back");
       } else {
           res.render("cancel_reserve",{student: foundStudent});
       }
    });
});

app.put("/user/students/:id",function(req,res){
    var newStud = req.body.student;
    var reserve = [];
    reserve.push(req.body.student0);
    reserve.push(req.body.student1);
    newStud.reserve = reserve;
    Student.findByIdAndUpdate(req.params.id, newStud, function(err,updatedStudent){
       if(err){
           res.redirect("back");
       } else{
            res.redirect("/user/students/"+req.params.id);
       }
    });
});

app.post("/user/search/students", function(req, res){
  Student.find({studentid:req.body.student.studentid}, function(err, foundStudent){
      if(err){
          res.redirect("back");
      } else {
          res.render("students_user", {student: foundStudent}); 
      }
  });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Library Server Has Started!");
});