// From The Coding Train
// https://www.youtube.com/watch?v=ZI1dmHv3MeM&list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH&index=195

(() => {
    class Blob {
        constructor(x, y, r) {
            this.pos = createVector(x, y);
            this.r = r;
            this.vel = createVector(0, 0);
        }

        show() {
            push();
            translate(this.pos.x, this.pos.y);
            beginShape();
            for (let a = 0; a < TWO_PI; a += 0.1) {
                let xOff = map(cos(a), -1, 1, 0, noiseMax);
                let yOff = map(sin(a), -1, 1, 0, noiseMax);
                const offset = map(noise(xOff, yOff, zOff), 0, 1, 0, 50);
                const r = this.r + offset;
                const x = r * cos(a);
                const y = r * sin(a);
                vertex(x, y);
            }
            endShape(CLOSE);
            pop();

            zOff += 0.01;
            noiseMax += 0.0005;
        }
    }

    let blob;

    let zoom = 1;
    let noiseMax = 0.5;
    let zOff = 0;

    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);
        stroke(255);
        strokeWeight(2);
        noFill();

        blob = new Blob(0, 0, 128);
    };

    draw = () => {
        background(20);

        translate(width / 2, height / 2);
        var newZoom = 128 / blob.r;
        zoom = lerp(zoom, newZoom, 0.1);
        scale(zoom);
        translate(-blob.pos.x, -blob.pos.y);

        blob.show();
    };

    mousePressed = () => {
        noiseMax += 0.05;
    };
})();
