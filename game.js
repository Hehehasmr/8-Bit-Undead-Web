console.log("Game.js is running!");

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    // Global variables
    let player, cursors, bullets, zombies, health, score, ammo, wave, money;
    let lastShot = 0;
    let weaponLevel = 1;
    let shopItems = [
        { name: "Fire Rate Boost", cost: 50, effect: () => weaponLevel++ },
        { name: "More Ammo", cost: 30, effect: () => ammo += 10 },
        { name: "Health Pack", cost: 40, effect: () => health += 20 },
    ];

    class StartMenu extends Phaser.Scene {
        constructor() { super("StartMenu"); }

        preload() {
            this.load.image('player', 'character.png');
            this.load.image('bullet', 'bullet.png');
            this.load.image('zombie', 'zombie.png');
            this.load.audio('menuMusic', 'menu-music.mp3');
        }

        create() {
            this.cameras.main.setBackgroundColor('#111');
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
            cursors = this.input.keyboard.createCursorKeys();
            bullets = this.physics.add.group({ defaultKey: 'bullet' });
            zombies = this.physics.add.group();
            health = (this.difficulty === "easy") ? 100 : 50;
            ammo = 10;
            wave = 1;
            score = 0;
            money = 0;
            this.healthText = this.add.text(10, 10, `Health: ${health}`, { fontSize: "20px", fill: "#fff" });
            this.ammoText = this.add.text(10, 40, `Ammo: ${ammo}`, { fontSize: "20px", fill: "#fff" });
            this.waveText = this.add.text(10, 70, `Wave: ${wave}`, { fontSize: "20px", fill: "#fff" });
            this.scoreText = this.add.text(10, 100, `Score: ${score}`, { fontSize: "20px", fill: "#fff" });
            this.moneyText = this.add.text(10, 130, `Money: $${money}`, { fontSize: "20px", fill: "#fff" });

            this.spawnWave();

            this.input.keyboard.on("keydown-SPACE", () => this.fireBullet());
            this.input.keyboard.on("keydown-R", () => this.reload());

            this.physics.add.overlap(bullets, zombies, this.killZombie, null, this);
            this.physics.add.overlap(this.player, zombies, this.takeDamage, null, this);
        }

        update() {
            this.player.setVelocity(0);
            if (cursors.left.isDown) this.player.setVelocityX(-160);
            if (cursors.right.isDown) this.player.setVelocityX(160);
            if (cursors.up.isDown) this.player.setVelocityY(-160);
            if (cursors.down.isDown) this.player.setVelocityY(160);
            zombies.children.iterate(zombie => this.physics.moveToObject(zombie, this.player, 50));

            if (zombies.countActive() === 0) {
                wave++;
                this.waveText.setText(`Wave: ${wave}`);
                this.spawnWave();
            }
        }

        fireBullet() {
            let now = this.time.now;
            if (ammo > 0 && now - lastShot > 500 / weaponLevel) {
                let bullet = bullets.create(this.player.x, this.player.y, 'bullet');
                this.physics.moveTo(bullet, this.input.x, this.input.y, 400);
                ammo--;
                this.ammoText.setText(`Ammo: ${ammo}`);
                lastShot = now;
            }
        }

        reload() {
            ammo = 10;
            this.ammoText.setText(`Ammo: ${ammo}`);
        }

        spawnWave() {
            let numZombies = wave * (this.difficulty === "easy" ? 2 : 4);
            for (let i = 0; i < numZombies; i++) {
                let zombie = this.physics.add.sprite(Phaser.Math.Between(50, 750), Phaser.Math.Between(50, 550), 'zombie');
                zombies.add(zombie);
            }
        }

        killZombie(bullet, zombie) {
            bullet.destroy();
            zombie.destroy();
            score += 10;
            money += 5;
            this.scoreText.setText(`Score: ${score}`);
            this.moneyText.setText(`Money: $${money}`);
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
