(() => {

    let particles = [];
    let particleGenerationRate;
    class Particle {

        constructor() {
            this.x = random(width);
            this.y = height + 8;
            this.vx = 0;
            this.vy = random(-4, -1);
            this.alpha = 255;
        }

        finished() {
            return this.alpha < 0 || this.y < -8;
        }

        move() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 1;
        }

        show() {
            noStroke();
            fill(255, this.alpha);
            ellipse(this.x, this.y, 16);
        }

    }




    setup = () => {
        createCanvas(windowWidth, windowHeight);
        smooth();

        particleGenerationRate = (width > 800) ? 5 : 3;
    };


    draw = () => {
        background(20);

        for (let i = 0; i < particleGenerationRate; i++) {
            const p = new Particle();
            particles.push(p);
        }

        for (const particle of particles) {
            particle.move();
            particle.show();
        }

        particles = particles.filter(p => !p.finished());
    };


    mousePressed = () => {
        frameRate(20);
    };


    mouseClicked = () => {
        frameRate(60);
    };

})();
