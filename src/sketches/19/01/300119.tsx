/* eslint-disable no-param-reassign */
import React from "react";
import p5 from "p5";

import P5Wrapper from "Renderers/P5Wrapper";

const sketch = (p: p5) => {
    const slices = [];
    class Slice {
        x: number;
        y: number;
        r: number;
        speed: number;
        growth: number;

        constructor(x?: number, y?: number, r?: number) {
            this.x = x || p.random(p.width);
            this.y = y || p.random(p.height / 2 + 100, p.height / 2 - 100);
            this.r = r || 30;
            this.speed = 4 - this.r / 10;
            this.growth = p.width > 450 ? 6 : 3;
        }

        move() {
            this.y -= p.random(this.speed * 2);
            this.r += p.random(-this.growth, this.growth);
        }

        show() {
            p.stroke(255);
            p.strokeWeight(1);
            p.fill(20);
            p.ellipse(this.x, this.y, this.r * 2);
        }

        hovered() {
            const d = p.dist(this.x, this.y, p.mouseX, p.mouseY);
            return d - 15 < this.r;
        }

        excited() {
            this.speed *= 1.2;
            this.growth *= 1.2;
        }

        normal() {
            this.speed = 4 - this.r / 10;
            this.growth = p.width > 450 ? 4 : 2;
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);
        p.frameRate(24);

        const initialSliceCount = Math.floor(p.width / 8);
        for (let i = 0; i < initialSliceCount; i++) {
            slices[i] = new Slice();
        }
    };

    p.draw = () => {
        p.background(20);

        slices.forEach(slice => {
            slice.move();
            slice.show();

            if (slice.hovered()) {
                slice.excited();
            } else {
                slice.normal();
            }

            if (slice.y < -slice.r) {
                slice.y = p.height + slice.r;
            } else if (slice.y - slice.r > p.height) {
                slice.y = 0 - slice.r;
            }

            if (slice.r > 400) {
                slice.r = 400;
            } else if (slice.r < 1) {
                slice.r = 1;
            }
        });
    };
};

const S300119 = () => <P5Wrapper sketch={sketch} />;

export default S300119;
