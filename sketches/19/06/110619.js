(() => {

    const circles = [];
    const transparentCircles = true;
    const alpha = transparentCircles == true ? 0 : 255;

    class Circle {

        constructor() {
            this.x = width / 2;
            this.y = height / 2;
            this.r = 0;

            this.sizeOffset = 0;
        }

        update() {
            this.sizeOffset += 0.05;
            this.vel = map(noise(this.sizeOffset), 0, 1, -8, 10);
            this.r = this.r + this.vel;

            ellipse(this.x, this.y, this.r);
        }
        
    }




    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);
        stroke(255);
        strokeWeight(2);
        fill(20, alpha);

        circles.push(new Circle());
    };


    draw = () => {
        background(20);

        if (frameCount % 40 == 0) {
            circles.push(new Circle());
        }

        for (let i = 0; i < circles.length; i++) {
            circles[i].update();
        }

        if (circles.length > 80) {
            circles.splice(0, 1);
        }
    };


    mousePressed = () => {
        circles.push(new Circle());
    };

})();

new p5();
