(() => {
    let vertexLines = [];

    class VertexLine {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.x2 = width / 2;
            this.y2 = height / 2;
            this.x3 = width / 2;
            this.y3 = height / 2;
            this.x4 = width / 2;
            this.y4 = height / 2;
        }

        move() {
            this.x += random(-2, 2);
            this.y += random(-2, 2);
            this.x2 += random(30, -30);
            this.y2 += random(30, -30);
            this.x3 += random(30, -30);
            this.y3 += random(30, -30);
            this.x4 += random(30, -30);
            this.y4 += random(30, -30);
        }

        show() {
            stroke(random(80, 240));
            beginShape();
            vertex(this.x, this.y);
            bezierVertex(this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
            endShape();
        }
    }

    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);
        frameRate(10);

        noFill();
        strokeWeight(2);

        vertexLines.push(new VertexLine(random(width), random(height)));
    };

    draw = () => {
        background(20);

        for (const line of vertexLines) {
            line.show();
            line.move();
        }

        if (frameCount % 30 === 0) {
            vertexLines.push(new VertexLine(random(width), random(height)));
        }
    };

    mousePressed = () => {
        vertexLines.push(new VertexLine(random(width), random(height)));
    };
})();
