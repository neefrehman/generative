import React from "react";
import p5 from "p5";

import P5Wrapper from "Renderers/P5Wrapper";

const sketch = (p: p5) => {
    let graphics;
    const graphicsSize = 300;

    const slices = [];
    class Slice {
        x: number;
        y: number;
        r: number;
        speed: number;
        growth: number;
        growthDirection: number;
        maxR: number;
        fill: number;
        stroke: number;

        constructor(x?: number, y?: number, r?: number) {
            this.x = x || p.random(graphicsSize);
            this.y = y || 0;
            this.r = r || 12;
            this.speed = 5;
            this.growth = 2;
            this.growthDirection = -1;
            this.maxR = 48;

            this.fill = 20;
            this.stroke = 255;
        }

        move() {
            this.y += p.random(this.speed);
            this.r += this.growthDirection * p.noise(this.growth);

            if (this.r < 1) {
                this.growthDirection = 1;
            } else if (this.r > this.maxR) {
                this.maxR += 4;
                this.growthDirection = -1;
            }

            if (this.y > graphicsSize + this.r + 150) {
                this.y = -this.r;
            }
        }

        show() {
            graphics.stroke(this.stroke);
            graphics.strokeWeight(1);
            graphics.fill(this.fill);
            graphics.ellipse(this.x, this.y, this.r * 2);
        }

        hovered() {
            const d = p.dist(this.x, this.y, p.mouseX, p.mouseY);
            return d - 5 < this.r;
        }

        excited() {
            this.fill = 255;
            this.stroke = 0;
        }

        normal() {
            this.fill = 20;
            this.stroke = 255;
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        graphics = p.createGraphics(graphicsSize, graphicsSize);
        graphics.background(20);

        const initialSliceCount = Math.floor(10);
        for (let i = 0; i < initialSliceCount; i++) {
            slices[i] = new Slice();
        }
    };

    p.draw = () => {
        for (let x = 0; x < p.width; x += 200) {
            for (let y = 0; y < p.height; y += 200) {
                p.image(graphics, x, y);
            }
        }

        slices.forEach(slice => {
            slice.move();
            slice.show();

            if (slice.hovered()) {
                slice.excited();
            } else {
                slice.normal();
            }

            if (slice.y < -slice.r) {
                // eslint-disable-next-line no-param-reassign
                slice.y = p.height + slice.r;
            }
        });
    };
};

const S150519 = () => <P5Wrapper sketch={sketch} />;

export default S150519;
