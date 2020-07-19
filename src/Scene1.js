class Scene1 extends Phaser.Scene {

    constructor() {
        super("bootGame");
    }

    preload() {
        this.load.image("carromboard", "./src/assets/carromboard.png");

        this.load.image("white", "./src/assets/White.svg");
        this.load.image("black", "./src/assets/Black.svg");
        this.load.image("pink", "./src/assets/Pink.svg");

        this.load.image("striker", "./src/assets/Striker.svg");

        this.load.image("score0", "./src/assets/Score0.png");
        this.load.image("score1", "./src/assets/Score1.png");
        
        this.load.image("corner", "./src/assets/Corner.svg");

        this.load.image("aim", "./src/assets/Aim.svg");

        this.load.image("phase", "./src/assets/Phase.png");

    }

    create() {
        this.add.text(20, 20, "Loading Game...", {
            font: "16px Arial",
            fill: "white"
        });
        this.scene.start("playGame");
    }

}