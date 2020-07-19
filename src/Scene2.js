class Scene2 extends Phaser.Scene {

    /********************************************************
                         CONSTRUCTOR 
    ********************************************************/
    constructor() {
        super("playGame");
        
        this.turn = "bottom";       // bottom, top
        this.gamephase = "set";         // set, aim, power, shoot?
        this.repeat_turn = false;

        this.whiteScore = 0;
        this.blackScore = 0;

        this.whitePotted = [];
        this.blackPotted = [];
        this.put_at_center = [];

        this.striker_dir = 1;
        this.striker_ready = true;

        this.rotate_dir = 1;
        this.move_aim = true;

        this.power = 800;
        this.all_stopped = true;

        this.prev_turn_pink = false;
        this.pinkPotted = "none";
    }

    /********************************************************
                         CREATE
    ********************************************************/
    create() {
        this.layout();
        this.set_pieces();
        this.add_physics();
        this.set_gameplay();
        this.makeinteractive();
    }

    layout() {
        this.carromboard = this.add.image(0, 0, "carromboard").setScale(scaling_parameter);
        this.carromboard.setOrigin(0, 0);

        this.corner_topleft = this.add.image(25 * scaling_parameter, 25 * scaling_parameter, "corner").setScale(scaling_parameter*0.5);
        this.corner_topright = this.add.image(275 * scaling_parameter, 25 * scaling_parameter, "corner").setScale(scaling_parameter*0.5);
        this.corner_bottomleft = this.add.image(25 * scaling_parameter, 275 * scaling_parameter, "corner").setScale(scaling_parameter*0.5);
        this.corner_bottomright = this.add.image(275 * scaling_parameter, 275 * scaling_parameter, "corner").setScale(scaling_parameter*0.5);
        this.corners = [this.corner_topleft, this.corner_topright, this.corner_bottomleft, this.corner_bottomright];

        // this.carromboard = this.add.image(0, 0, "carromboard").setScale(scaling_parameter);
        // this.carromboard.setOrigin(0, 0);
        
        this.phase = this.add.image(300 * scaling_parameter, 0, "phase").setScale(scaling_parameter);
        this.phase.setOrigin(0, 0);
    }

    set_pieces() {
        this.pink = this.add.image(150 * scaling_parameter, 150 * scaling_parameter, "pink").setScale(scaling_parameter);
        
        this.white1 = this.add.image(150 * scaling_parameter, 160.4 * scaling_parameter, "white").setScale(scaling_parameter);
        this.white2 = this.add.image(158.2 * scaling_parameter, 144.8 * scaling_parameter, "white").setScale(scaling_parameter);
        this.white3 = this.add.image(141.8 * scaling_parameter, 144.8 * scaling_parameter, "white").setScale(scaling_parameter);
        this.white4 = this.add.image(166.4 * scaling_parameter, 139.6 * scaling_parameter, "white").setScale(scaling_parameter);
        this.white5 = this.add.image(133.6 * scaling_parameter, 139.6 * scaling_parameter, "white").setScale(scaling_parameter);
        this.white6 = this.add.image(150 * scaling_parameter, 170.8 * scaling_parameter, "white").setScale(scaling_parameter);
        this.white7 = this.add.image(150 * scaling_parameter, 129.2 * scaling_parameter, "white").setScale(scaling_parameter);
        this.white8 = this.add.image(166.4 * scaling_parameter, 160.4 * scaling_parameter, "white").setScale(scaling_parameter);
        this.white9 = this.add.image(133.6 * scaling_parameter, 160.4 * scaling_parameter, "white").setScale(scaling_parameter);

        this.black1 = this.add.image(150 * scaling_parameter, 139.6 * scaling_parameter, "black").setScale(scaling_parameter);
        this.black2 = this.add.image(158.2 * scaling_parameter, 155.2 * scaling_parameter, "black").setScale(scaling_parameter);
        this.black3 = this.add.image(141.8 * scaling_parameter, 155.2 * scaling_parameter, "black").setScale(scaling_parameter);
        this.black4 = this.add.image(167 * scaling_parameter, 150 * scaling_parameter, "black").setScale(scaling_parameter);
        this.black5 = this.add.image(158.5 * scaling_parameter, 166 * scaling_parameter, "black").setScale(scaling_parameter);
        this.black6 = this.add.image(158.5 * scaling_parameter, 134 * scaling_parameter, "black").setScale(scaling_parameter);
        this.black7 = this.add.image(141.5 * scaling_parameter, 134 * scaling_parameter, "black").setScale(scaling_parameter);
        this.black8 = this.add.image(141.5 * scaling_parameter, 166 * scaling_parameter, "black").setScale(scaling_parameter);
        this.black9 = this.add.image(133 * scaling_parameter, 150 * scaling_parameter, "black").setScale(scaling_parameter);

        this.striker = this.add.image(150 * scaling_parameter, 246 * scaling_parameter, "striker").setScale(scaling_parameter);

        this.white_pieces = [this.white1, this.white2, this.white3, this.white4, this.white5, this.white6, this.white7, this.white8, this.white9];
        this.black_pieces = [this.black1, this.black2, this.black3, this.black4, this.black5, this.black6, this.black7, this.black8, this.black9];

        this.all_pieces = [this.striker, this.pink];
        this.all_pieces.push.apply(this.all_pieces, this.white_pieces);
        this.all_pieces.push.apply(this.all_pieces, this.black_pieces);
    }

    add_physics() {
        this.physics.world.enable(this.all_pieces);

        for(var i=0; i < this.all_pieces.length; i++){
            this.all_pieces[i].body.setAllowDrag();
            this.all_pieces[i].body.useDamping = true;
            this.all_pieces[i].body.setDrag(0.98);

            this.all_pieces[i].body.setCircle(this.all_pieces[i].displayWidth/(2*scaling_parameter), 0, 0);
            this.all_pieces[i].body.world.bounds.top = 20 * scaling_parameter;
            this.all_pieces[i].body.world.bounds.bottom = 280 * scaling_parameter;
            this.all_pieces[i].body.world.bounds.left = 20 * scaling_parameter;
            this.all_pieces[i].body.world.bounds.right = 280 * scaling_parameter;
            this.all_pieces[i].body.setCollideWorldBounds();
            this.all_pieces[i].body.setBounce(0.985);
        }
        
        this.striker.body.mass = 2.5;
        this.striker.body.setBounce(0.96);
        this.physics.add.collider(this.all_pieces, this.all_pieces, this.piece_collision, null, this);

        this.physics.world.enable(this.corners);
        this.physics.world.moves = false;
        this.physics.add.overlap(this.all_pieces, this.corners, this.potted, null, this);
    }

    piece_collision(piece1, piece2) {
        var m1 = piece1.body.mass;
        var u1 = [piece1.body.velocity.x, piece1.body.velocity.y];
        var x1 = [piece1.x, piece1.y];

        var m2 = piece2.body.mass;
        var u2 = [piece2.body.velocity.x, piece2.body.velocity.y];
        var x2 = [piece2.x, piece2.y];


        var v1 = this.subtract(u1, this.scalar_mult((2*m2 / (m1 + m2)) * (this.dot(this.subtract(u1, u2), this.subtract(x1,x2)) / (this.dot(this.subtract(x1, x2), this.subtract(x1,x2)))), this.subtract(x1, x2)));
        var v2 = this.subtract(u2, this.scalar_mult((2*m1 / (m1 + m2)) * (this.dot(this.subtract(u2, u1), this.subtract(x2,x1)) / (this.dot(this.subtract(x2, x1), this.subtract(x2,x1)))), this.subtract(x2, x1)));

        piece1.body.setVelocity(-v1[0], -v1[1]);
        piece2.body.setVelocity(v2[0], v2[1]);
    }

    dot(vector1, vector2) {
        var n = vector1.length;
        var sum = 0
        for(var i=0; i < n; i+=1){
            sum += vector1[i] * vector2[i];
        }
        return sum;
    }

    subtract(vector1, vector2) {
        var n = vector1.length;
        var vector3 = []
        for(var i=0; i < n; i+=1){
            vector3.push(vector1[i] - vector2[i]);
        }
        return vector3;
    }

    scalar_mult(scalar, vector) {
        var n = vector.length;
        var prod = [];
        for(var i=0; i < n; i+=1){
            prod.push(scalar * vector[i]);
        }
        return prod;
    }

    set_gameplay () {
        this.aim = this.add.image(150 * scaling_parameter, 210 * scaling_parameter, "aim").setScale(scaling_parameter);
        this.aim.visible = false;
    }

    makeinteractive() {
        this.phase.setInteractive();

        this.carromboard.setInteractive();
        this.carromboard.input.enable = false;

        this.input.on('gameobjectdown', this.move, this);
    }

    move(pointer, gameObject) {
        switch(this.gamephase){
            case "set": this.set_striker(pointer, gameObject); break;
            case "aim": this.aim_striker(gameObject); break;
            case "power": this.set_power(gameObject); break;
        }
    }

    reset_striker() {
        console.log("White:", this.whiteScore, "Black:", this.blackScore);

        this.striker.visible = true;
        if(this.repeat_turn == false){
            switch(this.turn){
                case "bottom": this.turn = "top"; break;
                case "top": this.turn = "bottom"; break;
            }
        }

        console.log(this.turn, " ", this.repeat_turn);

        switch(this.turn) {
            case "bottom": this.striker.x = 150 * scaling_parameter; this.striker.y = 246 * scaling_parameter; break;
            case "top": this.striker.x = 150 * scaling_parameter; this.striker.y = 54 * scaling_parameter; break;
        }
    }

    set_striker(pointer, gameObject) {
        if(gameObject == this.carromboard) {
            this.striker_ready = !this.striker_ready;
        }
        else if(gameObject == this.phase && this.striker_ready == true){
            switch(this.turn) {
                case "bottom": this.aim.angle = -90; this.aim.visible = true; break;
                case "top": this.aim.angle = -90; this.aim.visible = true; break;
            }
            this.gamephase = "aim";
        }
    }

    aim_striker(gameObject) {
        if(gameObject == this.carromboard) {
            this.move_aim = !this.move_aim;
        }
        else if(gameObject == this.phase && this.move_aim == false){
            this.gamephase = "power";
            this.move_aim = true;
        }
    }

    set_power(gameObject) {
        if(gameObject == this.carromboard) {
            this.power = 5000 * scaling_parameter;
        }

        this.gamephase = "shoot";

        for(var i=0; i < this.all_pieces.length; i++) {
            this.all_pieces[i].body.enable = true;
        }

        this.hit_striker();
    }

    hit_striker() {
        this.aim.visible = false;
        this.repeat_turn = false;

        this.striker.body.moves = true;

        switch(this.turn){
            case "bottom":
                this.striker.body.velocity.x = this.power * Math.sin(3.14/180 * this.aim.angle) * scaling_parameter;
                this.striker.body.velocity.y = -this.power * Math.cos(3.14/180 * this.aim.angle) * scaling_parameter;
                break;
            case "top":
                this.striker.body.velocity.x = -this.power * Math.sin(3.14/180 * this.aim.angle) * scaling_parameter;
                this.striker.body.velocity.y = this.power * Math.cos(3.14/180 * this.aim.angle) * scaling_parameter;
                break;
        }

    }

    potted(piece, corner) {
        
        if(this.white_pieces.includes(piece)) {
            this.whiteScore += 1;
            if(this.turn == "bottom") {
                this.repeat_turn = true;
            }
            this.whitePotted.push(this.piece);
            if(this.prev_turn_pink == true && this.pinkPotted == "none") {
                this.pinkPotted = "white";
            }
            else {
                this.prev_turn_pink = false;
            }
        }
        
        else if(this.black_pieces.includes(piece)) {
            this.blackScore += 1;
            if(this.turn == "top"){
                this.repeat_turn = true;
            }
            this.blackPotted.push(this.piece);
            if(this.prev_turn_pink == true && this.pinkPotted == "none") {
                this.pinkPotted = "black";
            }
            else {
                this.prev_turn_pink = false;
            }
        }
        
        else if(this.pink == piece) {
            if(this.turn == "bottom" && this.whiteScore > 0) {
                this.prev_turn_pink = true;
                this.repeat_turn = true;
            }
            else if(this.turn == "top" && this.blackScore > 0) {
                this.prev_turn_pink = true;
                this.repeat_turn = true;
            }
            else {
                this.put_at_center.push(this.piece);
            }
        }
        
        else {                  // Striker
            if(this.prev_turn_pink == true && this.pinkPotted == "none") {
                this.put_at_center.push(this.pink);
            }
            if(this.turn == "bottom" && this.whiteScore > 0) {
                this.whiteScore -= 1;
                this.put_at_center.push(this.whitePotted.pop());
            }
            else if(this.turn == "top" && this.blackScore > 0) {
                this.blackScore -= 1;
                this.put_at_center.push(this.blackPotted.pop());
            }
        }
        
        if(piece == this.striker){
            piece.x = -10 * scaling_parameter;
            piece.y = -10 * scaling_parameter;
            piece.visible = false;
            piece.body.setVelocity(0, 0);
        }
        else{
            var index = this.all_pieces.indexOf(piece);
            this.all_pieces.splice(index, 1);
            piece.x = -10 * scaling_parameter;
            piece.y = -10 * scaling_parameter;
            piece.visible = false;
            piece.body.setVelocity(0, 0);
        }
    }

    /********************************************************
                         UPDATE 
    ********************************************************/

    update() {

        if(this.gamephase == "set" && this.striker_ready == false) {
            
            if(this.striker.x < 66 * scaling_parameter){
                this.striker.x = 66 * scaling_parameter;
                this.striker_dir = 1;
            }
            else if(this.striker.x > 234 * scaling_parameter){
                this.striker.x = 234 * scaling_parameter;
                this.striker_dir = -1;
            }
            this.striker.x += this.striker_dir * scaling_parameter;

            switch(this.turn){
                case "bottom":
                    this.striker.y = 246 * scaling_parameter;
                    break;
                case "top":
                    this.striker.y = 54 * scaling_parameter;
                    break;
            }
        }

        else if(this.gamephase == "aim" && this.move_aim == true) {
            
            if(this.aim.angle <= -91){
                this.aim.angle = -90;
                this.rotate_dir = 1;
            }
            else if(this.aim.angle >= 91) {
                this.aim.angle = 90;
                this.rotate_dir = -1;
            }
            this.aim.angle += 0.8 * this.rotate_dir;

            switch(this.turn){
                case "bottom":
                    this.aim.flipY = false;
                    this.aim.x = this.striker.x + 36 * Math.sin(3.14/180 * this.aim.angle) * scaling_parameter;
                    this.aim.y = this.striker.y - 36 * Math.cos(3.14/180 * this.aim.angle) * scaling_parameter;
                    break;
                case "top":
                    this.aim.flipY = true;
                    this.aim.x = this.striker.x - 36 * Math.sin(3.14/180 * this.aim.angle) * scaling_parameter;
                    this.aim.y = this.striker.y + 36 * Math.cos(3.14/180 * this.aim.angle) * scaling_parameter;
                    break;
            }
        }

        else if(this.gamephase == "shoot") {

            this.all_stopped = true;
            for(var i=0; i < this.all_pieces.length; i+=1){
                if(this.all_pieces[i].body.speed > 0.15){
                    this.all_stopped = false;
                }
            }
            if(this.all_stopped == true) {
                this.gamephase = "set";
                for(var i=0; i < this.all_pieces.length; i++) {
                    this.all_pieces[i].body.enable = false;
                }
                this.striker.body.enable = true;
                this.reset_striker();
            }

            while(this.put_at_center.length > 0){
                var piece = this.put_at_center.pop();
                piece.x = 150 * scaling_parameter;
                piece.y = 150 * scaling_parameter;
                piece.visible = true;
                this.all_pieces.push(piece);
            }


            if(this.whiteScore == 9 && this.blackScore < 9 && this.pinkPotted != "none") {
                console.log("WHITE WINS!!!");
            }

            else if(this.blackScore == 9 && this.whiteScore < 9 && this.pinkPotted != "none") {
                console.log("BLACK WINS!!!");
            }
            else if(this.whiteScore == 9 && this.blackScore == 9 && this.pinkPotted != "none") {
                console.log("IT'S A TIE!!!");
            }

        }



    }

}