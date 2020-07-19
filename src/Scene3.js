class Scene3 extends Phaser.Scene {

    constructor(redScore) {
        super("gameOver");
    }

    init(data) {
        this.redScore = data.redScore;
        this.blueScore = data.blueScore;
        this.greenScore = data.greenScore;
        this.yellowScore = data.yellowScore;
    }

    create() {
        this.add.text(20 * scaling_parameter, 20 * scaling_parameter, "GAME OVER", {
            font: "16px Arial",
            fill: "white"
        });

        var pointsTable = "RED: " + this.redScore + "\n";
        pointsTable += "BLUE: " + this.blueScore + "\n";
        pointsTable += "GREEN: " + this.greenScore + "\n";
        pointsTable += "YELLOW: " + this.yellowScore + "\n";
        this.add.text(20 * scaling_parameter, 40 * scaling_parameter, pointsTable);
    }

}