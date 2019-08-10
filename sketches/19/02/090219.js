(() => {
    const particles = [];
    const noiseScale = 20000;

    class Particle {
        constructor(x, y) {
            this.x = random(width);
            this.y = random(height);
            this.dir = createVector(0, 0);
            this.vel = createVector(0, 0);
            this.pos = createVector(this.x, this.y);
            this.speed = 0.3;
        }

        move() {
            const angle =
                noise(this.pos.x / noiseScale, this.pos.y / noiseScale) *
                TWO_PI *
                noiseScale;
            this.dir.x = cos(angle);
            this.dir.y = sin(angle);
            this.vel = this.dir.copy();
            this.vel.mult(this.speed);
            this.pos.add(this.vel);
        }

        checkEdge() {
            if (
                this.pos.x > width ||
                this.pos.x < 0 ||
                this.pos.y > height ||
                this.pos.y < 0
            ) {
                this.pos.x = random(50, width);
                this.pos.y = random(50, height);
            }
        }

        display(r) {
            ellipse(this.pos.x, this.pos.y, r);
        }
    }

    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);

        const initialParticleCount = width > 450 ? 600 : 300;
        for (let i = 0; i < initialParticleCount; i++) {
            particles[i] = new Particle();
        }
    };

    draw = () => {
        noStroke();
        smooth();

        for (var i = 0; i < particles.length; i++) {
            const radius = map(i, 0, particles.length, 1, 2);
            const alpha = map(i, 0, particles.length, 0, 250);

            fill(255, 255, 255, alpha);
            particles[i].move();
            particles[i].display(radius);
            particles[i].checkEdge();
        }
    };

    mousePressed = () => {
        frameRate(20);
    };

    mouseClicked = () => {
        frameRate(60);
    };
})();
