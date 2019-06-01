(() => {

    const balls = [];
    let xoff = 0;

    class Ball {

        constructor(x, y, r) {
            this.x = x;
            this.y = y;
            this.r = r;
        }

        update() {
            const x = map(noise(xoff), 0, 1, -20, 20);
            this.x += x;

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

        xoff+= 0.01;

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

})(); new p5();
