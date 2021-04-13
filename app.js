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

//ROUTES
const indexRoutes 	 = require("./routes/index"),
	  categoryRoutes = require("./routes/categories"),
	  gameRoutes     = require("./routes/game.js");

//SERVER INTO IO
const server = app.listen(3000, function() {
	console.log("Server up on 3000.");
});
const io = socket(server);

//SOCKETS
io.on("connection", socket => {
	console.log("Connected IO", socket.id);
	//Handle incoming
	socket.on("message", function(data){
		console.log(data);
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

app.use(indexRoutes);
app.use(categoryRoutes);
app.use(gameRoutes);

// PASSPORT
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 
