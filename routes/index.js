const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// LANDING PAGE ROUTE
router.get("/", function (req, res) {
	res.render("home");
});

// LOGIN
router.post("/", passport.authenticate("local", 
		{
			successRedirect: "/lobby",
			failureRedirect: "/"
		}), function (req, res) {}
);

// REGISTRATION (& RULES) ROUTE
router.get("/register", function (req, res){
	res.render("register")
})

router.post("/register", function (req, res){
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

module.exports = router;
