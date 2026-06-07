export default class Juego extends Phaser.Scene {
    constructor() {
        super("Juego"); 
    }

    preload() {
        this.load.spritesheet('bloque', 'assets/MapTileset.png', {
            frameWidth: 24,
            frameHeight: 24
        });
        
        this.load.spritesheet('personaje', 'assets/ExploradorSpritesheet.png', { 
            frameWidth: 24, 
            frameHeight: 24 
        });
    }

    create() {
        this.platforms = this.physics.add.staticGroup();

        let framePiso = 1; 
        let framePlataforma = 2; 

        // Suelo
        for (let i = 0; i < 16; i++) {
            this.platforms.create(i * 24 + 12, 216 - 12, 'bloque', framePiso); 
        }

        // Plataformas en el aire
        this.platforms.create(200, 150, 'bloque', framePlataforma);
        this.platforms.create(224, 150, 'bloque', framePlataforma);
        this.platforms.create(100, 100, 'bloque', framePlataforma);
        this.platforms.create(300, 80, 'bloque', framePlataforma);

        // Jugador
        // Inicia en el frame 1 (el primero del idle según tu spritesheet)
        this.player = this.physics.add.sprite(50, 100, 'personaje', 1);
        this.player.setBounce(0.1); 
        this.player.setCollideWorldBounds(true); 

        // --- CREACIÓN DE ANIMACIONES ---
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('personaje', { start: 0, end: 4 }),
            frameRate: 8, // 8 frames por segundo suele quedar bien para idle
            repeat: -1    // -1 indica que loopea infinitamente
        });

        this.anims.create({
            key: 'caminar',
            frames: this.anims.generateFrameNumbers('personaje', { start: 6, end: 10 }),
            frameRate: 12, // Un poco más rápido para dar sensación de movimiento
            repeat: -1
        });

        this.anims.create({
            key: 'saltar',
            frames: [ { key: 'personaje', frame: 6 } ], // Solo el frame 7
            frameRate: 10
        });

        // Colisiones
        this.physics.add.collider(this.player, this.platforms);

        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // 1. LÓGICA DE MOVIMIENTO (FÍSICA)
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

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }

        // 2. LÓGICA DE ANIMACIÓN (MÁQUINA DE ESTADOS)
        // El true al final de play() ignora la orden si la animación ya se está reproduciendo
        if (!this.player.body.touching.down) {
            // Si NO está tocando el suelo, está saltando o cayendo
            this.player.anims.play('saltar', true);
        } 
        else if (this.player.body.velocity.x !== 0) {
            // Si está en el suelo y moviéndose horizontalmente
            this.player.anims.play('caminar', true);
        } 
        else {
            // Si está en el suelo y quieto
            this.player.anims.play('idle', true);
        }
    }
}