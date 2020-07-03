import React from "react";
import p5 from "p5";

import { P5Wrapper } from "Renderers/P5Wrapper";

const sketch = (p: p5) => {
    const spores = [];
    class Spore {
        x: number;
        y: number;
        r: number;
        speed: number;
        color: number;
        colorChangeRate: number;

        constructor(x?: number, y?: number, r?: number) {
            this.x = x || p.random(p.width / 2 + 30, p.width / 2 - 30);
            this.y = y || p.random(p.height / 2 + 30, p.height / 2 - 30);
            this.r = r || 17;
            this.speed = p.width > 450 ? 3.5 : 2.5;
            this.color = 255;
            this.colorChangeRate = -0.3 + p.random(0.004);
        }

        move() {
            this.x += p.random(-this.speed, this.speed);
            this.y += p.random(-this.speed, this.speed);
            this.color += this.colorChangeRate;

            if (this.color <= -5) {
                this.colorChangeRate = -this.colorChangeRate;
            } else if (this.color >= 260) {
                this.colorChangeRate = -this.colorChangeRate;
            }
        }

        show() {
            p.noStroke();
            p.fill(this.color, this.color, this.color);
            p.ellipse(this.x, this.y, this.r * 2);
        }

        collides(sibling: { x: number; y: number; r: number }) {
            const d = p.dist(this.x, this.y, sibling.x, sibling.y);
            return d < this.r + sibling.r;
        }

        excited() {
            this.speed = p.width > 450 ? 6 : 4;
        }

        normal() {
            this.speed = p.width > 450 ? 3.5 : 2.5;
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);
        p.frameRate(40);

        const initialSporeCount = p.width > 450 ? 50 : 40;
        for (let i = 0; i < initialSporeCount; i++) {
            spores[i] = new Spore();
        }
    };

    p.draw = () => {
        spores.forEach(spore => {
            spore.move();
            spore.show();

            spores.forEach(sibling => {
                if (spore !== sibling && spore.collides(sibling)) {
                    spore.excited();
                    sibling.excited();
                } else {
                    spore.normal();
                    sibling.normal();
                }
            });
        });

        if (spores.length > 500) {
            spores.splice(0, 1);
        }
    };

    p.mousePressed = () => {
        const spore = new Spore(p.mouseX, p.mouseY);
        spores.push(spore);
    };

    p.mouseDragged = () => {
        const spore = new Spore(p.mouseX, p.mouseY);
        spores.push(spore);
    };
};

const S280119 = () => <P5Wrapper sketch={sketch} />;

export default S280119;
