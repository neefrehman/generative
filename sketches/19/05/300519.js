(() => {

    const balls = [];
    class Ball {

        constructor(x, y, r) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.xoff = 0;
        }

        update() {
            this.xoff += 0.01;
            this.x += this.xoff;

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

        for (let i = 0; i < balls.length; i++) {
            balls[i].update();
        }
    };

    mousePressed = () => {
        balls.push(new Ball(mouseX, mouseY, 36));
    };

    mouseDragged = () => {
        balls.push(new Ball(mouseX, mouseY, 36));
    };

})(); new p5();
