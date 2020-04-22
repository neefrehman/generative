(() => {
    let blocks = [];
    let shortestDimension;
    let camX = 0,
        camY = 0;

    class Block {
        constructor() {
            this.width = random(shortestDimension / 5);
            this.height = random(shortestDimension / 5);
            this.depth = random(shortestDimension / 5);

            this.r = random(255);
            this.g = random(255);
            this.b = random(255);

            this.xOff = random(200);
            this.yOff = random(400, 600);
            this.zOff = random(800, 1000);
        }

        move() {
            this.xOff += 0.01;
            this.yOff += 0.01;
            this.zOff += 0.01;

            this.x = map(noise(this.xOff), 0, 1, 0, width);
            this.y = map(noise(this.yOff), 0, 1, 0, height);
            this.z = map(noise(this.zOff), 0, 1, 0, shortestDimension);
        }

        show() {
            push();
            translate(this.x, this.y, this.z);
            stroke(this.r, this.g, this.b);
            box(this.width, this.height, this.depth);
            pop();
        }
    }

    setup = () => {
        createCanvas(windowWidth, windowHeight, WEBGL);
        shortestDimension = Math.min(width, height);

        background(20);
        frameRate(20);

        noFill();
        strokeWeight(2);

        blocks.push(new Block());
    };

    draw = () => {
        camera(camX, camY, shortestDimension * 2, tan(PI / 6), 0, 0, 0, 1, 0);

        translate(-width / 2, -height / 2);
        background(20);

        for (const block of blocks) {
            block.show();
            block.move();
        }

        if (frameCount % 80 === 0) {
            blocks.push(new Block());
        }
    };

    mousePressed = () => {
        blocks.push(new Block());
    };

    mouseMoved = () => {
        camX = map(mouseX, 0, width, -500, 500);
        camY = map(mouseY, 0, height, -250, 250);
    };
})();
