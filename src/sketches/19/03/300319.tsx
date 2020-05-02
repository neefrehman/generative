import React from "react";
import p5 from "p5";

import P5Wrapper from "../../../components/P5Wrapper";

const sketch = (p: p5) => {
    const particles = [];
    const noiseScale = 20000;

    class Particle {
        x: number;
        y: number;
        dir: p5.Vector;
        vel: p5.Vector;
        pos: p5.Vector;
        speed: number;
        history: p5.Vector[];

        constructor() {
            this.x = p.random(p.width);
            this.y = p.random(p.height);
            this.dir = p.createVector(0, 0);
            this.vel = p.createVector(0, 0);
            this.pos = p.createVector(this.x, this.y);
            this.speed = 2;
            this.history = [];
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

            const v = p.createVector(this.pos.x, this.pos.y);
            this.history.push(v);

            if (this.history.length > 70) {
                this.history.splice(0, 1);
            }
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

        display() {
            p.noFill();
            p.beginShape();
            for (let i = 0; i < this.history.length; i++) {
                const pos = this.history[i];
                const col = p.map(i, 0, this.history.length, 75, 200);
                p.stroke(col);
                p.vertex(pos.x, pos.y);
            }
            p.endShape();
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);

        const initialParticleCount = p.width > 450 ? 200 : 100;
        for (let i = 0; i < initialParticleCount; i++) {
            particles[i] = new Particle();
        }
    };

    p.draw = () => {
        p.noStroke();
        p.smooth();
        p.background(20);

        particles.forEach(particle => {
            p.fill(255);
            particle.move();
            particle.display();
            particle.checkEdge();
        });
    };

    p.mousePressed = () => {
        p.frameRate(20);
    };

    p.mouseClicked = () => {
        p.frameRate(60);
    };
};

const S300319 = () => <P5Wrapper sketch={sketch} />;

export default S300319;
