const express		= require("express"),
	  app	 		= express(),
	  bodyParser 	= require("body-parser"),
	  mongoose 		= require("mongoose"),
	  passport		= require("passport"),
	  LocalStrategy = require("passport-local"),
	  session 		= require("express-session"),
	  flash			= require("connect-flash"),
	  methodOverride= require("method-override"),
	  socket		= require("socket.io"),
	  User 			= require("./models/user"),
	  Category		= require("./models/category");

let clients = {};

//SERVER INTO IO
const server = app.listen(3000, function() {
	console.log("Server up on 3000.");
});
const io = socket(server);

//SOCKETS
io.on("connection", socket => {
	console.log("Connected IO", socket.id);
	//Handle incoming
	socket.on("toggle", function(data){
		io.sockets.emit("toggle", data);
	});
});

// CONFIG DB
mongoose.connect("mongodb://localhost:27017/faker_v1", {
	useNewUrlParser: true,
	useUnifiedTopology: true
	})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

//CONFIG APP
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(session ({
	secret: "Secret",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

// //PASSPORT
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

// LANDING PAGE ROUTE
app.get("/", function (req, res) {
	console.log("Session ID", req.sessionID);
	res.render("home");
});

// LOGIN
app.post("/", passport.authenticate("local", 
		{
			successRedirect: "/lobby",
			failureRedirect: "/"
		}), function (req, res) {}
);

//Lobby
app.get("/lobby", (req, res) => {
	console.log("SessionID Lobby", req.sessionID);
	clients["clientID"] = req.sessionID;
	console.log(clients);
	res.render("lobby")
})

// REGISTRATION (& RULES) ROUTE
app.get("/register", function (req, res){
	res.render("register")
})

app.post("/register", function (req, res){
	const newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function (err, user) {
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res, function () {
			res.redirect("/categories");
		})
	});
});

// INDEX ROUTE
app.get("/categories", function (req, res) {
	console.log("Session ID2", req.sessionID);
	Category.find({}, function (err, allCategories) {
		if(err) {
			console.log(err);
		} else {
			res.render("index", {categories: allCategories});
		}
	})
});

// NEW ROUTE
app.get("/categories/new", function (req, res) {
	res.render("new");
});

// SHOW ROUTE
app.get("/categories/:id", function (req, res) {
	Category.findById(req.params.id, function (err, foundCategory) {
		if(err) {
			console.log(err);
		} else {
			res.render("show", {category: foundCategory});
		}
	})
});

// CREATE ROUTE
app.post("/categories", function (req, res) {
	Category.create(req.body.category, function (err, newCategory) {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/categories");
		}
	})
});

// EDIT ROUTE
app.get("/categories/:id/edit", function (req, res) {
	Category.findById(req.params.id, function (err, foundCategory){
		if(err) {
			console.log(err);
		} else {
			res.render("edit", {category: foundCategory});
		}
	})
});

// UPDATE ROUTE
app.put("/categories/:id", function (req, res) {
	Category.findByIdAndUpdate(req.params.id, req.body.category,
			function (err, updatedCategory) {
				if(err) {
					// eventually res.redirect("back or show?")
					console.log(err);
				} else {
					res.redirect("/categories/"+req.params.id);
				}
			}
	)
});

// DESTROY ROUTE
app.delete("/categories/:id", function (req, res) {
	Category.findByIdAndRemove(req.params.id, function (err) {
		if(err) {
			res.redirect("/categories");
		} else {
			res.redirect("/categories");
		}
	})
});
  

