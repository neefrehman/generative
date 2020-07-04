import React from "react";
import p5 from "p5";

import { P5Wrapper } from "Renderers/P5Wrapper";

const sketch = (p: p5) => {
    const vertexLines: VertexLine[] = [];

    class VertexLine {
        x: number;
        y: number;
        x2: number;
        y2: number;
        x3: number;
        y3: number;
        x4: number;
        y4: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
            this.x2 = p.width / 2;
            this.y2 = p.height / 2;
            this.x3 = p.width / 2;
            this.y3 = p.height / 2;
            this.x4 = p.width / 2;
            this.y4 = p.height / 2;
        }

        move() {
            this.x += p.random(-2, 2);
            this.y += p.random(-2, 2);
            this.x2 += p.random(30, -30);
            this.y2 += p.random(30, -30);
            this.x3 += p.random(30, -30);
            this.y3 += p.random(30, -30);
            this.x4 = p.mouseX + p.random(3, -3);
            this.y4 = p.mouseY + p.random(3, -3);
        }

        show() {
            p.stroke(p.random(80, 240));
            p.beginShape();
            p.vertex(this.x, this.y);
            p.bezierVertex(
                this.x2,
                this.y2,
                this.x3,
                this.y3,
                this.x4,
                this.y4
            );
            p.endShape();
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);
        p.frameRate(10);

        p.noFill();
        p.strokeWeight(2);

        vertexLines.push(new VertexLine(p.random(p.width), p.random(p.height)));
    };

    p.draw = () => {
        p.background(20);

        vertexLines.forEach(line => {
            line.show();
            line.move();
        });

        if (p.frameCount % 40 === 0) {
            vertexLines.push(
                new VertexLine(p.random(p.width), p.random(p.height))
            );
        }
    };

    p.mousePressed = () => {
        vertexLines.push(new VertexLine(p.random(p.width), p.random(p.height)));
    };
};

const S010919 = () => <P5Wrapper sketch={sketch} />;

export default S010919;
