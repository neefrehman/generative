var blobs = [];
var Blob = class Blob {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = random(0, 2 * PI);
        this.xspeed = random(2, 5) * Math.cos(angle);
        this.yspeed = random(2, 5) * Math.sin(angle);
        this.r = random(120, 300);
    }

    update() {
        this.x += this.xspeed;
        this.y += this.yspeed;
        if (this.x > width || this.x < 0) this.xspeed *= -1;
        if (this.y > height || this.y < 0) this.yspeed *= -1;
    }

};


function setup() {
    createCanvas(400, 300);
    colorMode(HSB);
    for (i = 0; i < 10; i++) blobs[i] = new Blob(random(0, width), random(0, height));
}

function draw() {
    background(51);

    loadPixels();
    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            let sum = 0;
            for (i = 0; i < blobs.length; i++) {
                const xdif = x - blobs[i].x;
                const ydif = y - blobs[i].y;
                const d = sqrt((xdif * xdif) + (ydif * ydif));
                sum += 10 * blobs[i].r / d;
            }
            set(x, y, color(sum, 150, 150));
        }
    }
    updatePixels();

    for (i = 0; i < blobs.length; i++) blobs[i].update();
}


new p5();
