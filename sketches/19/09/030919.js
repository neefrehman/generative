(() => {
    let vertexLines = [];
    let shortestDimension;
    let angle = 0;
    let camX = 0,
        camY = 0;

    class VertexLine3D {
        constructor(x, y, z) {
            this.x = x || random(width);
            this.y = y || random(height);
            this.z = z || random(-shortestDimension * 2, shortestDimension * 2);
            this.x2 = width / 2;
            this.y2 = height / 2;
            this.z2 = shortestDimension / 2;
            this.x3 = width / 2;
            this.y3 = height / 2;
            this.z3 = shortestDimension / 2;
            this.x4 = width / 2;
            this.y4 = height / 2;
            this.z4 = random(-400, 400);
        }

        move() {
            this.x += random(-2, 2);
            this.y += random(-2, 2);
            this.z += random(-2, 2);
            this.x2 += random(30, -30);
            this.y2 += random(30, -30);
            this.z2 += random(30, -30);
            this.x3 = mouseX + random(8, -8);
            this.y3 = mouseY + random(8, -8);
            this.z3 += random(30, -30);
            this.x4 += random(30, -30);
            this.y4 += random(30, -30);
            this.z4 += random(-30, 30);
        }

        show() {
            push();
            stroke(random(80, 240));
            beginShape();
            vertex(this.x, this.y);
            bezierVertex(
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
            endShape();
            pop();
        }
    }

    setup = () => {
        createCanvas(windowWidth, windowHeight, WEBGL);
        shortestDimension = Math.min(width, height);

        background(20);
        frameRate(10);

        noFill();
        strokeWeight(2);

        vertexLines.push(new VertexLine3D());
    };

    draw = () => {
        camera(camX, camY, height, tan(PI / 6), 0, 0, 0, 1, 0);

        translate(-(width / 2), -(height / 2));
        background(20);

        for (const line of vertexLines) {
            line.show();
            line.move();
        }

        if (frameCount % 50 === 0) {
            vertexLines.push(new VertexLine3D());
        }

        push();
        translate(width / 2, height / 2);
        rotateX(angle);
        rotateY(angle * 0.3);
        rotateZ(angle * 1.2);
        angle += 0.03;

        stroke(50);
        fill(0, 180);
        box(shortestDimension / 3);
        pop();

        push();
        translate(width / 2, height);
        rotateX(HALF_PI);
        noStroke();
        fill(0, 180);
        plane(width);
        pop();
    };

    mousePressed = () => {
        vertexLines.push(new VertexLine3D());
    };

    mouseMoved = () => {
        camX = map(mouseX, 0, width, -500, 500);
        camY = map(mouseY, 0, height, -150, 150);
    };
})();
