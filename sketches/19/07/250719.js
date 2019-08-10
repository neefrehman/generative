(() => {
    let yoff = 0;

    class Blob {
        constructor(x, y, r) {
            this.pos = createVector(x, y);
            this.r = r;
            this.vel = createVector(0, 0);
        }

        update() {
            const newVel = createVector(
                mouseX - width / 2,
                mouseY - height / 2
            );
            newVel.div(50);
            newVel.setMag(3);
            newVel.limit(3);
            this.vel.lerp(newVel, 0.2);
            this.pos.add(this.vel);
        }

        constrain() {
            blob.pos.x = constrain(blob.pos.x, -width / 4, width / 4);
            blob.pos.y = constrain(blob.pos.y, -height / 4, height / 4);
        }

        show() {
            fill(255);
            // ellipse(this.pos.x, this.pos.y, this.r * 2);
            push();
            translate(this.pos.x, this.pos.y);

            beginShape();
            let xoff = 0;

            for (let a = 0; a < TWO_PI; a += 0.05) {
                const offset = map(noise(xoff, yoff), -1, 1, -25, 25);
                const r = this.r + offset;
                const x = r * cos(a);
                const y = r * sin(a);
                vertex(x, y);

                xoff += 0.04;
            }
            endShape();
            pop();

            yoff += 0.01;
        }
    }

    let blob;
    // let blobs = [];
    let zoom = 1;

    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);

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
        blob.update();
        blob.constrain();
    };
})();
