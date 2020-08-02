import React from "react";
import p5 from "p5";

import { P5Renderer } from "Renderers/P5";

const sketch = (p: p5) => {
    const cells: Cell[] = [];
    class Cell {
        pos: p5.Vector;
        r: number;
        c: number;
        vel: p5.Vector;

        constructor(pos?: p5.Vector, r?: number, c?: number) {
            this.pos = pos
                ? pos.copy()
                : p.createVector(p.random(p.width), p.random(p.height));
            this.r = r || 150;
            this.c = c || p.random(255);
        }

        move() {
            this.vel = p5.Vector.random2D();
            this.pos.add(this.vel);
            p.ellipse(this.pos.x, this.pos.y, this.r);
        }

        show() {
            p.fill(this.c, 0, this.c / 2, 150);
            p.ellipse(this.pos.x, this.pos.y, this.r);
        }

        clicked(x: number, y: number) {
            const d = p.dist(this.pos.x, this.pos.y, x, y);
            if (d < this.r / 2) {
                return true;
            }
            return false;
        }

        divideCell() {
            const newCell = new Cell(this.pos, this.r * 0.8, this.c);
            return newCell;
        }
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(20);
        p.noStroke();

        cells.push(new Cell());
        cells.push(new Cell());
        cells.push(new Cell());
    };

    p.draw = () => {
        p.background(20);

        cells.forEach(cell => {
            cell.move();
            cell.show();
        });

        if (p.frameCount % 300 === 0) {
            const randomCellIndex = p.floor(p.random(cells.length));
            cells.push(cells[randomCellIndex].divideCell());
            cells.push(cells[randomCellIndex].divideCell());
            cells.splice(randomCellIndex, 1);
        }

        if (p.frameCount % 400 === 0) {
            cells.push(new Cell());
        }
    };

    p.mousePressed = () => {
        for (let i = cells.length - 1; i >= 0; i--) {
            if (cells[i].clicked(p.mouseX, p.mouseY)) {
                cells.push(cells[i].divideCell());
                cells.push(cells[i].divideCell());
                cells.splice(i, 1);
            }
        }
    };
};

const S131019 = () => <P5Renderer sketch={sketch} />;

export default S131019;
