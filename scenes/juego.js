export default class Juego extends Phaser.Scene {
    constructor() {
        super("Juego"); 
    }

    preload() {
        this.load.spritesheet('bloque', 'assets/MapTileset.png', { frameWidth: 24, frameHeight: 24 });
        this.load.spritesheet('personaje', 'assets/ExploradorSpritesheet.png', { frameWidth: 24, frameHeight: 24 });
        this.load.spritesheet('vibora', 'assets/SnakeSpriteSheet.png', { frameWidth: 24, frameHeight: 24 });
        this.load.spritesheet('murcielago', 'assets/BatSpriteSheet.png', { frameWidth: 24, frameHeight: 24 });

        this.load.audio('musica', 'assets/Musica.mp3');
        this.load.audio('coin1', 'assets/Coin001.mp3');
        this.load.audio('coin2', 'assets/Coin002.mp3');
        this.load.audio('coin3', 'assets/Coin003.mp3');
        this.load.audio('stun', 'assets/Stun.mp3');
        this.load.audio('fall', 'assets/Fall.mp3');
        
        // --- NUEVO: PRELOAD DE VICTORIA ---
        this.load.audio('victory', 'assets/Victory.mp3');
    }

    create() {
        this.sound.stopAll(); 
        this.musicaFondo = this.sound.add('musica', { loop: true, volume: 0.4 });
        this.musicaFondo.play();

        this.physics.world.setBounds(0, 0, 768, 216);

        this.platforms = this.physics.add.staticGroup();
        this.ladders = this.physics.add.staticGroup();
        this.jewels = this.physics.add.staticGroup(); 
        this.enemies = this.physics.add.group();

        this.anims.create({ key: 'vibora_caminar', frames: this.anims.generateFrameNumbers('vibora', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'murcielago_volar', frames: this.anims.generateFrameNumbers('murcielago', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'morir', frames: this.anims.generateFrameNumbers('personaje', { start: 18, end: 21 }), frameRate: 10, repeat: -1 });

        const nivel = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,1], 
            [1,0,0,1,1,1,1,1,5,0,0,0,1,1,1,0,0,0,0,1,1,1,1,1,5,0,0,1,1,1,1,1], 
            [1,0,0,0,0,0,0,0,5,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,5,0,2,0,0,0,0,1], 
            [1,1,1,1,1,0,0,0,5,1,1,1,1,1,1,1,1,1,5,1,1,1,0,0,5,1,1,1,1,0,0,1],
            [1,0,0,0,0,0,0,0,5,0,0,0,0,0,3,0,0,0,5,0,2,0,0,0,5,0,0,0,0,0,0,1], 
            [1,0,0,0,0,1,1,1,5,1,1,1,0,0,0,0,0,0,5,1,1,1,1,1,1,1,1,1,1,1,1,1], 
            [1,0,0,0,0,0,0,0,5,0,0,2,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1], 
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];

        this.nivelMatriz = nivel;

        for (let y = 0; y < nivel.length; y++) {
            for (let x = 0; x < nivel[y].length; x++) {
                let tile = nivel[y][x];
                let px = x * 24 + 12;
                let py = y * 24 + 12;

                if (tile === 0) {
                    let esZonaSegura = (x >= 1 && x <= 2 && y >= 5 && y <= 6);
                    if (!esZonaSegura) tile = Phaser.Math.RND.pick([6, 7, 8]);
                }

                this.add.image(px, py, 'bloque', 0); 

                if (tile === 1) this.platforms.create(px, py, 'bloque', 1);
                else if (tile === 5) this.ladders.create(px, py, 'bloque', 5);
                else if (tile === 6 || tile === 7 || tile === 8) {
                    let joya = this.jewels.create(px, py, 'bloque', tile);
                    joya.tipoJoya = tile; 
                }
                else if (tile === 10) {
                    this.salida = this.physics.add.staticImage(px, py, 'bloque', 10);
                    this.puertaAbierta = false; 
                }
                else if (tile === 2 || tile === 3) {
                    let joyaTipo = Phaser.Math.RND.pick([6, 7, 8]);
                    let joya = this.jewels.create(px, py, 'bloque', joyaTipo);
                    joya.tipoJoya = joyaTipo;

                    let spriteEnemigo = (tile === 2) ? 'vibora' : 'murcielago';
                    let enemigo = this.enemies.create(px, py, spriteEnemigo);
                    
                    enemigo.setDepth(10);
                    enemigo.body.setSize(12, 12);

                    if (tile === 2) {
                        enemigo.tipo = 'vibora';
                        enemigo.body.setOffset(6, 12); 
                        enemigo.setVelocityX(-40); 
                        enemigo.play('vibora_caminar', true);
                    } else if (tile === 3) {
                        enemigo.tipo = 'murcielago';
                        enemigo.body.setOffset(6, 6); 
                        enemigo.body.setAllowGravity(false); 
                        enemigo.setVelocityY(-40); 
                        enemigo.setBounce(1); 
                        enemigo.play('murcielago_volar', true);
                    }
                }
            }
        }

        this.puntaje = 0;
        this.combo = 1;
        this.vidas = 3;
        this.comboTimer = null; 
        
        // Estados del jugador
        this.isDead = false;
        this.isWinning = false; // --- ESTADO DE VICTORIA ---
        
        this.joyasRecolectadas = 0;

        // HUD
        this.add.rectangle(0, 0, 384, 24, 0x000000).setOrigin(0, 0).setScrollFactor(0).setDepth(100);
        const estiloTexto = { fontFamily: '"Press Start 2P"', fontSize: '8px', fill: '#ffffff', padding: { top: 4, bottom: 4 }, resolution: 3 };
        this.puntajeText = this.add.text(12, 4, 'PTS: 0', estiloTexto).setScrollFactor(0).setDepth(101);
        this.comboText = this.add.text(192, 4, 'COMBO: x1', { ...estiloTexto, fill: '#ffd700' }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(101);
        
        this.vidasIcons = [];
        for (let i = 0; i < this.vidas; i++) {
            let icon = this.add.image(320 + (i * 20), 12, 'personaje', 0).setScrollFactor(0).setDepth(101);
            this.vidasIcons.push(icon);
        }

        // Jugador
        this.player = this.physics.add.sprite(50, 160, 'personaje', 1);
        this.player.setBounce(0.1); 
        this.player.setCollideWorldBounds(true); 
        this.player.body.setSize(14, 18);
        this.player.body.setOffset(5, 6);
        this.player.setDepth(15);
        this.isClimbing = false;

        this.cameras.main.setBounds(0, 0, 768, 216);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        this.anims.create({ key: 'idle', frames: this.anims.generateFrameNumbers('personaje', { start: 0, end: 4 }), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'caminar', frames: this.anims.generateFrameNumbers('personaje', { start: 6, end: 10 }), frameRate: 12, repeat: -1 });
        this.anims.create({ key: 'saltar', frames: [ { key: 'personaje', frame: 6 } ], frameRate: 10 });
        this.anims.create({ key: 'escalar', frames: this.anims.generateFrameNumbers('personaje', { start: 12, end: 16 }), frameRate: 10, repeat: -1 });

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms); 
        this.physics.add.overlap(this.player, this.jewels, this.recolectarJoya, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.golpeEnemigo, null, this);
        
        // --- LÓGICA DE VICTORIA ---
        this.physics.add.overlap(this.player, this.salida, () => {
            if (this.puertaAbierta && !this.isWinning) {
                this.isWinning = true; 
                console.log("¡Nivel Completado!");
                
                // 1. Detenemos las físicas del jugador para que no siga cayendo o caminando
                this.physics.pause();
                this.player.anims.play('idle', true);
                
                // 2. Paramos la música de nivel y ponemos la de victoria
                this.sound.stopAll();
                this.sound.play('victory', { volume: 0.8 });

                // 3. Esperamos 4 segundos (4000ms) antes de reiniciar para que se escuche la música
                this.time.delayedCall(4000, () => {
                    this.scene.restart(); 
                });
            }
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.teclaZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }

    recolectarJoya(player, joya) {
        if (this.isDead || this.isWinning) return; 

        joya.destroy();
        this.puntaje += 50 * this.combo;
        this.joyasRecolectadas++;
        
        if (this.joyasRecolectadas >= 5 && !this.puertaAbierta) {
            this.puertaAbierta = true;
            this.salida.setFrame(9); 
            console.log("¡Puerta Abierta!");
        }

        if (joya.tipoJoya === 8) {
            this.combo += 1;
            this.sound.play('coin1', { volume: 0.6 });
        }
        else if (joya.tipoJoya === 7) {
            this.combo += 2;
            this.sound.play('coin2', { volume: 0.6 });
        }
        else if (joya.tipoJoya === 6) {
            this.combo += 3;
            this.sound.play('coin3', { volume: 0.6 });
        }

        this.puntajeText.setText('PTS: ' + this.puntaje);
        this.comboText.setText('COMBO: x' + this.combo);

        if (this.comboTimer) this.comboTimer.remove(); 

        this.comboTimer = this.time.delayedCall(1500, () => {
            this.combo = 1; 
            this.comboText.setText('COMBO: x1');
        }, [], this);
    }

    golpeEnemigo(player, enemigo) {
        if (this.isDead || this.isWinning) return;
        this.isDead = true;

        this.sound.play('stun', { volume: 0.8 });
        this.time.delayedCall(300, () => {
            this.sound.play('fall', { volume: 0.8 });
        });

        this.vidas--;
        if (this.vidasIcons[this.vidas]) {
            this.vidasIcons[this.vidas].setVisible(false);
        }

        this.player.anims.play('morir', true);
        this.player.setVelocityX(0);
        this.player.setVelocityY(-250); 
        this.player.setCollideWorldBounds(false); 
        this.player.body.checkCollision.none = true; 
    }

    respawn() {
        if (this.vidas > 0) {
            this.isDead = false;
            this.player.body.checkCollision.none = false;
            this.player.setCollideWorldBounds(true);
            this.player.setPosition(50, 160);
            this.player.setVelocity(0);
            this.player.anims.play('idle', true);
            this.combo = 1;
            this.comboText.setText('COMBO: x1');
        } else {
            console.log("GAME OVER");
            this.scene.restart();
        }
    }

    update() {
        // --- BLOQUEAR CONTROLES Y UPDATE SI ESTÁ MURIENDO O GANANDO ---
        if (this.isDead) {
            if (this.player.y > 250) this.respawn();
            return; 
        }
        if (this.isWinning) return;

        this.enemies.children.iterate((enemigo) => {
            if (!enemigo) return;
            
            if (enemigo.tipo === 'vibora') {
                let velX = enemigo.body.velocity.x;
                let dirX = Math.sign(velX) || -1; 
                
                enemigo.setFlipX(dirX < 0);
                
                let pxFrente = enemigo.body.center.x + (dirX * 10);
                let pyAbajo = enemigo.body.bottom + 10;
                
                let colFrente = Math.floor(pxFrente / 24);
                let filaAbajo = Math.floor(pyAbajo / 24);

                let noHayPisoAdelante = (this.nivelMatriz[filaAbajo] && this.nivelMatriz[filaAbajo][colFrente] !== 1);
                
                if (enemigo.body.blocked.right || enemigo.body.blocked.left || noHayPisoAdelante) {
                    enemigo.setVelocityX(velX * -1);
                }
            } 
        });

        let tocandoEscalera = false;
        let debidamenteAdentro = false;

        this.physics.overlap(this.player, this.ladders, (player, ladder) => {
            tocandoEscalera = true;
            if (player.body.bottom > (ladder.y - 12 + 6)) debidamenteAdentro = true;
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