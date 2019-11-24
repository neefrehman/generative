// From The Coding Train
// https://www.youtube.com/watch?v=ZI1dmHv3MeM&list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH&index=195

(() => {
    const blobs = [];
    class Blob {
        constructor(x, y, r) {
            this.pos = createVector(x, y);
            this.r = r;
            this.vel = createVector(0, 0);

            this.noiseTurbulence = 0.5;
            this.zOff = 0;
        }

        show() {
            push();
            translate(this.pos.x, this.pos.y);
            beginShape();
            for (let a = 0; a < TWO_PI; a += TWO_PI / 500) {
                let xOff = map(cos(a), -1, 1, 0, this.noiseTurbulence);
                let yOff = map(sin(a), -1, 1, 0, this.noiseTurbulence);
                const offset = map(noise(xOff, yOff, this.zOff), 0, 1, 0, 50);
                const r = this.r + offset;
                const x = r * cos(a);
                const y = r * sin(a);
                vertex(x, y);
            }
            endShape(CLOSE);
            pop();

            this.zOff += 0.01;
            this.noiseTurbulence += 0.0003;
        }
    }

    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);
        stroke(255);
        strokeWeight(2);
        noFill();

        blobs.push(new Blob(0, 0, 128));
    };

    draw = () => {
        background(20);
        translate(width / 2, height / 2);

        for (const blob of blobs) {
            blob.show();
        }
    };

    mousePressed = () => {};
})();
