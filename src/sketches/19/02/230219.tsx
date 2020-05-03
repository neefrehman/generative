import React from "react";
import p5 from "p5";

import P5Wrapper from "../../../components/P5Wrapper";

const sketch = (p: p5) => {
    const particles = [];
    let noiseScale = 0;

    class Particle {
        x: number;
        y: number;
        dir: p5.Vector;
        vel: p5.Vector;
        pos: p5.Vector;
        speed: number;

        constructor() {
            this.x = p.random(p.width);
            this.y = p.random(p.height);
            this.dir = p.createVector(0, 0);
            this.vel = p.createVector(0, 0);
            this.pos = p.createVector(this.x, this.y);
            this.speed = 0.5;
        }

        move() {
            const angle =
                p.noise(this.pos.x / noiseScale, this.pos.y / noiseScale) *
                p.TWO_PI *
                noiseScale;
            this.dir.x = p.cos(angle);
            this.dir.y = p.sin(angle);
            this.vel = this.dir.copy();
            this.vel.mult(this.speed);
            this.pos.add(this.vel);
        }

        checkEdge() {
            if (
                this.pos.x > p.width ||
                this.pos.x < 0 ||
                this.pos.y > p.height ||
                this.pos.y < 0
            ) {
                this.pos.x = p.random(50, p.width);
                this.pos.y = p.random(50, p.height);
            }
        }

        display(r: number) {
            p.ellipse(this.pos.x, this.pos.y, r);
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);

        const initialParticleCount = p.width > 450 ? 600 : 300;
        for (let i = 0; i < initialParticleCount; i++) {
            particles[i] = new Particle();
        }
    };

    p.draw = () => {
        p.noStroke();
        p.smooth();

        noiseScale -= 10;

        for (let i = 0; i < particles.length; i++) {
            const radius = p.map(i, 0, particles.length, 1, 2);
            const alpha = p.map(i, 0, particles.length, 0, 250);

            p.fill(255, 255, 255, alpha);
            particles[i].move();
            particles[i].display(radius);
            particles[i].checkEdge();
        }
    };

    p.mousePressed = () => {
        p.frameRate(20);
    };

    p.mouseClicked = () => {
        p.frameRate(60);
    };
};

const S230219 = () => <P5Wrapper sketch={sketch} />;

export default S230219;
