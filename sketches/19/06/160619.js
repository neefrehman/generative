(() => {

    let noiseIncrement = 0.05;
    let tOff = 0;

    const scale = 20;
    let columns, rows;

    let flowField = [];

    const particles = [];
    class Particle {

        constructor() {
            this.pos = createVector(random(width), random(height));
            this.vel = createVector(0, 0);
            this.acc = createVector(0, 0);
            this.maxSpeed = 4;
        }

        update() {
            this.vel.add(this.acc);
            this.vel.limit(this.maxSpeed);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }

        follow(vectors) {
            const x = floor(this.pos.x / scale);
            const y = floor(this.pos.y / scale);
            const index = x + y * columns;
            const force = vectors[index];
            this.applyForce(force);
        }

        applyForce(force) {
            this.acc.add(force);
        }

        show() {
            stroke(255);
            strokeWeight(6);
            point(this.pos.x, this.pos.y);
        }

        checkEdge() {
            if (this.pos.x > width) this.pos.x = 0;
            if (this.pos.x < 0) this.pos.x = width;
            if (this.pos.y > height) this.pos.y = 0;
            if (this.pos.y < 0) this.pos.y = height;
        }

    }




    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);
        pixelDensity(1);

        columns = floor(width / scale);
        rows = floor(height / scale);

        flowField = new Array(columns * rows);

        for (let i = 0; i < 300; i++) {
            particles.push(new Particle());
        }
    };


    draw = () => {
        background(20);

        let yOff = 0;
        for (let y = 0; y < rows; y++) {
            let xOff = 0;

            for (let x = 0; x < columns; x++) {
                const index = x + y * columns;
                const angle = noise(xOff, yOff, tOff) * TWO_PI;
                const v = p5.Vector.fromAngle(angle);
                v.setMag(0.1);
                flowField[index] = v;

                xOff += noiseIncrement;
                stroke(255, 10);
                strokeWeight(1);

                // push();
                //     translate(x * scale, y * scale);
                //     rotate(v.heading());
                //     line(0, 0, scale, 0);
                // pop();
            }
            yOff += noiseIncrement;
        }

        tOff += 0.02;

        for (const particle of particles) {
            particle.update();
            particle.show();
            particle.checkEdge();
            particle.follow(flowField);
        }
    };

})();


