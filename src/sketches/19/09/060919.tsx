import React from "react";
import p5 from "p5/lib/p5.min";

import P5Wrapper from "../../../components/P5Wrapper";

const sketch = (p: p5) => {
    const blocks = [];
    let shortestDimension: number;
    let camX = 0;
    let camY = 0;

    class Block {
        x: number;
        y: number;
        z: number;
        width: number;
        height: number;
        depth: number;
        r: number;
        g: number;
        b: number;
        speed: number;
        accel: number;
        direction: number[];

        constructor() {
            this.x = p.random(shortestDimension);
            this.y = p.random(shortestDimension);
            this.z = p.random(shortestDimension);

            this.width = p.random(shortestDimension / 5);
            this.height = p.random(shortestDimension / 5);
            this.depth = p.random(shortestDimension / 5);

            this.r = p.random(255);
            this.g = p.random(255);
            this.b = p.random(255);

            this.speed = p.random([-1, 1]) * 0.7;
            this.accel = 1;
            this.direction = p.random([
                [this.speed, 0, 0],
                [0, this.speed, 0],
                [0, 0, this.speed]
            ]);
        }

        move() {
            this.x += this.direction[0] * this.accel;
            this.y += this.direction[1] * this.accel;
            this.z += this.direction[2] * this.accel;
            this.accel += 0.1;
        }

        show() {
            p.push();
            p.translate(this.x, this.y, this.z);
            p.ambientMaterial(this.r, this.g, this.b);
            p.box(this.width, this.height, this.depth);
            p.pop();
        }

        changeDirection() {
            this.speed = 0;
            this.accel = 1;
            this.direction = p.random([
                [this.speed, 0, 0],
                [0, this.speed, 0],
                [0, 0, this.speed]
            ]);
            setTimeout(() => {
                this.speed = p.random([-1, 1]) * 0.7;
                this.direction = p.random([
                    [this.speed, 0, 0],
                    [0, this.speed, 0],
                    [0, 0, this.speed]
                ]);
            }, 250);
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        shortestDimension = Math.min(p.width, p.height);

        p.background(20);
        p.frameRate(20);

        p.noStroke();
        p.strokeWeight(2);

        for (let i = 0; i < 40; i++) {
            blocks.push(new Block());
        }
    };

    p.draw = () => {
        p.camera(
            camX,
            camY,
            shortestDimension * 2.2,
            p.tan(p.PI / 6),
            0,
            0,
            0,
            1,
            0
        );

        p.translate(-p.width / 2, -p.height / 2);
        p.background(20);

        p.pointLight(255, 255, 255, -200, 0, 0);
        p.pointLight(255, 255, 255, 200, 0, 0);
        p.pointLight(255, 255, 255, 0, -200, 0);
        p.pointLight(255, 255, 255, 0, 0, 2000);

        blocks.forEach(block => {
            if (p.frameCount % 40 === 0) {
                block.changeDirection();
            }

            block.show();
            block.move();
        });
    };

    p.mousePressed = () => {
        blocks.forEach(block => block.changeDirection());
    };

    p.mouseMoved = () => {
        camX = p.map(p.mouseX, 0, p.width, -200, 200);
        camY = p.map(p.mouseY, 0, p.height, -200, 200);
    };
};

const S060919 = () => <P5Wrapper sketch={sketch} />;

export default S060919;
