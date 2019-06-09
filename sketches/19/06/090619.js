(() => {

    const balls = [];

    class Ball {

        constructor(x, y) {
            this.x = x || width / 2;
            this.y = y || height / 2;
            this.r = 0;
            this.distOffset = 0;
            this.isHorizontal = Math.random() >= 0.5;

            this.sizeOffset = 200;

            this.fill = 255;
            this.stroke = 0;
        }

        update() {
            this.distOffset += 0.01;
            this.vel = map(noise(this.distOffset), 0, 1, -18, 18);
            if (this.isHorizontal == true) {
                this.x += this.vel;
            } else {
                this.y += this.vel;
            }

            this.sizeOffset += 0.01;
            this.vel = map(noise(this.sizeOffset), 0, 1, -6, 6);
            this.r = this.r + this.vel;

            stroke(this.stroke);
            fill(this.fill);

            ellipse(this.x, this.y, this.r);
        }

        hovered() {
            const d = dist(this.x, this.y, mouseX, mouseY);
            return (d + 10 < this.r);
        }

        excited() {
            this.fill = 0;
            this.stroke = 255;
        }

        normal() {
            this.fill = 255;
            this.stroke = 0;
        }
        
    }




    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);

        balls[0] = new Ball(width / 2, height / 2);
    };


    draw = () => {
        background(20);

        if (frameCount % 15 == 0) {
            balls.push(new Ball(random(width), random(height)));
        }

        for (let i = 0; i < balls.length; i++) {
            balls[i].update();

            if (balls[i].hovered()) {
                balls[i].excited();
            } else {
                balls[i].normal();
            }
        }

        if (balls.length > 600) {
            balls.splice(0, 1);
        }
    };


    mousePressed = () => {
        balls.push(new Ball(mouseX, mouseY));
    };

})();

new p5();
