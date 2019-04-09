var slices = [];
var Slice = class Slice {

    constructor(x, y, r) {
        this.x = x || random(width);
        this.y = y || random((height / 2 + 100), (height / 2 - 100));
        this.r = r || 30;
        this.speed = 4 - (this.r / 10);
        this.growth = (width > 450) ? 6 : 3;
    }

    move() {
        this.y = this.y - random(this.speed * 2);
        this.r = this.r + random(-this.growth, this.growth);
    }

    show() {
        stroke(255);
        strokeWeight(1);
        fill(20);
        ellipse(this.x, this.y, this.r * 2);
    }

    hovered() {
        const d = dist(this.x, this.y, mouseX, mouseY);
        return (d - 15 < this.r);
    }

    excited() {
        this.speed = this.speed * 1.2;
        this.growth = this.growth * 1.2;
    }

    normal() {
        this.speed = 4 - (this.r / 10);
        this.growth = (width > 450) ? 4 : 2;
    }

};




setup = () => {
    createCanvas(windowWidth, windowHeight);
    background(20);
    frameRate(24);

    const initialSliceCount = Math.floor(width / 8);
    for (let i = 0; i < initialSliceCount; i++) {
        slices[i] = new Slice();
    }
};


draw = () => {

    background(20);

    for (const slice of slices) {

        slice.move();
        slice.show();

        if (slice.hovered()) {
            slice.excited();
        } else {
            slice.normal();
        }

        if (slice.y < -slice.r) {
            slice.y = height + slice.r;
        } else if (slice.y - slice.r > height) {
            slice.y = 0 - slice.r;
        }

        if (slice.r > 400) {
            slice.r = 400;
        } else if (slice.r < 1) {
            slice.r = 1;
        }

    }

};


windowResized = () => {
    resizeCanvas(windowWidth, windowHeight);
    background(20);
};


new p5();
