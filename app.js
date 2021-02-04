const express		= require("express"),
	  app	 		= express(),
	  bodyParser 	= require("body-parser"),
	  mongoose 		= require("mongoose"),
	  methodOverride= require("method-override"),
	  socket		= require("socket.io"),
	  User 			= require("./models/user"),
	  Category		= require("./models/category");

//SERVER INTO IO
const server = app.listen(3000, function() {
	console.log("Server up on 3000.");
});
const io = socket(server);

//SOCKETS
io.on("connection", function (socket){
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
app.use(methodOverride("_method"))

// LANDING PAGE ROUTE
app.get("/", function (req, res) {
	res.render("home");
});

// INDEX ROUTE
app.get("/categories", function (req, res) {
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
  