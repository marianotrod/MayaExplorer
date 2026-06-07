export default class Juego extends Phaser.Scene {
    constructor() {
        super("Juego"); 
    }

    preload() {
        this.load.spritesheet('bloque', 'assets/MapTileset.png', { frameWidth: 24, frameHeight: 24 });
        this.load.spritesheet('personaje', 'assets/ExploradorSpritesheet.png', { frameWidth: 24, frameHeight: 24 });
    }

    create() {
        this.physics.world.setBounds(0, 0, 768, 216);

        this.platforms = this.physics.add.staticGroup();
        this.ladders = this.physics.add.staticGroup();
        this.jewels = this.physics.add.staticGroup(); 

        const nivel = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,1], 
            [1,0,0,1,1,1,1,1,5,0,0,0,1,1,1,0,0,0,0,1,1,1,1,1,5,0,0,1,1,1,1,1], 
            [1,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,1],
            [1,1,1,1,1,0,0,0,5,1,1,1,1,1,1,1,1,1,5,1,1,1,0,0,5,1,1,1,1,0,0,1],
            [1,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,5,0,0,0,0,0,0,1],
            [1,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,5,0,0,0,0,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];

        for (let y = 0; y < nivel.length; y++) {
            for (let x = 0; x < nivel[y].length; x++) {
                let tile = nivel[y][x];
                let px = x * 24 + 12;
                let py = y * 24 + 12;

                if (tile === 0) {
                    let esZonaSegura = (x >= 1 && x <= 2 && y >= 5 && y <= 6);
                    if (!esZonaSegura) {
                        tile = Phaser.Math.RND.pick([6, 7, 8]);
                    }
                }

                this.add.image(px, py, 'bloque', 0); 

                if (tile === 1) this.platforms.create(px, py, 'bloque', 1);
                else if (tile === 5) this.ladders.create(px, py, 'bloque', 5);
                else if (tile === 6 || tile === 7 || tile === 8) {
                    let joya = this.jewels.create(px, py, 'bloque', tile);
                    joya.tipoJoya = tile; 
                }
                else if (tile === 9) this.salida = this.physics.add.staticImage(px, py, 'bloque', 9);
            }
        }

        this.puntaje = 0;
        this.combo = 1;
        this.vidas = 3;
        this.comboTimer = null; 

        // HUD - Banda negra
        this.add.rectangle(0, 0, 384, 24, 0x000000).setOrigin(0, 0).setScrollFactor(0).setDepth(100);

        // --- SOLUCIÓN DE NITIDEZ ---
        // resolution: 2 (o 3) hace que el texto se dibuje internamente en alta calidad antes de escalarse
        const estiloTexto = { 
            fontFamily: '"Press Start 2P"', 
            fontSize: '8px', 
            fill: '#ffffff', 
            padding: { top: 4, bottom: 4 },
            resolution: 3 
        };

        // --- CENTRADO CON NÚMEROS ENTEROS ---
        // Si la barra mide 24 y el texto+padding mide 16, el centro exacto es Y = 4.
        
        // Puntos: Sin origin en Y (por defecto es 0)
        this.puntajeText = this.add.text(12, 4, 'PTS: 0', estiloTexto).setScrollFactor(0).setDepth(101);
        
        // Combo: Centramos solo en X (0.5), el Y queda en 0. Posición Y = 4.
        this.comboText = this.add.text(192, 4, 'COMBO: x1', { ...estiloTexto, fill: '#ffd700' })
            .setOrigin(0.5, 0) 
            .setScrollFactor(0)
            .setDepth(101);
        
        // Vidas: Las imágenes nacen con Origin en el centro, así que Y = 12 sigue siendo exacto.
        this.vidasIcons = [];
        for (let i = 0; i < this.vidas; i++) {
            let icon = this.add.image(320 + (i * 20), 12, 'personaje', 0)
                .setScrollFactor(0)
                .setDepth(101);
            this.vidasIcons.push(icon);
        }

        // Jugador
        this.player = this.physics.add.sprite(50, 160, 'personaje', 1);
        this.player.setBounce(0.1); 
        this.player.setCollideWorldBounds(true); 
        this.player.body.setSize(14, 18);
        this.player.body.setOffset(5, 6);

        this.isClimbing = false;

        this.cameras.main.setBounds(0, 0, 768, 216);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        this.anims.create({ key: 'idle', frames: this.anims.generateFrameNumbers('personaje', { start: 0, end: 4 }), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'caminar', frames: this.anims.generateFrameNumbers('personaje', { start: 6, end: 10 }), frameRate: 12, repeat: -1 });
        this.anims.create({ key: 'saltar', frames: [ { key: 'personaje', frame: 6 } ], frameRate: 10 });
        this.anims.create({ key: 'escalar', frames: this.anims.generateFrameNumbers('personaje', { start: 12, end: 16 }), frameRate: 10, repeat: -1 });

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.jewels, this.recolectarJoya, null, this);
        
        this.physics.add.overlap(this.player, this.salida, () => {
            console.log("¡Nivel Completado! Puntaje final: " + this.puntaje);
            this.scene.restart(); 
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.teclaZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }

    recolectarJoya(player, joya) {
        joya.destroy();
        this.puntaje += 50 * this.combo;

        if (joya.tipoJoya === 8) this.combo += 1;
        else if (joya.tipoJoya === 7) this.combo += 2;
        else if (joya.tipoJoya === 6) this.combo += 3;

        this.puntajeText.setText('PTS: ' + this.puntaje);
        this.comboText.setText('COMBO: x' + this.combo);

        if (this.comboTimer) this.comboTimer.remove(); 

        this.comboTimer = this.time.delayedCall(1500, () => {
            this.combo = 1; 
            this.comboText.setText('COMBO: x1');
        }, [], this);
    }

    update() {
        let tocandoEscalera = false;
        let debidamenteAdentro = false;

        this.physics.overlap(this.player, this.ladders, (player, ladder) => {
            tocandoEscalera = true;
            if (player.body.bottom > (ladder.y - 12 + 6)) {
                debidamenteAdentro = true;
            }
        });

        if (tocandoEscalera) {
            if (this.cursors.up.isDown || this.cursors.down.isDown) this.isClimbing = true;
            else if (this.player.body.velocity.y > 0 && debidamenteAdentro) this.isClimbing = true;
        } else {
            this.isClimbing = false; 
        }

        if (this.isClimbing) {
            this.player.body.setAllowGravity(false);
            if (this.cursors.up.isDown) this.player.setVelocityY(-100);
            else if (this.cursors.down.isDown) this.player.setVelocityY(100);
            else this.player.setVelocityY(0); 
        } else {
            this.player.body.setAllowGravity(true);
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.setFlipX(true); 
        } 
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.setFlipX(false);
        } 
        else {
            this.player.setVelocityX(0); 
        }

        if (this.teclaZ.isDown && (this.player.body.touching.down || this.isClimbing)) {
            this.player.setVelocityY(-250); 
            this.isClimbing = false; 
        }

        if (this.isClimbing) {
            this.player.anims.play('escalar', true);
            if (this.player.body.velocity.y === 0) this.player.anims.pause();
            else this.player.anims.resume();
        } 
        else {
            this.player.anims.resume();
            if (!this.player.body.touching.down) this.player.anims.play('saltar', true);
            else if (this.player.body.velocity.x !== 0) this.player.anims.play('caminar', true);
            else this.player.anims.play('idle', true);
        }
    }
}