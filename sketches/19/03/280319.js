var particles = [];
var noiseScale = 5000;

var Particle = class Particle {

    constructor(x, y) {
        this.x = random(width);
        this.y = random(height);
        this.dir = createVector(0, 0);
        this.vel = createVector(0, 0);
        this.pos = createVector(this.x, this.y);
        this.speed = 2;
        this.history = [];
    }

	move() {
		const angle = noise(this.pos.x / noiseScale, this.pos.y / noiseScale) * TWO_PI * noiseScale;
		this.dir.x = cos(angle);
		this.dir.y = sin(angle);
		this.vel = this.dir.copy();
		this.vel.mult(this.speed);
		this.pos.add(this.vel);

        const v = createVector(this.pos.x, this.pos.y);
        this.history.push(v);
        if (this.history.length > 70) {
            this.history.splice(0, 1);
        }

        for (let i = 0; i < this.history.length; i++) {
            this.history[i].x += random(-0.5, 0.5);
            this.history[i].y += random(-0.5, 0.5);
        }
	}

	checkEdge() {
		if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
			this.pos.x = random(50, width);
			this.pos.y = random(50, height);
		}
	}

	display(r) {
		ellipse(this.pos.x, this.pos.y, r);

        noFill();
        beginShape();
        for (let i = 0; i < this.history.length; i++) {
            const pos = this.history[i];
            const col = map(i, 0, this.history.length, 75, 200);
            stroke(col);
            vertex(pos.x, pos.y);
        }
        endShape();
	}

};


function setup() {
	createCanvas(windowWidth, windowHeight);

    const initialParticleCount = (width > 450) ? 200 : 100;
	for (let i = 0; i < initialParticleCount; i++) {
		particles[i] = new Particle();
	}
}


function draw() {
	noStroke();
	smooth();
    background(20);

	for (var i = 0; i < particles.length; i++) {
		var radius = 3;

        fill(255);
		particles[i].move();
		particles[i].display(radius);
		particles[i].checkEdge();
	}
}


function mousePressed() {
    frameRate(20);
}


function mouseClicked() {
    frameRate(60);
}


new p5();
