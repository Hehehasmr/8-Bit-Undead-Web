let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
    scene: [StartMenu, PlayScene, ShopScene, GameOverScene]
};

let game = new Phaser.Game(config);

class StartMenu extends Phaser.Scene {
    constructor() { super("StartMenu"); }

    preload() {
        this.load.image('player', 'character.png'); // Updated player image
        this.load.image('bullet', 'bullet.png');
        this.load.image('zombie', 'zombie.png');
    }

    create() {
        this.add.text(250, 200, "8-Bit Undead", { fontSize: "32px", fill: "#fff" });
        this.add.text(250, 300, "Press 1 for Easy Mode", { fontSize: "20px", fill: "#fff" });
        this.add.text(250, 350, "Press 2 for Hard Mode", { fontSize: "20px", fill: "#fff" });
        this.add.text(250, 400, "Press S for Shop", { fontSize: "20px", fill: "#fff" });

        this.input.keyboard.on("keydown-ONE", () => this.scene.start("PlayScene", { difficulty: "easy" }));
        this.input.keyboard.on("keydown-TWO", () => this.scene.start("PlayScene", { difficulty: "hard" }));
        this.input.keyboard.on("keydown-S", () => this.scene.start("ShopScene"));
    }
}

class PlayScene extends Phaser.Scene {
    constructor() { super("PlayScene"); }

    create(data) {
        this.difficulty = data.difficulty;
        this.player = this.physics.add.sprite(400, 300, 'player').setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.bullets = this.physics.add.group({ defaultKey: 'bullet' });
        this.zombies = this.physics.add.group();
        this.health = (this.difficulty === "easy") ? 100 : 50;
        this.healthText = this.add.text(10, 10, `Health: ${this.health}`, { fontSize: "20px", fill: "#fff" });

        for (let i = 0; i < (this.difficulty === "easy" ? 3 : 6); i++) {
            this.spawnZombie();
        }

        this.input.keyboard.on("keydown-SPACE", () => this.fireBullet());
        this.physics.add.overlap(this.bullets, this.zombies, this.killZombie, null, this);
        this.physics.add.overlap(this.player, this.zombies, this.takeDamage, null, this);
    }

    update() {
        this.player.setVelocity(0);
        if (this.cursors.left.isDown) this.player.setVelocityX(-160);
        if (this.cursors.right.isDown) this.player.setVelocityX(160);
        if (this.cursors.up.isDown) this.player.setVelocityY(-160);
        if (this.cursors.down.isDown) this.player.setVelocityY(160);
        this.zombies.children.iterate(zombie => this.physics.moveToObject(zombie, this.player, 50));
    }

    fireBullet() {
        let bullet = this.bullets.get(this.player.x, this.player.y);
        if (bullet) bullet.setVelocityX(300);
    }

    spawnZombie() {
        let zombie = this.physics.add.sprite(Phaser.Math.Between(50, 750), Phaser.Math.Between(50, 550), 'zombie');
        this.zombies.add(zombie);
    }

    killZombie(bullet, zombie) {
        bullet.destroy();
        zombie.destroy();
    }

    takeDamage(player, zombie) {
        this.health -= 10;
        this.healthText.setText(`Health: ${this.health}`);
        if (this.health <= 0) this.scene.start("GameOverScene");
    }
}

class ShopScene extends Phaser.Scene {
    constructor() { super("ShopScene"); }

    create() {
        this.add.text(300, 200, "Shop", { fontSize: "32px", fill: "#fff" });
        this.add.text(300, 300, "Press B to Buy Weapon Upgrade", { fontSize: "20px", fill: "#fff" });
        this.add.text(300, 350, "Press M to Return to Menu", { fontSize: "20px", fill: "#fff" });

        this.input.keyboard.on("keydown-B", () => alert("Weapon upgraded!"));
        this.input.keyboard.on("keydown-M", () => this.scene.start("StartMenu"));
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() { super("GameOverScene"); }

    create() {
        this.add.text(300, 250, "Game Over!", { fontSize: "32px", fill: "#ff0000" });
        this.add.text(300, 300, "Press M to Return to Menu", { fontSize: "20px", fill: "#fff" });

        this.input.keyboard.on("keydown-M", () => this.scene.start("StartMenu"));
    }
}
