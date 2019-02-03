var particles_a = [];
var particles_b = [];
var particles_c = [];
var noiseScale = 1000;

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
	background(20);

    const initialParticleCount = (width > 450) ? 200 : 100;
	for (let i = 0; i < initialParticleCount; i++) {
		particles_a[i] = new Particle();
		particles_b[i] = new Particle();
		particles_c[i] = new Particle();
	}
}

function draw() {
	noStroke();
	smooth();

	for (var i = 0; i < particles_a.length; i++) {
		var radius = map(i, 0, particles_a.length, 1, 2);
		var alpha = map(i, 0, particles_a.length, 0, 250);

		fill(69, 33, 124, alpha);
		particles_a[i].move();
		particles_a[i].display(radius);
		particles_a[i].checkEdge();

		fill(7, 153, 242, alpha);
		particles_b[i].move();
		particles_b[i].display(radius);
		particles_b[i].checkEdge();

		fill(255, 255, 255, alpha);
		particles_c[i].move();
		particles_c[i].display(radius);
		particles_c[i].checkEdge();
	}
}

function mousePressed() {
    frameRate(20);
}

function mouseClicked() {
    frameRate(60);
}

new p5();
