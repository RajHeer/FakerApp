const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Category = require("../models/category");

let clients = {};

//LOBBY
router.get("/lobby", (req, res) => {
	console.log("SessionID Lobby", req.sessionID);
	clients["clientID"] = uuidv4();
	console.log(clients);
	res.render("lobby")
})

// CREATE GAME
router.post("/lobby", (req,res) => {
	res.redirect("/newgame/"+req.body.gameLink);
})

// JOIN GAME
router.get("/newgame/:gameLink", (req,res) =>{
	console.log("SessionID Game", req.sessionID);
	let count = '';
	Category.countDocuments({}, function(err, result){
        if(err){
            console.log(err);
        }
        else{
            count = result;
        }
	})
	Category.find({}, function (err, allCategories) {
		if(err) {
			console.log(err);
		} else {
			const selectedElements = () => {
				let nums = [];
				for(let i =0; i<3; i++){
					const randNum = Math.floor(Math.random()*count);
					nums.push(randNum);
				}
				let mappedElements=[];
				nums.forEach(num => {
					mappedElements.push(allCategories[num]);
				})
				return mappedElements
			}
			let threeElements = selectedElements();
			res.render("game", {categories: threeElements});
		}
	})
})

module.exports = router;
