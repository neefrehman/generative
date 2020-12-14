import React from "react";
import { Vector } from "p5";
import type p5 from "p5";

import { P5Renderer } from "Renderers/P5";

const sketch = (p: p5) => {
    const noiseIncrement = 0.05;
    let tOff = 0;

    const scale = 20;
    let columns: number;
    let rows: number;

    let flowField: Vector[];

    const particles: Particle[] = [];
    class Particle {
        pos: Vector;
        vel: Vector;
        acc: Vector;
        maxSpeed: number;

        constructor() {
            this.pos = p.createVector(p.random(p.width), p.random(p.height));
            this.vel = p.createVector(0, 0);
            this.acc = p.createVector(0, 0);
            this.maxSpeed = 4;
        }

        update() {
            this.vel.add(this.acc);
            this.vel.limit(this.maxSpeed);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }

        follow(vectors: Vector[]) {
            const x = p.floor(this.pos.x / scale);
            const y = p.floor(this.pos.y / scale);
            const index = x + y * columns;
            const force = vectors[index];
            this.applyForce(force);
        }

        applyForce(force: Vector) {
            this.acc.add(force);
        }

        show() {
            p.stroke(255);
            p.strokeWeight(6);
            p.point(this.pos.x, this.pos.y);
        }

        checkEdge() {
            if (this.pos.x > p.width) this.pos.x = 0;
            if (this.pos.x < 0) this.pos.x = p.width;
            if (this.pos.y > p.height) this.pos.y = 0;
            if (this.pos.y < 0) this.pos.y = p.height;
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);
        p.pixelDensity(1);

        columns = p.floor(p.width / scale);
        rows = p.floor(p.height / scale);

        flowField = new Array(columns * rows);

        for (let i = 0; i < 300; i++) {
            particles.push(new Particle());
        }
    };

    p.draw = () => {
        p.background(20);

        let yOff = 0;
        for (let y = 0; y < rows; y++) {
            let xOff = 0;

            for (let x = 0; x < columns; x++) {
                const index = x + y * columns;
                const angle = p.noise(xOff, yOff, tOff) * p.TWO_PI;
                const v = Vector.fromAngle(angle);
                v.setMag(0.1);
                flowField[index] = v;

                xOff += noiseIncrement;
                p.stroke(255, 10);
                p.strokeWeight(1);
            }
            yOff += noiseIncrement;
        }

        tOff += 0.02;

        particles.forEach(particle => {
            particle.update();
            particle.show();
            particle.checkEdge();
            particle.follow(flowField);
        });
    };
};

const S160619 = () => <P5Renderer sketch={sketch} />;

export default S160619;
