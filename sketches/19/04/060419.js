var particles = [];

var Particle = class Particle {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.d = 36;
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

        if (this.x > width || this.x < 0 || this.y > height || this.y < 0) {
            this.x = width / 2;
            this.y = height / 2;
        }

        for (let i = 0; i < this.history.length; i++) {
            this.history[i].x += random(-2, 2);
            this.history[i].y += random(-2, 2);
        }
    }

    display() {
        noStroke();
        fill(255);
        ellipse(this.x, this.y, this.d);

        for (let i = 0; i < this.history.length; i++) {
            const pos = this.history[i];
            const col = map(i, 0, this.history.length, 75, 255);
            fill(col);
            const d = map(i, 0, this.history.length, 1, this.d * 0.9);
            ellipse(pos.x, pos.y, d, d);
        }
    }

};




setup = () => {
    createCanvas(windowWidth, windowHeight);

    for (let i = 0; i < 5; i++) {
        particles.push(new Particle(random(width), random(height)));
    }
};


draw = () => {
    background(20);

    for (const particle of particles) {
        particle.display();
		particle.move();
	}
};


mousePressed = () => {
    particles.push(new Particle(mouseX, mouseY));
};


new p5();
