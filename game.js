console.log("Game.js is running!"); // Debugging message

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    class StartMenu extends Phaser.Scene {
        constructor() { super("StartMenu"); }

        preload() {
            this.load.image('player', 'character.png');
            this.load.image('bullet', 'bullet.png');
            this.load.image('zombie', 'zombie.png');
            this.load.audio('menuMusic', 'menu-music.mp3');
        }

        create() {
            this.cameras.main.setBackgroundColor('#111'); // Dark mode background
            this.music = this.sound.add('menuMusic', { loop: true, volume: 0.5 });
            this.music.play();

            this.add.text(250, 200, "8-Bit Undead", { fontSize: "40px", fill: "#fff" });
            this.add.text(250, 300, "Press 1 for Easy Mode", { fontSize: "20px", fill: "#fff" });
            this.add.text(250, 350, "Press 2 for Hard Mode", { fontSize: "20px", fill: "#fff" });

            this.input.keyboard.on("keydown-ONE", () => {
                this.music.stop();
                this.scene.start("PlayScene", { difficulty: "easy" });
            });
            this.input.keyboard.on("keydown-TWO", () => {
                this.music.stop();
                this.scene.start("PlayScene", { difficulty: "hard" });
            });
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
            this.ammo = 10;
            this.wave = 1;
            this.score = 0;
            this.healthText = this.add.text(10, 10, `Health: ${this.health}`, { fontSize: "20px", fill: "#fff" });
            this.ammoText = this.add.text(10, 40, `Ammo: ${this.ammo}`, { fontSize: "20px", fill: "#fff" });
            this.waveText = this.add.text(10, 70, `Wave: ${this.wave}`, { fontSize: "20px", fill: "#fff" });
            this.scoreText = this.add.text(10, 100, `Score: ${this.score}`, { fontSize: "20px", fill: "#fff" });

            this.spawnWave();

            this.input.keyboard.on("keydown-SPACE", () => this.fireBullet());
            this.input.keyboard.on("keydown-R", () => this.reload());

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
            if (this.ammo > 0) {
                let bullet = this.bullets.create(this.player.x, this.player.y, 'bullet');
                this.physics.moveTo(bullet, this.input.x, this.input.y, 400);
                this.ammo--;
                this.ammoText.setText(`Ammo: ${this.ammo}`);
            }
        }

        reload() {
            this.ammo = 10;
            this.ammoText.setText(`Ammo: ${this.ammo}`);
        }

        spawnWave() {
            let numZombies = this.wave * (this.difficulty === "easy" ? 2 : 4);
            for (let i = 0; i < numZombies; i++) {
                let zombie = this.physics.add.sprite(Phaser.Math.Between(50, 750), Phaser.Math.Between(50, 550), 'zombie');
                this.zombies.add(zombie);
            }
        }

        killZombie(bullet, zombie) {
            bullet.destroy();
            zombie.destroy();
            this.score += 10;
            this.scoreText.setText(`Score: ${this.score}`);
        }
    }

    let config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
        scene: [StartMenu, PlayScene]
    };

    let game = new Phaser.Game(config);
});
