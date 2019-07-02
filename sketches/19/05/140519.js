(() => {

    let graphics;
    const graphicsSize = 200;

    const particles = [];

    class Particle {

        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.d = 12;
            this.history = [];
        }

        move() {
            this.x = this.x + random(-8, 8);
            this.y = this.y + random(-8, 8);

            const v = createVector(this.x, this.y);
            this.history.push(v);

            if (this.history.length > 100) {
                this.history.splice(0, 1);
            }

            if (this.x > graphicsSize || this.x < 0 || this.y > graphicsSize || this.y < 0) {
                this.x = graphicsSize / 2;
                this.y = graphicsSize / 2;
            }

            for (let i = 0; i < this.history.length; i++) {
                this.history[i].x += random(-2, 2);
                this.history[i].y += random(-2, 2);
            }
        }

        display() {
            graphics.noStroke();
            graphics.fill(255);
            graphics.ellipse(this.x, this.y, this.d);

            for (let i = 0; i < this.history.length; i++) {
                const pos = this.history[i];
                const col = map(i, 0, this.history.length, 75, 255);
                graphics.fill(col);
                const d = map(i, 0, this.history.length, 1, this.d * 0.9);
                graphics.ellipse(pos.x, pos.y, d, d);
            }
        }

    }




    setup = () => {
        createCanvas(windowWidth, windowHeight);
        graphics = createGraphics(graphicsSize, graphicsSize);
        graphics.background(20);

        for (let i = 0; i < 5; i++) {
            particles.push(new Particle(random(graphicsSize), random(graphicsSize)));
        }
    };


    draw = () => {
        for (let x = 0; x < width; x += 200) {
            for (let y = 0; y < height; y += 200) {
                image(graphics, x, y);
            }
        }

        for (const particle of particles) {
            particle.display();
            particle.move();
        }
    };


    mousePressed = () => {
        particles.push(new Particle(mouseX, mouseY));
    };

})();
