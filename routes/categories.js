const express = require("express");
const router = express.Router();
const Category = require("../models/category");

// INDEX ROUTE
router.get("/categories", function (req, res) {
	Category.find({}, function (err, allCategories) {
		if(err) {
			console.log(err);
		} else {
			res.render("index", {categories: allCategories});
		}
	})
});

// NEW ROUTE
router.get("/categories/new", function (req, res) {
	res.render("new");
});

// SHOW ROUTE
router.get("/categories/:id", function (req, res) {
	Category.findById(req.params.id, function (err, foundCategory) {
		if(err) {
			console.log(err);
		} else {
			res.render("show", {category: foundCategory});
		}
	})
});

// CREATE ROUTE
router.post("/categories", function (req, res) {
	Category.create(req.body.category, function (err, newCategory) {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/categories");
		}
	})
});

// EDIT ROUTE
router.get("/categories/:id/edit", function (req, res) {
	Category.findById(req.params.id, function (err, foundCategory){
		if(err) {
			console.log(err);
		} else {
			res.render("edit", {category: foundCategory});
		}
	})
});

// UPDATE ROUTE
router.put("/categories/:id", function (req, res) {
	Category.findByIdAndUpdate(req.params.id, req.body.category,
			function (err, updatedCategory) {
				if(err) {
					console.log(err);
				} else {
					res.redirect("/categories/"+req.params.id);
				}
			}
	)
});

// DESTROY ROUTE
router.delete("/categories/:id", function (req, res) {
	Category.findByIdAndRemove(req.params.id, function (err) {
		if(err) {
			res.redirect("/categories");
		} else {
			res.redirect("/categories");
		}
	})
});

module.exports = router;
  