import React from "react";
import p5 from "p5";

import { P5Renderer } from "Renderers/P5";

const sketch = (p: p5) => {
    const blobs: Blob[] = [];
    class Blob {
        pos: p5.Vector;
        r: number;
        vel: p5.Vector;
        noiseTurbulence: number;
        zOff: number;
        color: number;
        alpha: number;

        constructor(x: number, y: number, r: number) {
            this.pos = p.createVector(x, y);
            this.r = r;
            this.vel = p.createVector(0, 0);

            this.noiseTurbulence = 1.7;
            this.zOff = 0;

            this.color = 255;
            this.alpha = 4;
        }

        show() {
            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.beginShape();
            for (let a = 0; a < p.TWO_PI; a += p.TWO_PI / 100) {
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

                if (p.frameCount % 1200 === 0) {
                    this.invertColor();
                }

                p.stroke(this.color, this.alpha);
                p.vertex(x, y);
            }
            p.endShape(p.CLOSE);
            p.pop();

            this.zOff += 0.02;
            this.noiseTurbulence += 0.0003;
        }

        invertColor() {
            this.color = this.color === 255 ? 20 : 255;
            this.alpha = this.alpha === 4 ? 23 : 4;
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);
        p.strokeWeight(1);
        p.noFill();

        blobs.push(new Blob(0, 0, 128));
    };

    p.draw = () => {
        p.translate(p.width / 2, p.height / 2);

        blobs.forEach(blob => blob.show());
    };
};

const S021219 = () => <P5Renderer sketch={sketch} />;

export default S021219;
