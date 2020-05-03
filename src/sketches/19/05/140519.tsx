import React from "react";
import p5 from "p5";

import P5Wrapper from "../../../components/P5Wrapper";

const sketch = (p: p5) => {
    let graphics;
    const graphicsSize = 200;

    const particles = [];

    class Particle {
        x: number;
        y: number;
        d: number;
        history: p5.Vector[];

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
            this.d = 12;
            this.history = [];
        }

        move() {
            this.x += p.random(-8, 8);
            this.y += p.random(-8, 8);

            const v = p.createVector(this.x, this.y);
            this.history.push(v);

            if (this.history.length > 100) {
                this.history.splice(0, 1);
            }

            if (
                this.x > graphicsSize ||
                this.x < 0 ||
                this.y > graphicsSize ||
                this.y < 0
            ) {
                this.x = graphicsSize / 2;
                this.y = graphicsSize / 2;
            }

            for (let i = 0; i < this.history.length; i++) {
                this.history[i].x += p.random(-2, 2);
                this.history[i].y += p.random(-2, 2);
            }
        }

        display() {
            graphics.noStroke();
            graphics.fill(255);
            graphics.ellipse(this.x, this.y, this.d);

            for (let i = 0; i < this.history.length; i++) {
                const pos = this.history[i];
                const col = p.map(i, 0, this.history.length, 75, 255);
                graphics.fill(col);
                const d = p.map(i, 0, this.history.length, 1, this.d * 0.9);
                graphics.ellipse(pos.x, pos.y, d, d);
            }
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        graphics = p.createGraphics(graphicsSize, graphicsSize);
        graphics.background(20);

        for (let i = 0; i < 5; i++) {
            particles.push(
                new Particle(p.random(graphicsSize), p.random(graphicsSize))
            );
        }
    };

    p.draw = () => {
        for (let x = 0; x < p.width; x += 200) {
            for (let y = 0; y < p.height; y += 200) {
                p.image(graphics, x, y);
            }
        }

        particles.forEach(particle => {
            particle.display();
            particle.move();
        });
    };

    p.mousePressed = () => {
        particles.push(new Particle(p.mouseX, p.mouseY));
    };
};

const S140519 = () => <P5Wrapper sketch={sketch} />;

export default S140519;
