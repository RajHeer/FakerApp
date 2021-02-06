const socket = io.connect("https://r-bobby.run-eu-central1.goorm.io/");

//HTML elements
const cards 	= document.querySelectorAll(".four");


//EMIT MESSAGE
for (let card of cards) {
	card.addEventListener("click", function(){
		const clicked = this.id;
		console.log(this.id);
		socket.emit("toggle", clicked);
	});
}

//LISTEN MESSAGES
socket.on("toggle", function(data){
	const div = document.querySelector(`#${data}`)
	div.classList.toggle('grey');
});
