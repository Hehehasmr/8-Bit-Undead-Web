console.log("Game.js is running!"); // Debugging

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    let config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
        scene: { preload: preload, create: create, update: update }
    };

    let game = new Phaser.Game(config);
    console.log("Phaser Game Initialized!"); // Debugging

    function preload() {
        console.log("Preloading assets...");
        this.load.image('player', 'character.png');
        this.load.image('zombie', 'zombie.png');
        this.load.image('bullet', 'bullet.png');
    }

    function create() {
        console.log("Creating game scene...");
        this.cameras.main.setBackgroundColor('#222'); // Set a dark gray background for visibility
        
        this.add.text(300, 250, "Game Loaded!", { fontSize: "32px", fill: "#fff" });

        let player = this.physics.add.sprite(400, 300, 'player').setCollideWorldBounds(true);
        console.log("Player sprite added!");

        let cursors = this.input.keyboard.createCursorKeys();
    }

    function update() {
        console.log("Game updating...");
    }
});
