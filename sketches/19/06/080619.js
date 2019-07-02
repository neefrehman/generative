(() => {

    const balls = [];

    class Ball {

        constructor(x, y, r) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.offset = 0;
            this.isHorizontal = Math.random() >= 0.5;
        }

        update() {
            this.offset += 0.01;
            this.vel = map(noise(this.offset), 0, 1, -18, 18);
            if (this.isHorizontal == true) {
                this.x += this.vel;
            } else {
                this.y += this.vel;
            }

            ellipse(this.x, this.y, this.r);
        }
        
    }




    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);

        balls[0] = new Ball(width / 2, height / 2, 36);
    };


    draw = () => {
        background(20);

        if (frameCount % 15 == 0) {
            balls.push(new Ball(random(width), random(height), 36));
        }

        for (let i = 0; i < balls.length; i++) {
            balls[i].update();
        }

        if (balls.length > 1000) {
            balls.splice(0, 1);
        }
    };


    mousePressed = () => {
        balls.push(new Ball(mouseX, mouseY, 36));
    };


    mouseDragged = () => {
        balls.push(new Ball(mouseX, mouseY, 36));
    };

})();