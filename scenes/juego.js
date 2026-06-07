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
        this.ladders = this.physics.add.staticGroup(); // --- NUEVO GRUPO PARA ESCALERAS ---

        let framePiso = 1; 
        let framePlataforma = 2; 
        let frameEscalera = 5; // --- TILE DE ESCALERA ---

        // Suelo
        for (let i = 0; i < 32; i++) {
            this.platforms.create(i * 24 + 12, 216 - 12, 'bloque', framePiso); 
        }

        // Plataformas en el aire
        this.platforms.create(200, 150, 'bloque', framePlataforma);
        this.platforms.create(224, 150, 'bloque', framePlataforma);
        this.platforms.create(100, 100, 'bloque', framePlataforma);
        this.platforms.create(300, 80, 'bloque', framePlataforma);
        
        // --- CREAR UNA ESCALERA (Columna vertical) ---
        // La ubicamos en X=350, subiendo desde el piso hacia arriba
        for (let i = 0; i < 4; i++) {
            this.ladders.create(350, 180 - (i * 24), 'bloque', frameEscalera);
        }

        // Plataformas pantalla 2
        this.platforms.create(450, 140, 'bloque', framePlataforma);
        this.platforms.create(474, 140, 'bloque', framePlataforma);
        this.platforms.create(550, 100, 'bloque', framePlataforma);
        this.platforms.create(650, 130, 'bloque', framePlataforma);

        // Jugador
        this.player = this.physics.add.sprite(50, 100, 'personaje', 1);
        this.player.setBounce(0.1); 
        this.player.setCollideWorldBounds(true); 

        // Variable para controlar si el personaje está trepando
        this.isClimbing = false;

        // Cámara
        this.cameras.main.setBounds(0, 0, 768, 216);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Animaciones
        this.anims.create({ key: 'idle', frames: this.anims.generateFrameNumbers('personaje', { start: 0, end: 4 }), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'caminar', frames: this.anims.generateFrameNumbers('personaje', { start: 6, end: 10 }), frameRate: 12, repeat: -1 });
        this.anims.create({ key: 'saltar', frames: [ { key: 'personaje', frame: 6 } ], frameRate: 10 });
        
        // --- NUEVA ANIMACIÓN DE ESCALAR ---
        this.anims.create({
            key: 'escalar',
            frames: this.anims.generateFrameNumbers('personaje', { start: 12, end: 16 }),
            frameRate: 10,
            repeat: -1
        });

        // Colisiones
        this.physics.add.collider(this.player, this.platforms);

        // --- CONTROLES ---
        this.cursors = this.input.keyboard.createCursorKeys();
        // Asignamos la tecla Z para saltar
        this.teclaZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }

    update() {
        // --- 1. LÓGICA DE ESCALERAS ---
        // Chequeamos si el personaje se está superponiendo con alguna escalera
        let tocandoEscalera = false;
        this.physics.overlap(this.player, this.ladders, () => {
            tocandoEscalera = true;
        });

        // Si toca la escalera y presiona arriba o abajo, se "agarra"
        if (tocandoEscalera && (this.cursors.up.isDown || this.cursors.down.isDown)) {
            this.isClimbing = true;
        } else if (!tocandoEscalera) {
            this.isClimbing = false; // Se suelta si ya no toca el tile
        }

        // --- 2. FÍSICAS GENERALES ---
        if (this.isClimbing) {
            // Desactivamos la gravedad mientras trepa
            this.player.body.setAllowGravity(false);

            // Movimiento vertical en escalera
            if (this.cursors.up.isDown) {
                this.player.setVelocityY(-100);
            } else if (this.cursors.down.isDown) {
                this.player.setVelocityY(100);
            } else {
                this.player.setVelocityY(0); // Se queda colgado quieto
            }
        } else {
            // Restauramos la gravedad normal si no está en la escalera
            this.player.body.setAllowGravity(true);
        }

        // Movimiento horizontal (se puede mover hacia los lados incluso trepando para soltarse)
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

        // Salto: Ahora usa la tecla Z. (Permite saltar desde el suelo o desde la escalera)
        if (this.teclaZ.isDown && (this.player.body.touching.down || this.isClimbing)) {
            this.player.setVelocityY(-330);
            this.isClimbing = false; // Suelta la escalera al saltar
        }

        // --- 3. LÓGICA DE ANIMACIÓN (MÁQUINA DE ESTADOS) ---
        if (this.isClimbing) {
            this.player.anims.play('escalar', true);
            
            // Si está quieto en la escalera, pausamos el sprite para que no mueva pies y manos en el aire
            if (this.player.body.velocity.y === 0) {
                this.player.anims.pause();
            } else {
                this.player.anims.resume();
            }
        } 
        else {
            // Reanudamos las animaciones normales por si venían de estar pausadas
            this.player.anims.resume();

            if (!this.player.body.touching.down) {
                this.player.anims.play('saltar', true);
            } 
            else if (this.player.body.velocity.x !== 0) {
                this.player.anims.play('caminar', true);
            } 
            else {
                this.player.anims.play('idle', true);
            }
        }
    }
}