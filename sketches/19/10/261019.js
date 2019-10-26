(() => {
    let shortestDimension;
    let maxRadius;

    const sinePoints = [];
    class SinePoint {
        constructor() {
            this.yVel = random(0.005, 0.1);
            this.xVel = random(0.005, 0.1);
            this.xAngle = 0;
            this.yAngle = 0;
        }

        move() {
            this.xAngle += this.xVel;
            this.yAngle += this.yVel;
        }

        show() {
            const x = width / 2 + maxRadius * sin(this.xAngle);
            const y = height / 2 + maxRadius * sin(this.yAngle);
            ellipse(x, y, 12);
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

        if (frameCount % 400 === 0) {
            sinePoints.push(new SinePoint());
        }

        if (sinePoints.length > 30) {
            sinePoints.splice(0, 1);
        }
    };

    mousePressed = () => {
        sinePoints.push(new SinePoint());
    };
})();
