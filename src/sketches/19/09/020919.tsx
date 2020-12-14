import React from "react";
import type p5 from "p5";

import { P5Renderer } from "Renderers/P5";

const sketch = (p: p5) => {
    const vertexLines: VertexLine3D[] = [];
    let shortestDimension: number;
    let angle = 0;
    let camX = 0;
    let camY = 0;

    class VertexLine3D {
        x: number;
        y: number;
        z: number;
        x2: number;
        y2: number;
        z2: number;
        x3: number;
        y3: number;
        z3: number;
        x4: number;
        y4: number;
        z4: number;

        constructor() {
            this.x = p.random(p.width);
            this.y = p.random(p.height);
            this.z = p.random(-shortestDimension * 2, shortestDimension * 2);
            this.x2 = p.width / 2;
            this.y2 = p.height / 2;
            this.z2 = shortestDimension / 2;
            this.x3 = p.width / 2;
            this.y3 = p.height / 2;
            this.z3 = shortestDimension / 2;
            this.x4 = p.width / 2;
            this.y4 = p.height / 2;
            this.z4 = p.random(-400, 400);
        }

        move() {
            this.x += p.random(-2, 2);
            this.y += p.random(-2, 2);
            this.z += p.random(-2, 2);
            this.x2 += p.random(30, -30);
            this.y2 += p.random(30, -30);
            this.z2 += p.random(30, -30);
            this.x3 += p.random(30, -30);
            this.y3 += p.random(30, -30);
            this.z3 += p.random(30, -30);
            this.x4 = p.mouseX + p.random(8, -8);
            this.y4 = p.mouseY + p.random(8, -8);
            this.z4 += p.random(-20, 20);
        }

        show() {
            p.push();
            p.stroke(p.random(80, 240));
            p.fill(20, 0);
            p.beginShape();
            p.vertex(this.x, this.y);
            p.bezierVertex(
                this.x2,
                this.y2,
                this.z2,
                this.x3,
                this.y3,
                this.z3,
                this.x4,
                this.y4,
                this.z4
            );
            p.endShape();
            p.pop();
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        shortestDimension = Math.min(p.width, p.height);

        p.background(20);
        p.frameRate(10);

        p.noFill();
        p.strokeWeight(2);

        vertexLines.push(new VertexLine3D());
    };

    p.draw = () => {
        p.camera(camX, camY, p.height, p.tan(p.PI / 6), 0, 0, 0, 1, 0);

        p.translate(-(p.width / 2), -(p.height / 2));
        p.background(20);

        vertexLines.forEach(line => {
            line.show();
            line.move();
        });

        if (p.frameCount % 50 === 0) {
            vertexLines.push(new VertexLine3D());
        }

        p.push();
        p.translate(p.width / 2, p.height / 2);
        p.rotateX(angle);
        p.rotateY(angle * 0.3);
        p.rotateZ(angle * 1.2);
        angle += 0.03;

        p.stroke(50);
        p.fill(0, 180);
        p.box(shortestDimension / 3);
        p.pop();

        p.push();
        p.translate(p.width / 2, p.height);
        p.rotateX(p.HALF_PI);
        p.noStroke();
        p.fill(0, 180);
        p.plane(p.width);
        p.pop();
    };

    p.mousePressed = () => {
        vertexLines.push(new VertexLine3D());
    };

    p.mouseMoved = () => {
        camX = p.map(p.mouseX, 0, p.width, -600, 600);
        camY = p.map(p.mouseY, 0, p.height, -150, 150);
    };
};

const S020919 = () => <P5Renderer sketch={sketch} />;

export default S020919;
