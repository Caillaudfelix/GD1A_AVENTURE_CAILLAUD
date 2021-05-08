class Scene2 extends Phaser.Scene {
    
    constructor(){
        super("scene2");
    }
    
    
    // Create
    
    create(){


        // Cartes

        this.map = this.make.tilemap({ key: 'end' });
        this.tileset = this.map.addTilesetImage('tilesets', 'tilesets');

        this.ground = this.map.createStaticLayer('ground', this.tileset, 0, 0);
        this.environment = this.map.createDynamicLayer('environment', this.tileset, 0, 0);


        // Inputs clavier

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        // Personnage

        this.player = this.physics.add.sprite(3150, 1310, 'player');


        // Ennemis

        this.enemy = this.physics.add.group();
        this.enemy.create(2400, 700, 'enemy4');
        this.enemy.create(2200, 950, 'enemy1');
        this.enemy.create(2200, 400, 'enemy2');
        this.enemy.create(2400, 250, 'enemy3');
        this.enemy.create(1800, 250, 'enemy2');
        this.enemy.create(1500, 150, 'enemy3');
        this.enemy.create(1400, 470, 'enemy4');
        this.enemy.create(1480, 700, 'enemy1');
        this.enemy.create(1000, 580, 'enemy2');


        // Interface

        this.barreDeVie = this.add.sprite(100, 50, 'vie').setScrollFactor(0,0);
        this.add.image(1170, 50, 'coin_score').setScrollFactor(0);


        // Items

        this.coins = this.physics.add.group();
        this.potions = this.physics.add.group();
        this.key = this.physics.add.image(840, 180, 'key');
            
        
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
        this.physics.add.overlap(this.player, this.key, this.finishLevel, null, this);
        
        
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
        
        
        // Caméras
        
        this.camera = this.cameras.main.setSize(1280,720);
        this.camera.startFollow(this.player, true, 0.08, 0.08);
        this.camera.setBounds(0, 0, 3200, 1600);
        
        
        // Sortie de zone

        this.environment.setTileLocationCallback(99, 38, 1, 5, ()=>{
            if(this.antiGlitch){
                this.antiGlitch = false;
                this.scene.start('scene1')}})
        this.antiGlitch = true;
        
        
        // Écran de victoire
    
        this.victory = this.add.image(820, 360, 'victory').setVisible(false);
    }


    // Update
    
    update(){
        
        
        // Game over
        
        if (gameOver)
        {
            return;
        }
        
        
        // Animation déplacements
        
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
            direction = "left";
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
            direction = "right";
        }
        else if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-160);

            this.player.anims.play('up', true);
            direction = "up";
        }
        else if (this.cursors.down.isDown)
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
        
        
        if (this.enemy.getLength() == 0){
            this.environment.removeTileAt(26, 10, true, true, 1);
            this.environment.removeTileAt(27, 10, true, true, 1);
        }
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
    
    
    // Finir le niveau
    
    finishLevel (player, key){
        this.player.disableBody(true, true);
        this.key.destroy();
        this.victory.visible = true;
    }
}


