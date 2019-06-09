(() => {

    const balls =[];
    class Ball {

        constructor() {
            this.xOff = random(200);
            this.yOff = random(400, 600);
        }

        update() {
            this.xOff += 0.01;
            this.yOff += 0.01;

            this.x = map(noise(this.xOff), 0, 1, 0, width);
            this.y = map(noise(this.yOff), 0, 1, 0, height);

            ellipse(this.x, this.y, 36);
        }

    }




    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);

        balls.push(new Ball());
    };


    draw = () => {
        background(20);

        if (frameCount % 400 == 0) {
            balls.push(new Ball());
        }

        for (let i = 0; i < balls.length; i++) {
            balls[i].update();
        }
    };


    mousePressed = () => {
        balls.push(new Ball());
    };

})();

new p5();
