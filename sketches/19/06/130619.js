(() => {

    const balls =[];
    class Ball {

        constructor() {
            this.xOff = random(200);
            this.yOff = random(400, 600);
            this.r = 36;
        }

        update() {
            this.xOff += 0.01;
            this.yOff += 0.01;

            this.x = map(noise(this.xOff), 0, 1, 0, width);
            this.y = map(noise(this.yOff), 0, 1, 0, height);

            ellipse(this.x, this.y, this.r);
        }

        collides(sibling) {
            const d = dist(this.x, this.y, sibling.x, sibling.y);
            return (d < this.r / 2 + sibling.r);
        }

        excited() {
            this.xOff += 0.01;
            this.yOff += 0.01;
        }

    }




    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);

        for (let i = 0; i < 3; i++) {
            balls.push(new Ball());
        }
    };


    draw = () => {
        background(20);

        if (frameCount % 400 == 0) {
            balls.push(new Ball());
        }

        for (const ball of balls) {
            ball.update();

            for (const sibling of balls) {
                if (ball != sibling && ball.collides(sibling)) {
                    ball.excited();
                    sibling.excited();
                }
            }
        }
    };


    mousePressed = () => {
        balls.push(new Ball());
    };

})();
