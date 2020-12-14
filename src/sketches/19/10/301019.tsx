import React from "react";
import type p5 from "p5";

import { P5Renderer } from "Renderers/P5";

const sketch = (p: p5) => {
    let shortestDimension: number;
    let maxRadius: number;

    const sinePoints: SinePoint[] = [];
    class SinePoint {
        trailColor: number;
        yVel: number;
        xVel: number;
        xAngle: number;
        yAngle: number;
        pos: p5.Vector;
        trail: p5.Vector[];

        constructor() {
            this.trailColor = p.random(255);
            this.yVel = p.random(0.01, 0.1);
            this.xVel = p.random(0.01, 0.1);
            this.xAngle = 0;
            this.yAngle = 0;

            this.pos = p.createVector(p.width / 2, p.height / 2);

            this.trail = [];
        }

        move() {
            this.xAngle += this.xVel;
            this.yAngle += this.yVel;

            const v = p.createVector(this.pos.x, this.pos.y);
            this.trail.push(v);
            if (this.trail.length > 150) {
                this.trail.splice(0, 1);
            }
        }

        show() {
            this.pos.x = p.width / 2 + maxRadius * p.sin(this.xAngle);
            this.pos.y = p.height / 2 + maxRadius * p.sin(this.yAngle);

            p.beginShape();
            p.colorMode(p.HSB);
            for (let i = 0; i < this.trail.length; i++) {
                const pos = this.trail[i];
                p.noStroke();
                p.fill(this.trailColor, 255, 255);
                p.vertex(pos.x, pos.y);
            }
            p.colorMode(p.RGB);
            p.endShape();
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);

        shortestDimension = Math.min(p.width, p.height);
        maxRadius = (shortestDimension / 2) * 0.75;

        sinePoints.push(new SinePoint());
    };

    p.draw = () => {
        p.background(20);

        sinePoints.forEach(point => {
            point.move();
            point.show();
        });

        if (p.frameCount % 900 === 0) {
            sinePoints.push(new SinePoint());
        }

        if (sinePoints.length > 7) {
            sinePoints.splice(0, 1);
        }
    };

    p.mousePressed = () => {
        sinePoints.push(new SinePoint());
    };
};

const S301019 = () => <P5Renderer sketch={sketch} />;

export default S301019;
