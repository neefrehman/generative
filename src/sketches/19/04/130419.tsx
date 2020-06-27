import React from "react";
import p5 from "p5";

import P5Wrapper from "../../../components/renderers/P5Wrapper";

const sketch = (p: p5) => {
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
            this.x = x || p.random(p.width);
            this.y = y || 0;
            this.r = r || 36;
            this.speed = 5;
            this.growth = p.width > 450 ? 6 : 3;
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

            if (this.y > p.height + this.r + 150) {
                this.y = -this.r;
            }
        }

        show() {
            p.stroke(this.stroke);
            p.strokeWeight(1);
            p.fill(this.fill);
            p.ellipse(this.x, this.y, this.r * 2);
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
        p.background(20);
        p.frameRate(20);

        const initialSliceCount = Math.floor(p.width / 25);
        for (let i = 0; i < initialSliceCount; i++) {
            slices[i] = new Slice();
        }
    };

    p.draw = () => {
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

const S130419 = () => <P5Wrapper sketch={sketch} />;

export default S130419;
