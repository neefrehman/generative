import React from "react";
import p5 from "p5";

import P5Wrapper from "Renderers/P5Wrapper";

const sketch = (p: p5) => {
    const blobs = [];
    class Blob {
        x: number;
        y: number;
        xspeed: number;
        yspeed: number;
        r: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
            const angle = p.random(0, 2 * p.PI);
            this.xspeed = p.random(2, 5) * Math.cos(angle);
            this.yspeed = p.random(2, 5) * Math.sin(angle);
            this.r = p.random(120, 300);
        }

        update() {
            this.x += this.xspeed;
            this.y += this.yspeed;
            if (this.x > p.width || this.x < 0) this.xspeed *= -1;
            if (this.y > p.height || this.y < 0) this.yspeed *= -1;
        }
    }

    p.setup = () => {
        const canvasWidth = window.innerWidth > 500 ? 360 : 220;
        const canvasHeight = canvasWidth * (3 / 4);
        p.createCanvas(canvasWidth, canvasHeight);

        const initialBlobCount = window.innerWidth > 500 ? 10 : 7;
        for (let i = 0; i < initialBlobCount; i++) {
            blobs[i] = new Blob(p.random(0, p.width), p.random(0, p.height));
        }
    };

    p.draw = () => {
        p.loadPixels();
        for (let x = 0; x < p.width; x++) {
            for (let y = 0; y < p.height; y++) {
                let sum = 0;
                for (let i = 0; i < blobs.length; i++) {
                    const xdif = x - blobs[i].x;
                    const ydif = y - blobs[i].y;
                    const d = p.sqrt(xdif * xdif + ydif * ydif);
                    sum += (10 * blobs[i].r) / d;
                }
                p.set(x, y, p.color(sum));
            }
        }
        p.updatePixels();

        blobs.forEach(blob => blob.update());
    };
};

const S250219 = () => <P5Wrapper sketch={sketch} autoResizeToWindow={false} />;

export default S250219;
