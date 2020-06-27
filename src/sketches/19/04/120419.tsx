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
        fill: number;
        stroke: number;

        constructor(x?: number, y?: number, r?: number) {
            this.x = x || p.random(p.width);
            this.y = y || p.height;
            this.r = r || 30;
            this.speed = 4;
            this.growth = p.width > 450 ? 6 : 3;

            this.fill = 20;
            this.stroke = 255;
        }

        move() {
            this.y -= p.random(this.speed);
            this.r += p.random(-this.growth, this.growth);

            if (this.y < -this.r) {
                this.y = p.height + this.r;
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
            return d - 15 < this.r;
        }

        excited() {
            this.speed *= 1.2;
            this.growth *= 1.2;
            this.fill = 255;
            this.stroke = 0;
        }

        normal() {
            this.speed = 4;
            this.growth = p.width > 450 ? 4 : 2;
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
        });
    };
};

const S120419 = () => <P5Wrapper sketch={sketch} />;

export default S120419;
