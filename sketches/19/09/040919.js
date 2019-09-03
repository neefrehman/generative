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
        }

        if (frameCount % 60 === 0) {
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
