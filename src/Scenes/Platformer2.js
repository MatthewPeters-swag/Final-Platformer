class Platformer2 extends Phaser.Scene {
    constructor() {
        super("platformerScene2");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 500;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
    }

    formatCoins(num) {
        return num.toString().padStart(3, '0');
    }

    create() {
        console.log("Switched to Platformer2 successfully!");
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-2", 18, 18, 45, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilset_packed", "tilemap_tiles");
        this.tileset1 = this.map.addTilesetImage("BackGround", "background_tiles");

        this.jumpSound = this.sound.add("jumpS");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // TODO: Add createFromObjects here
        // Find coins in the "Objects" layer in Phaser
        // Look for them by finding objects with the name "coin"
        // Assign the coin texture from the tilemap_sheet sprite sheet
        // Phaser docs:
        // https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Tilemaps.Tilemap-createFromObjects

        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });

        this.gem = this.map.createFromObjects("Objects", {
            name: "gem",
            key: "tilemap_sheet",
            frame: 67
        });

        // TODO: Add turn into Arcade Physics here
        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.gem, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);

        this.leftSwitchable = this.groundLayer.filterTiles((tile) => {
            if (tile.properties.switchable == "left") {
                return true;
            } else {
                return false;
            }
        });

        // set to invisible -- switch will control visibility
        for (let tile of this.leftSwitchable) {
            tile.visible = false;
        }

        // right-switchable
        this.rightSwitchable = this.groundLayer.filterTiles((tile) => {
            if (tile.properties.switchable == "right") {
                return true;
            } else {
                return false;
            }
        });

        // set to invisible -- switch will control visibility
        for (let tile of this.rightSwitchable) {
            tile.visible = false;
        }

        this.switchCollisionOngoing = false;

        let collisionProcess = (obj1, obj2) => {
            // One way collisions
            if (obj2.properties.oneway) {
                return false;
            } 
            
            // Invisible tiles don't affect the player
            if (!obj2.visible) {
                return false;
            }

            // Handle intersection with the switch
            // Look for moving left to right (-->)
            if (obj2.properties.switch
                && my.sprite.player.body.acceleration.x > 0) {
                        obj2.index = 67; // left leaning switch tile
                        for (let tile of this.leftSwitchable) {
                            tile.visible = true;
                        }
                        for (let tile of this.rightSwitchable) {
                            tile.visible = false;
                        }
                        return false;
                }
                if (obj2.properties.switch 
                    && my.sprite.player.body.acceleration.x < 0) {
                            obj2.index = 65; // right leaning switch tile
                            for (let tile of this.leftSwitchable) {
                                tile.visible = false;
                            }
                            for (let tile of this.rightSwitchable) {
                                tile.visible = true;
                            }
                            return false;
                    }
    
                return true;
    
            }

        let propertyCollider = (obj1, obj2) => {

            // Handle intersection with dangerous tiles
            if (obj2.properties.danger) {
                    // Collided with a danger tile, handle collision
                my.sprite.player.x = 30;
                my.sprite.player.y = 345;
            }
    
        }


        // set up player avatar
        my.sprite.player = this.physics.add.sprite(100, 100, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.setMaxVelocity(250, 1000);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer, propertyCollider, collisionProcess);

        // TODO: Add coin collision handler
         // Handle collision detection with coins
         this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy();
            coinCounter += 1;
            my.coinText.setText(this.formatCoins(coinCounter));
        }, null, this);

        this.physics.add.overlap(my.sprite.player, this.gem, (obj1, obj2) => {
            obj2.destroy();
            my.winText = this.add.text(1200, 0, "You Win! Press R to restart.", {
                fontSize: '12px',
                fill: '#vheyfcs',
                fontFamily: 'monospace'
            });

        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // set up key input for the R key ("rkey" is case sensative)
        this.rKey = this.input.keyboard.addKey('R');
        this.cKey = this.input.keyboard.addKey('C');
        this.lKey = this.input.keyboard.addKey('L');

        // debug key listener (assigned to D key)
        this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
        this.physics.world.debugGraphic.clear()
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);
        
        my.vfx.walking = this.add.particles(0, 5, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            random: true,
            scale: {start: 0.01, end: 0.04},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 700,
            gravityY: -100,
            alpha: {start: 1, end: 0.1},
            tint: 0xA65E2E, 
        });

        my.vfx.walking.stop();

        my.vfx.jumping = this.add.particles(0, 5, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            random: true,
            scale: {start: 0.03, end: 0.07},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 700,
            gravityY: -100,
            alpha: {start: 1, end: 0.1},
            tint: 0xFFFFFF, 
        });

        my.vfx.jumping.stop();

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        coinCounter = 0;

        my.coinText = this.add.text(0, 0, this.formatCoins(coinCounter), {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'monospace'
        });
    }

    update() {
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            } else {
                my.vfx.walking.stop();
            }

        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            } else {
                my.vfx.walking.stop();
            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            
            my.vfx.walking.stop();
        }

        if (my.sprite.player.y >= 600) {
            my.sprite.player.y = 100;
            my.sprite.player.x = 100;
        }

        if (Phaser.Input.Keyboard.JustDown(this.cKey)) {
            my.sprite.player.y = 50;
            my.sprite.player.x = 1300;
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.jumpSound.play();
            my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.jumping.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {

                my.vfx.jumping.start();

            }
            this.time.delayedCall(100, () => {
                my.vfx.jumping.stop();
            });
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

        if (Phaser.Input.Keyboard.JustDown(this.lKey)) {
            this.scene.start("platformerScene");
        } 
    }
}
