console.log("Game.js is running!"); // Debugging message

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    let config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: { preload: preload, create: create }
    };

    let game = new Phaser.Game(config);
    console.log("Phaser Game Initialized!"); // Debugging

    function preload() {
        console.log("Preloading...");
    }

    function create() {
        console.log("Creating game scene...");
        this.cameras.main.setBackgroundColor('#444'); // Gray background

        let testRect = this.add.rectangle(400, 300, 100, 100, 0xff0000); // Red square
        console.log("Red square added!");
    }
});
