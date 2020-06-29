import React from "react";
import p5 from "p5";

import P5Wrapper from "Renderers/P5Wrapper";

const sketch = (p: p5) => {
    const vibrations = [];

    class Particle {
        x: number;
        y: number;
        history: p5.Vector[];

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
            this.history = [];
        }

        update() {
            this.x += p.random(-12, 12);
            this.y += p.random(-12, 12);

            const v = p.createVector(this.x, this.y);
            this.history.push(v);

            if (this.history.length > 100) {
                this.history.splice(0, 1);
            }

            if (
                this.x > p.width ||
                this.x < 0 ||
                this.y > p.height ||
                this.y < 0
            ) {
                this.x = p.width / 2;
                this.y = p.height / 2;
            }

            for (let i = 0; i < this.history.length; i++) {
                this.history[i].x += p.random(-2, 2);
                this.history[i].y += p.random(-2, 2);
            }
        }

        show() {
            p.beginShape();
            for (let i = 0; i < this.history.length; i++) {
                const pos = this.history[i];
                const col = p.map(i, 0, this.history.length, 75, 200);
                p.noStroke();
                p.fill(col);
                p.vertex(pos.x, pos.y);
            }
            p.endShape();
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);

        for (let i = 0; i < 5; i++) {
            vibrations.push(
                new Particle(p.random(p.width), p.random(p.height))
            );
        }
    };

    p.draw = () => {
        p.background(20);

        vibrations.forEach(vibration => {
            vibration.show();
            vibration.update();
        });
    };

    p.mousePressed = () => {
        vibrations.push(new Particle(p.mouseX, p.mouseY));
    };
};

const S260319 = () => <P5Wrapper sketch={sketch} />;

export default S260319;
