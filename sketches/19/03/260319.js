var vibrations = [];

var Particle = class Particle {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.history = [];
    }

    update() {
        this.x = this.x + random(-12, 12);
        this.y = this.y + random(-12, 12);

        const v = createVector(this.x, this.y);
        this.history.push(v);

        if (this.history.length > 100) {
            this.history.splice(0, 1);
        }

        if (this.x > width || this.x < 0 || this.y > height || this.y < 0) {
            this.x = width / 2;
            this.y = height / 2;
        }

        for (let i = 0; i < this.history.length; i++) {
            this.history[i].x += random(-2, 2);
            this.history[i].y += random(-2, 2);
        }
    }

    show() {
        beginShape();
        for (let i = 0; i < this.history.length; i++) {
            const pos = this.history[i];
            const col = map(i, 0, this.history.length, 75, 200);
            noStroke();
            fill(col);
            vertex(pos.x, pos.y);
        }
        endShape();

    }
};


function setup() {
    createCanvas(windowWidth, windowHeight);

    for (let i = 0; i < 5; i++) {
        vibrations.push(new Particle(random(width), random(height)));
    }
}


function draw() {
    background(20);

    for (let i = 0; i < vibrations.length; i++) {
        vibrations[i].show();
        vibrations[i].update();
    }
}


function mousePressed() {
    vibrations.push(new Particle(mouseX, mouseY));
}


new p5();
