import Juego from "./scenes/juego.js";

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#87CEEB', // <--- AGREGAR ESTO (Celeste cielo clásico)
    scale: {
        width: 384,
        height: 216
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 600 },
            debug: false,
        },
    },
    render: {
        pixelArt: true,
        roundPixels: true 
    },
    scene: [Juego],
};

window.game = new Phaser.Game(config);