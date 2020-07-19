// scaling_parameter = Math.min(Math.min(window.innerWidth / 420, window.innerHeight / 300), 1);
scaling_parameter = 2;

var config = {
    width: scaling_parameter * 421,
    height: scaling_parameter * 301,
    backgroundColor: 0x000000,
    scene: [Scene1, Scene2],
    // scene: [Scene1, Scene2, Scene3],
    physics: {
    	default: "arcade",
    	arcade: {
    		debug: false
    	}
    }
}

window.onload = function() {
    var game = new Phaser.Game(config);
}