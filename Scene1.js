class Scene1 extends Phaser.Scene {
    
    constructor(){
        super("scene1");
    }
    
    
    // Preload
    
    preload(){
        this.load.image('tilesets', 'assets/tilesets.png');
        this.load.tilemapTiledJSON('start', 'start.json');
        this.load.tilemapTiledJSON('end', 'end.json');
        this.load.spritesheet('player', "assets/player.png", { frameWidth: 21, frameHeight: 29 });
        this.load.image('knife', "assets/knife.png");
        this.load.image('coin', "assets/coin.png");
        this.load.image('coin_score', "assets/coin_score.png");
        this.load.spritesheet('vie', "assets/health.png", { frameWidth: 172, frameHeight: 54});
        this.load.image('health_potion', "assets/health_potion.png");
        this.load.image('enemy1', "assets/enemy1.png");
        this.load.image('enemy2', "assets/enemy2.png");
        this.load.image('enemy3', "assets/enemy3.png");
        this.load.image('enemy4', "assets/enemy4.png");
        this.load.image('key', "assets/key.png");
        this.load.image('victory', "assets/victory.png");
    }
    
    
    // Create
    
    create(){
        
        
        // Cartes
        
        this.map = this.make.tilemap({ key: 'start' });
        this.tileset = this.map.addTilesetImage('oe', 'tilesets');

        this.ground = this.map.createStaticLayer('ground', this.tileset, 0, 0);
        this.environment = this.map.createDynamicLayer('environment', this.tileset, 0, 0);
        this.easter_egg = this.map.createDynamicLayer('easter_egg', this.tileset, 0, 0);
        
        
        // Inputs clavier
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        
        // Personnage
        
        this.player = this.physics.add.sprite(230, 180, 'player');
        
        
        // Ennemis
        
        this.enemy = this.physics.add.group();
        this.enemy.create(1700, 200, 'enemy1');
        this.enemy.create(1850, 90, 'enemy3');
        this.enemy.create(2000, 220, 'enemy1');
        this.enemy.create(2410, 220, 'enemy2');
        this.enemy.create(2650, 350, 'enemy3');
        this.enemy.create(1700, 750, 'enemy4');
        this.enemy.create(1900, 550, 'enemy1');
        this.enemy.create(820, 1070, 'enemy2');
        this.enemy.create(1050, 1250, 'enemy4');
        
        
        // Interface
        
        this.barreDeVie = this.add.sprite(100, 50, 'vie').setScrollFactor(0,0);
        this.add.image(1170, 50, 'coin_score').setScrollFactor(0);
        
        
        // Items
        
        this.knife = this.physics.add.image(80, 415, 'knife');
        this.coins = this.physics.add.group();
        this.coins.create(2720, 190, 'coin');
        this.coins.create(2820, 280, 'coin');
        this.coins.create(2800, 150, 'coin');
        this.coins.create(2700, 300, 'coin');
        this.coins.create(2870, 230, 'coin');
        this.coins.create(2930, 1250, 'coin');
        this.coins.create(3050, 1300, 'coin');
        this.coins.create(2850, 1370, 'coin');
        this.coins.create(2960, 1430, 'coin');
        this.coins.create(3100, 1500, 'coin');
        this.potions = this.physics.add.group();
        this.potions.create(2780, 230, 'health_potion');
        this.potions.create(2950, 1340, 'health_potion');
        
        
        // Porte
        
        this.moneyNeeded = this.add.text(567, 1170, '10', { fontSize: '40px', fill: '#FFFF00' });
        this.environment.setTileLocationCallback(18, 38, 1, 1, ()=>{
            if (money >= 10){
                this.environment.removeTileAt(18, 38, true, true, 1);
                this.moneyNeeded.destroy();
                money -=10;
        }});
        
        
        // Animation des déplacements
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
            frameRate: 10,
        });
        
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
            frameRate: 10,
        });
        
        
        // Animation des attaques
        
        this.anims.create({
            key: 'downA',
            frames: this.anims.generateFrameNumbers('player', { start: 12, end: 13 }),
            frameRate: 5,
        });
        
        this.anims.create({
            key: 'leftA',
            frames: this.anims.generateFrameNumbers('player', { start: 14, end: 15 }),
            frameRate: 5,
        });

        this.anims.create({
            key: 'rightA',
            frames: this.anims.generateFrameNumbers('player', { start: 16, end: 17 }),
            frameRate: 5,
        });
        
        
        // Affichage du score d'argent
        
        this.add.image('score')
        this.scoreText = this.add.text(1210, 30, money, { fontSize: '50px', fill: '#fff' }).setScrollFactor(0);
        
        
        // Collisions
        
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.environment);
        this.ground.setCollisionByProperty({collides:true});
        this.environment.setCollisionByProperty({collides:true});
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.potions, this.collectPotion, null, this);
        this.physics.add.overlap(this.player, this.knife, this.collectKnife, null, this);
        this.physics.add.overlap(this.player, this.enemy, this.hitEnemy, null, this);
        
        
        // Tweens
        
        var move = this;

        this.enemy.children.iterate(function (child) {
            move.tweens.add({
                targets: child,
                x: child.x-50,
                ease: 'Linear',
                duration: 800,
                yoyo: true,
                repeat: -1
            });
        })
        
        
        // Animation barre de vie

        this.anims.create({
            key: 'alive',
            frames: [ { key: 'vie', frame: 0. } ],
        });

        this.anims.create({
            key: 'hurt',
            frames: [ { key: 'vie', frame: 1. } ],
        });

        this.anims.create({
            key: 'critical',
            frames: [ { key: 'vie', frame: 2. } ],
        });

        this.anims.create({
            key: 'dead',
            frames: [ { key: 'vie', frame: 3. } ],
        });
        
        
        // Caméras
        
        this.camera = this.cameras.main.setSize(1280,720);
        this.camera.startFollow(this.player, true, 0.08, 0.08);
        this.camera.setBounds(0, 0, 3200, 1600);
        
        
        // Sortie de zone
        
        this.environment.setTileLocationCallback(0, 38, 1, 5, ()=>{
            if(this.antiGlitch){
                this.antiGlitch = false;
                this.scene.start('scene2')}})
        this.antiGlitch = true;
        }
    
    
    // Update
    
    update(){
        
        
        // Inputs manette
    
        let pad = Phaser.Input.Gamepad.Gamepad;

        if(this.input.gamepad.total){
            pad = this.input.gamepad.getPad(0)
            xAxis = pad ? pad.axes[0].getValue() : 0;
            yAxis = pad ? pad.axes[1].getValue() : 0;
        }
        
        
        // Game over
        
        if (gameOver)
        {
            return;
        }
        
        
        // Animation déplacements
        
        if (this.cursors.left.isDown || pad.left == 1 || xAxis < 0)
        {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
            direction = "left";
        }
        else if (this.cursors.right.isDown || pad.right == 1 || xAxis > 0)
        {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
            direction = "right";
        }
        else if (this.cursors.up.isDown || pad.up == 1 || xAxis > 0)
        {
            this.player.setVelocityY(-160);

            this.player.anims.play('up', true);
            direction = "up";
        }
        else if (this.cursors.down.isDown || pad.down == 1 || xAxis > 0)
        {
            this.player.setVelocityY(160);

            this.player.anims.play('down', true);
            direction = "down";
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
        }  
        
        
        if (this.keySpace.isDown && direction == "down" && knife == true)
        {
            this.player.anims.play('downA', true);
        }
        
        if (this.keySpace.isDown && direction == "left" && knife == true)
        {
            this.player.anims.play('leftA', true);
        }
        
        if (this.keySpace.isDown && direction == "right" && knife == true)
        {
            this.player.anims.play('rightA', true);
        }
        
        
        // Barre de vie

        if(recovery == true)
        {
            timerRecovery = timerRecovery + 1
            if(timerRecovery >= 50)
            {
                recovery = false
                timerRecovery = 0
            }
        }
        
        
        // Perte de vie / mort
    
        if(vieJoueur == 3)
        {
            this.barreDeVie.anims.play('alive');
        }

        else if (vieJoueur == 2)
        {
            this.barreDeVie.anims.play('hurt');
        }

        else if (vieJoueur == 1)
        {
            this.barreDeVie.anims.play('critical');
        }

        else if (vieJoueur <= 0)
        {
            this.physics.pause();
            this.barreDeVie.anims.play('dead');
            this.player.destroy();
            gameOver = true;
        }
        
        
        // Score d'argent
        
        this.scoreText.setText(money);
    }
    
    
    // Collecte des pièces
    
    collectCoin(player, coin){
        coin.destroy();
        money += 1;
    }
    
    
    // Collecte des potions de vie
    
    collectPotion(player, health_potion){
        health_potion.destroy();
        vieJoueur += 1;
    }
    
    
    // Collecte de l'arme
    
    collectKnife(player, weapon){
        this.knife.destroy();
        knife = true;
    }
    
    
    // Collision ennemis
    
    hitEnemy (player, enemy){
        if (this.keySpace.isDown && knife)
        {
            this.coins.create(enemy.x, enemy.y, 'coin');
            enemy.destroy();
        }
        else if (vieJoueur > 0 && recovery == false)
        {
            vieJoueur = vieJoueur - 1;
            recovery = true;
        }
    }
}