(() => {
    const blobs = [];
    class Blob {
        constructor(x, y, r) {
            this.pos = createVector(x, y);
            this.r = r;
            this.vel = createVector(0, 0);

            this.noiseTurbulence = 1.7;
            this.zOff = 0;

            this.color = 255;
            this.alpha = 4;
        }

        show() {
            push();
            translate(this.pos.x, this.pos.y);
            beginShape();
            for (let a = 0; a < TWO_PI; a += TWO_PI / 100) {
                let xOff = map(cos(a), -1, 1, 0, this.noiseTurbulence);
                let yOff = map(sin(a), -1, 1, 0, this.noiseTurbulence);
                const offset = map(noise(xOff, yOff, this.zOff), 0, 1, 0, 50);
                const r = this.r + offset;
                const x = r * cos(a);
                const y = r * sin(a);

                if (frameCount % 1200 === 0) {
                    this.invertColor();
                }

                stroke(this.color, this.alpha);
                vertex(x, y);
            }
            endShape(CLOSE);
            pop();

            this.zOff += 0.02;
            this.noiseTurbulence += 0.0003;
        }

        invertColor() {
            this.color = this.color === 255 ? 20 : 255;
            this.alpha = this.alpha === 4 ? 23 : 4;
        }
    }

    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);
        strokeWeight(1);
        noFill();

        blobs.push(new Blob(0, 0, 128));
    };

    draw = () => {
        translate(width / 2, height / 2);

        for (const blob of blobs) {
            blob.show();
        }
    };
})();
