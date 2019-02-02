// Forked from yasai on openprocessing.org: openprocessing.org/user/111178

var particles = [];
var initialParticleCount = 800;
var noiseScale = 500;

var Particle = class Particle {

    constructor(x, y) {
        this.x = random(width);
        this.y = random(height);
        this.dir = createVector(0, 0);
        this.vel = createVector(0, 0);
        this.pos = createVector(this.x, this.y);
        this.speed = 0.4;
    }

	move() {
		const angle = noise(this.pos.x / noiseScale, this.pos.y / noiseScale) * TWO_PI * noiseScale;
		this.dir.x = cos(angle);
		this.dir.y = sin(angle);
		this.vel = this.dir.copy();
		this.vel.mult(this.speed);
		this.pos.add(this.vel);
	}

	checkEdge() {
		if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
			this.pos.x = random(50, width);
			this.pos.y = random(50, height);
		}
	}

	display(r) {
		ellipse(this.pos.x, this.pos.y, r);
	}

};

function setup() {
	createCanvas(windowWidth, windowHeight);

	for (var i = 0; i < initialParticleCount; i++) {
		particles[i] = new Particle();
	}
}

function draw() {
	noStroke();
	smooth();
    background(20);

	for (var i = 0; i < initialParticleCount; i++) {
		var radius = map(i, 0, initialParticleCount, 1, 3);
		var alpha = map(i, 0, initialParticleCount, 0, 250);

        fill(255, 255, 255, alpha);
		particles[i].move();
		particles[i].display(radius);
		particles[i].checkEdge();
	}
}

new p5();
