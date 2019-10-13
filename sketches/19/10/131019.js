(() => {
    const cells = [];
    class Cell {
        constructor(pos, r, c) {
            this.pos = pos
                ? pos.copy()
                : createVector(random(width / 2), random(height / 2));
            this.r = r || 150;
            this.c = c || random(255);
        }

        move() {
            this.vel = p5.Vector.random2D();
            this.pos.add(this.vel);
            ellipse(this.pos.x, this.pos.y, this.r);
        }

        show() {
            fill(this.c, 0, this.c / 2, 150);
            ellipse(this.pos.x, this.pos.y, this.r);
        }

        clicked(x, y) {
            const d = dist(this.pos.x, this.pos.y, x, y);
            if (d < this.r / 2) {
                return true;
            } else {
                return false;
            }
        }

        divideCell() {
            const newCell = new Cell(this.pos, this.r * 0.8, this.c);
            return newCell;
        }
    }

    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);
        noStroke();

        cells.push(new Cell());
        cells.push(new Cell());
        cells.push(new Cell());
    };

    draw = () => {
        background(20);

        for (const cell of cells) {
            cell.move();
            cell.show();
        }
    };

    mousePressed = () => {
        for (let i = cells.length - 1; i >= 0; i--) {
            if (cells[i].clicked(mouseX, mouseY)) {
                cells.push(cells[i].divideCell());
                cells.push(cells[i].divideCell());
                cells.splice(i, 1);
            }
        }
    };
})();
