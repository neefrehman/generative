(() => {
    let shortestDimension;
    let maxRadius;

    const sinePoints = [];
    class SinePoint {
        constructor() {
            this.trailColor = random(255);
            this.yVel = random(0.01, 0.1);
            this.xVel = random(0.01, 0.1);
            this.xAngle = 0;
            this.yAngle = 0;

            this.pos = createVector(width / 2, height / 2);

            this.trail = [];
        }

        move() {
            this.xAngle += this.xVel;
            this.yAngle += this.yVel;

            const v = createVector(this.pos.x, this.pos.y);
            this.trail.push(v);
            if (this.trail.length > 900) {
                this.trail.splice(0, 1);
            }
        }

        show() {
            this.pos.x = width / 2 + maxRadius * sin(this.xAngle);
            this.pos.y = height / 2 + maxRadius * sin(this.yAngle);

            beginShape();
            colorMode(HSB);
            for (let i = 0; i < this.trail.length; i++) {
                const pos = this.trail[i];
                noStroke();
                fill(this.trailColor, 255, 255);
                vertex(pos.x, pos.y);
            }
            colorMode(RGB);
            endShape();
        }
    }

    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);

        shortestDimension = Math.min(width, height);
        maxRadius = (shortestDimension / 2) * 0.75;

        sinePoints.push(new SinePoint());
    };

    draw = () => {
        background(20);

        for (const sinePoint of sinePoints) {
            sinePoint.move();
            sinePoint.show();
        }

        if (frameCount % 900 === 0) {
            sinePoints.push(new SinePoint());
        }

        if (sinePoints.length > 7) {
            sinePoints.splice(0, 1);
        }
    };

    mousePressed = () => {
        sinePoints.push(new SinePoint());
    };
})();
