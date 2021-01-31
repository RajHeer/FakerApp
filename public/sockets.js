// const socket = io.connect("https://r-bobby.run-eu-central1.goorm.io/categories");
const socket = io.connect("https://r-bobby.run-eu-central1.goorm.io/");

// const socket = io();

//HTML elements

const cards 	= document.querySelectorAll(".four");
// console.log(cards);

//EMIT MESSAGE
for (let card of cards) {
	card.addEventListener("click", function(){
		const clicked = this.id;
		socket.emit("toggle", clicked);
	});
}

//LISTEN MESSAGES
socket.on("toggle", function(data){
	const div = document.querySelector(`#${data}`)
	div.classList.toggle('grey');
});

