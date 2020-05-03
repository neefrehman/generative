import React from "react";
import p5 from "p5/lib/p5.min";

import P5Wrapper from "../../../components/P5Wrapper";

const sketch = (p: p5) => {
    const blobs = [];
    class Blob {
        pos: p5.Vector;
        r: number;
        vel: p5.Vector;
        noiseTurbulence: number;
        zOff: number;
        pointCount: number;

        constructor(x: number, y: number, r: number) {
            this.pos = p.createVector(x, y);
            this.r = r;
            this.vel = p.createVector(0, 0);

            this.noiseTurbulence = 0.5;
            this.zOff = 0;

            this.pointCount = 2;
        }

        show() {
            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.beginShape();
            for (let a = 0; a < p.TWO_PI; a += p.TWO_PI / this.pointCount) {
                const xOff = p.map(p.cos(a), -1, 1, 0, this.noiseTurbulence);
                const yOff = p.map(p.sin(a), -1, 1, 0, this.noiseTurbulence);
                const offset = p.map(
                    p.noise(xOff, yOff, this.zOff),
                    0,
                    1,
                    0,
                    50
                );
                const r = this.r + offset;
                const x = r * p.cos(a);
                const y = r * p.sin(a);
                p.vertex(x, y);
            }
            p.endShape(p.CLOSE);
            p.pop();

            this.zOff += 0.015;
            this.noiseTurbulence += 0.0003;
        }

        increasePointCount(delta: number) {
            this.pointCount += delta || 1;
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);
        p.stroke(255);
        p.strokeWeight(2);
        p.noFill();

        blobs.push(new Blob(0, 0, 128));
    };

    p.draw = () => {
        p.background(20);
        p.translate(p.width / 2, p.height / 2);

        blobs.forEach(blob => blob.show());
    };

    p.mousePressed = () => blobs.forEach(blob => blob.increasePointCount(1));
};

const S241119 = () => <P5Wrapper sketch={sketch} />;

export default S241119;
