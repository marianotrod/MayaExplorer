export default class Juego extends Phaser.Scene {
    constructor() {
        super("Juego"); 
    }

    init(data) {
        this.nivelActual = data.nivel || 1;
        this.puntaje = data.puntaje || 0;
        this.vidas = data.vidas !== undefined ? data.vidas : 3;
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
        this.load.audio('victory', 'assets/Victory.mp3');
        this.load.audio('winAll', 'assets/WinAll.mp3');
        this.load.audio('lose', 'assets/Lose.mp3');
    }

    obtenerMatrizNivel(nivel) {
        if (nivel === 1) { 
            return [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,10,1],
                [1,0,0,1,1,1,1,1,5,0,0,0,1,1,1,1],
                [1,0,0,0,0,0,0,0,5,0,0,0,0,0,0,1],
                [1,1,1,1,1,0,0,0,5,1,1,1,1,0,0,1],
                [1,0,0,0,0,0,0,0,5,0,0,0,0,0,0,1],
                [1,0,0,0,0,1,1,1,5,1,1,1,0,0,0,1],
                [1,0,0,0,0,0,0,0,5,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
            ];
        } else if (nivel === 2) { 
            return [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,10,1],
                [1,0,0,1,1,1,1,1,5,0,0,0,1,1,1,1],
                [1,0,0,0,0,0,0,0,5,0,0,2,0,0,0,1],
                [1,1,1,1,1,0,0,0,5,1,1,1,1,0,0,1],
                [1,0,0,0,0,0,0,0,5,0,2,0,0,0,0,1],
                [1,0,0,0,0,1,1,1,5,1,1,1,0,0,0,1],
                [1,0,0,0,0,0,0,0,5,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
            ];
        } else if (nivel === 3) { 
            return [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,1], 
                [1,0,0,1,1,1,1,1,5,0,0,0,1,1,1,0,0,0,0,1,1,1,1,1,5,0,0,1,1,1,1,1], 
                [1,0,0,0,0,0,0,0,5,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,5,0,2,0,0,0,0,1], 
                [1,1,1,1,1,0,3,0,5,1,1,1,1,1,1,1,1,1,5,1,1,1,0,0,5,1,1,1,1,0,0,1],
                [1,0,0,0,0,0,0,0,5,0,0,0,0,0,3,0,0,0,5,0,2,0,0,0,5,0,0,0,0,0,0,1], 
                [1,0,0,0,0,1,1,1,5,1,1,1,0,0,0,0,0,0,5,0,0,1,1,1,1,1,1,1,1,1,1,1], 
                [1,0,0,0,0,0,0,0,5,0,0,2,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1], 
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
            ];
        } else if (nivel === 4) { 
            return [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,1], 
                [1,0,0,1,1,1,1,1,5,0,0,0,1,1,1,0,0,0,0,1,1,1,1,1,5,0,0,1,1,1,1,1], 
                [1,0,0,0,0,0,0,2,5,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,5,0,0,0,0,0,0,1], 
                [1,1,1,1,1,0,0,0,5,1,1,1,1,1,1,1,1,1,5,1,1,1,3,0,5,1,1,1,1,0,0,1],
                [1,0,0,0,0,0,0,0,5,0,0,2,0,0,0,0,0,0,5,0,0,0,0,0,5,0,2,0,0,0,0,1], 
                [1,0,0,0,0,1,1,1,5,1,1,1,0,0,0,0,0,0,5,0,0,1,1,1,1,1,1,1,1,1,1,1], 
                [1,0,0,0,0,0,0,0,5,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1], 
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
            ];
        } else { 
            return [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,1], 
                [1,0,0,1,1,1,1,1,5,0,0,0,1,1,1,0,0,0,0,1,1,1,1,1,5,0,0,1,1,1,1,1], 
                [1,0,0,0,0,0,0,0,5,0,0,2,0,0,0,0,0,0,0,0,0,2,0,0,5,0,0,0,0,0,0,1], 
                [1,1,1,1,1,0,0,0,5,1,1,1,1,1,1,1,1,1,5,1,1,1,0,0,5,1,1,1,1,0,0,1],
                [1,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,5,0,2,0,0,0,0,1], 
                [1,0,0,0,0,1,1,1,5,1,1,1,0,0,0,0,0,0,5,1,1,1,1,1,1,1,1,1,1,1,1,1], 
                [1,0,0,0,0,0,0,0,5,0,0,2,0,0,1,1,1,1,1,0,0,0,2,0,0,0,0,0,0,0,0,1], 
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
            ];
        }
    }

    create() {
        this.sound.stopAll(); 
        this.musicaFondo = this.sound.add('musica', { loop: true, volume: 0.4 });
        this.musicaFondo.play();

        this.nivelMatriz = this.obtenerMatrizNivel(this.nivelActual);
        let anchoMundo = this.nivelMatriz[0].length * 24;
        
        this.physics.world.setBounds(0, 0, anchoMundo, 216);

        this.platforms = this.physics.add.staticGroup();
        this.ladders = this.physics.add.staticGroup();
        this.jewels = this.physics.add.staticGroup(); 
        this.enemies = this.physics.add.group();

        this.anims.create({ key: 'vibora_caminar', frames: this.anims.generateFrameNumbers('vibora', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'murcielago_volar', frames: this.anims.generateFrameNumbers('murcielago', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'morir', frames: this.anims.generateFrameNumbers('personaje', { start: 18, end: 21 }), frameRate: 10, repeat: -1 });

        // --- AGREGADO: INSTRUCCIONES NIVEL 1 ---
        if (this.nivelActual === 1) {
            this.add.text(192, 140, 'FLECHAS PARA MOVERSE\nZ PARA SALTAR', { 
                fontFamily: '"Press Start 2P"', 
                fontSize: '8px', 
                fill: '#ffffff', 
                align: 'center' 
            }).setOrigin(0.5).setDepth(101);
        }

        for (let y = 0; y < this.nivelMatriz.length; y++) {
            for (let x = 0; x < this.nivelMatriz[y].length; x++) {
                let tile = this.nivelMatriz[y][x];
                let px = x * 24 + 12;
                let py = y * 24 + 12;

                if (tile === 0) {
                    let esZonaSegura = (x >= 1 && x <= 2 && y >= 5 && y <= 6);
                    if (!esZonaSegura) tile = Phaser.Math.RND.pick([6, 7, 8]);
                }

                this.add.image(px, py, 'bloque', 0); 

                if (tile === 1) {
                    let bloque = this.platforms.create(px, py, 'bloque', 1);
                    if (y > 0 && this.nivelMatriz[y-1][x] === 1) bloque.body.checkCollision.up = false;
                    if (y < this.nivelMatriz.length - 1 && this.nivelMatriz[y+1][x] === 1) bloque.body.checkCollision.down = false;
                    if (x > 0 && this.nivelMatriz[y][x-1] === 1) bloque.body.checkCollision.left = false;
                    if (x < this.nivelMatriz[y].length - 1 && this.nivelMatriz[y][x+1] === 1) bloque.body.checkCollision.right = false;
                }
                else if (tile === 5) {
                    this.ladders.create(px, py, 'bloque', 5);
                    let pisoEscalera = this.platforms.create(px, py, 'bloque', 5);
                    pisoEscalera.setVisible(false); 
                    pisoEscalera.body.checkCollision.down = false;
                    pisoEscalera.body.checkCollision.left = false;
                    pisoEscalera.body.checkCollision.right = false;
                    pisoEscalera.esEscalera = true; 
                }
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

        this.combo = 1;
        this.comboTimer = null; 
        this.isDead = false;
        this.isWinning = false; 
        this.juegoTerminado = false; 
        this.joyasRecolectadas = 0;

        // HUD
        this.add.rectangle(0, 0, 384, 24, 0x000000).setOrigin(0, 0).setScrollFactor(0).setDepth(100);
        const estiloTexto = { fontFamily: '"Press Start 2P"', fontSize: '8px', fill: '#ffffff', padding: { top: 4, bottom: 4 }, resolution: 3 };
        
        this.add.text(192, 24, 'NIVEL ' + this.nivelActual, { ...estiloTexto, fill: '#aaaaaa' }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(101);
        this.puntajeText = this.add.text(12, 4, 'PTS: ' + this.puntaje, estiloTexto).setScrollFactor(0).setDepth(101);
        this.comboText = this.add.text(192, 4, 'COMBO: x1', { ...estiloTexto, fill: '#ffd700' }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(101);
        
        this.vidasIcons = [];
        for (let i = 0; i < this.vidas; i++) {
            let icon = this.add.image(320 + (i * 20), 12, 'personaje', 0).setScrollFactor(0).setDepth(101);
            this.vidasIcons.push(icon);
        }

        this.player = this.physics.add.sprite(50, 160, 'personaje', 1);
        this.player.setBounce(0.1); 
        this.player.setCollideWorldBounds(true); 
        this.player.body.setSize(14, 18);
        this.player.body.setOffset(5, 6);
        this.player.setDepth(15);
        this.isClimbing = false;

        this.cameras.main.setBounds(0, 0, anchoMundo, 216);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        this.physics.add.collider(this.player, this.platforms, null, (player, platform) => {
            if (platform.esEscalera) {
                if (this.cursors.up.isDown || this.cursors.down.isDown || this.isClimbing) return false;
            }
            return true; 
        }, this);

        this.physics.add.collider(this.enemies, this.platforms); 
        this.physics.add.overlap(this.player, this.jewels, this.recolectarJoya, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.golpeEnemigo, null, this);
        
        this.physics.add.overlap(this.player, this.salida, () => {
            if (this.puertaAbierta && !this.isWinning && !this.juegoTerminado) {
                this.isWinning = true; 
                this.physics.pause();
                this.player.anims.play('idle', true);
                this.sound.stopAll();

                if (this.nivelActual < 5) {
                    this.sound.play('victory', { volume: 0.8 });
                    this.time.delayedCall(3000, () => {
                        this.scene.start('Juego', { nivel: this.nivelActual + 1, puntaje: this.puntaje, vidas: this.vidas });
                    });
                } else {
                    this.juegoTerminado = true;
                    this.sound.play('winAll', { volume: 0.8 });
                    this.mostrarPantallaFinal("¡GANASTE EL JUEGO!", "#00ff00");
                }
            }
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.teclaZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }

    recolectarJoya(player, joya) {
        if (this.isDead || this.isWinning || this.juegoTerminado) return; 

        joya.destroy();
        this.puntaje += 50 * this.combo;
        this.joyasRecolectadas++;
        
        if (this.joyasRecolectadas >= 5 && !this.puertaAbierta) {
            this.puertaAbierta = true;
            this.salida.setFrame(9); 
        }

        if (joya.tipoJoya === 8) {
            this.combo += 1;
            this.sound.play('coin1', { volume: 0.6 });
        } else if (joya.tipoJoya === 7) {
            this.combo += 2;
            this.sound.play('coin2', { volume: 0.6 });
        } else if (joya.tipoJoya === 6) {
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
        if (this.isDead || this.isWinning || this.juegoTerminado) return;
        this.isDead = true;

        this.sound.play('stun', { volume: 0.8 });
        this.time.delayedCall(300, () => {
            if (this.vidas > 0) this.sound.play('fall', { volume: 0.8 });
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
            this.juegoTerminado = true;
            this.physics.pause();
            this.sound.stopAll();
            this.sound.play('lose', { volume: 0.8 });
            this.mostrarPantallaFinal("GAME OVER", "#ff0000");
        }
    }

    mostrarPantallaFinal(titulo, colorTitulo) {
        let caja = this.add.rectangle(192, 108, 240, 120, 0x000000)
            .setScrollFactor(0)
            .setDepth(200);
        
        caja.setStrokeStyle(2, 0xffffffff);

        const estiloTitulo = { fontFamily: '"Press Start 2P"', fontSize: '12px', fill: colorTitulo, resolution: 3 };
        const estiloTexto = { fontFamily: '"Press Start 2P"', fontSize: '8px', fill: '#ffffff', resolution: 3 };

        this.add.text(192, 75, titulo, estiloTitulo).setOrigin(0.5).setScrollFactor(0).setDepth(201);
        this.add.text(192, 105, 'PTS: ' + this.puntaje, estiloTexto).setOrigin(0.5).setScrollFactor(0).setDepth(201);
        this.add.text(192, 135, 'Presiona Z para reiniciar', { ...estiloTexto, fill: '#888888' }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
    }

    update() {
        if (this.juegoTerminado) {
            if (Phaser.Input.Keyboard.JustDown(this.teclaZ)) {
                this.scene.start('Juego', { nivel: 1, puntaje: 0, vidas: 3 });
            }
            return;
        }

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
        this.physics.overlap(this.player, this.ladders, () => {
            tocandoEscalera = true;
        });

        if (tocandoEscalera) {
            if (this.cursors.up.isDown || this.cursors.down.isDown) this.isClimbing = true;
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

        if (Phaser.Input.Keyboard.JustDown(this.teclaZ) && (this.player.body.blocked.down || this.isClimbing)) {
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
            if (!this.player.body.blocked.down) this.player.anims.play('saltar', true);
            else if (this.player.body.velocity.x !== 0) this.player.anims.play('caminar', true);
            else this.player.anims.play('idle', true);
        }
    }
}