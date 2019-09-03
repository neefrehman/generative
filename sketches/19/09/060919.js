(() => {
    let blocks = [];
    let shortestDimension;
    let camX = 0,
        camY = 0;

    class Block {
        constructor(x, y, z) {
            this.x = x || random(shortestDimension);
            this.y = y || random(shortestDimension);
            this.z = z || random(shortestDimension);

            this.width = random(shortestDimension / 5);
            this.height = random(shortestDimension / 5);
            this.depth = random(shortestDimension / 5);

            this.r = random(255);
            this.g = random(255);
            this.b = random(255);

            this.speed = 0.7;
            this.direction = random([
                [this.speed, 0, 0],
                [0, this.speed, 0],
                [0, 0, this.speed]
            ]);
        }

        move() {
            this.x += this.direction[0];
            this.y += this.direction[1];
            this.z += this.direction[2];
        }

        changeDirection() {
            this.speed = 0;
            this.direction = random([
                [this.speed, 0, 0],
                [0, this.speed, 0],
                [0, 0, this.speed]
            ]);
            setTimeout(() => {
                this.speed = 0.7;
                this.direction = random([
                    [this.speed, 0, 0],
                    [0, this.speed, 0],
                    [0, 0, this.speed]
                ]);
            }, 300);
        }

        show() {
            push();
            translate(this.x, this.y, this.z);
            ambientMaterial(this.r, this.g, this.b);
            box(this.width, this.height, this.depth);
            pop();
        }
    }

    setup = () => {
        createCanvas(windowWidth, windowHeight, WEBGL);
        shortestDimension = Math.min(width, height);

        background(20);
        frameRate(20);

        noStroke();
        strokeWeight(2);

        for (let i = 0; i < 30; i++) {
            blocks.push(new Block());
        }
    };

    draw = () => {
        camera(camX, camY, shortestDimension * 2, tan(PI / 6), 0, 0, 0, 1, 0);

        translate(-width / 2, -height / 2);
        background(20);

        pointLight(255, 255, 255, -200, 0, 0);
        pointLight(255, 255, 255, 200, 0, 0);
        pointLight(255, 255, 255, 0, -200, 0);
        pointLight(255, 255, 255, 0, 0, 2000);

        for (const block of blocks) {
            block.show();
            block.move();
        }

        if (frameCount % 90 === 0) {
            for (const block of blocks) {
                block.changeDirection();
            }
        }
    };

    mousePressed = () => {
        blocks.push(new Block());

        for (const block of blocks) {
            block.changeDirection();
        }
    };

    mouseMoved = () => {
        camX = map(mouseX, 0, width, -400, 400);
        camY = map(mouseY, 0, height, -200, 200);
    };
})();
