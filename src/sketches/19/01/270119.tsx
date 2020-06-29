import React from "react";
import p5 from "p5";

import P5Wrapper from "Renderers/P5Wrapper";

const sketch = (p: p5) => {
    const bubbles = [];

    class Bubble {
        x: number;
        y: number;
        r: number;
        speed: number;
        alpha: number;

        constructor(x?: number, y?: number, r?: number) {
            this.x = x || p.random(p.width / 2 + 60, p.width / 2 - 60);
            this.y = y || p.random(p.height / 2 + 60, p.height / 2 - 60);
            this.r = r || 15;
            this.speed = p.width > 450 ? 2 : 1.5;
            this.alpha = 0;
        }

        move() {
            this.x += p.random(-this.speed, this.speed);
            this.y += p.random(-this.speed, this.speed);
        }

        show() {
            p.stroke(255);
            p.strokeWeight(2);
            p.fill(255, this.alpha);
            p.ellipse(this.x, this.y, this.r * 2);
        }

        hovered() {
            const d = p.dist(this.x, this.y, p.mouseX, p.mouseY);
            return d - 15 < this.r;
        }

        collides(sibling: { x: number; y: number; r: number }) {
            const d = p.dist(this.x, this.y, sibling.x, sibling.y);
            return d < this.r + sibling.r;
        }

        excited() {
            this.alpha = 255;
            this.speed = p.width > 450 ? 8 : 6;
        }

        normal() {
            this.alpha = 0;
            this.speed = p.width > 450 ? 2 : 1.5;
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.frameRate(40);
        for (let i = 0; i < 30; i++) {
            bubbles[i] = new Bubble();
        }
    };

    p.draw = () => {
        p.background(20);

        bubbles.forEach(bubble => {
            bubble.move();
            bubble.show();

            if (bubble.hovered()) {
                bubble.excited();
            } else {
                bubble.normal();
            }

            bubbles.forEach(sibling => {
                if (bubble !== sibling && bubble.collides(sibling)) {
                    bubble.excited();
                    sibling.excited();
                }
            });
        });

        if (bubbles.length > 300) {
            bubbles.splice(0, 1);
        }
    };

    p.mousePressed = () => {
        const bubble = new Bubble(p.mouseX, p.mouseY);
        bubbles.push(bubble);
    };

    p.mouseDragged = () => {
        const bubble = new Bubble(p.mouseX, p.mouseY);
        bubbles.push(bubble);
    };
};

const S270119 = () => <P5Wrapper sketch={sketch} />;

export default S270119;
