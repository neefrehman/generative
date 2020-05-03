// From The Coding Train
// https://www.youtube.com/watch?v=mhjuuHl6qHM&list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH&index=179

import React from "react";
import p5 from "p5/lib/p5.min";

import P5Wrapper from "../../../components/P5Wrapper";

const sketch = (p: p5) => {
    let alignValue = 1.5;
    let cohesionValue = 1;
    let separationValue = 2;

    class Boid {
        position: p5.Vector;
        velocity: p5.Vector;
        acceleration: p5.Vector;
        maxForce: number;
        maxSpeed: number;

        constructor() {
            this.position = p.createVector(
                p.random(p.width),
                p.random(p.height)
            );
            this.velocity = p5.Vector.random2D();
            this.velocity.setMag(p.random(2, 4));
            this.acceleration = p.createVector();
            this.maxForce = 0.2;
            this.maxSpeed = 5;
        }

        edges() {
            if (this.position.x > p.width) {
                this.position.x = 0;
            } else if (this.position.x < 0) {
                this.position.x = p.width;
            }
            if (this.position.y > p.height) {
                this.position.y = 0;
            } else if (this.position.y < 0) {
                this.position.y = p.height;
            }
        }

        align(boids: Boid[]) {
            const perceptionRadius = 25;
            const steering = p.createVector();
            let total = 0;
            boids.forEach(other => {
                const d = p.dist(
                    this.position.x,
                    this.position.y,
                    other.position.x,
                    other.position.y
                );
                if (other !== this && d < perceptionRadius) {
                    steering.add(other.velocity);
                    total += 1;
                }
            });
            if (total > 0) {
                steering.div(total);
                steering.setMag(this.maxSpeed);
                steering.sub(this.velocity);
                steering.limit(this.maxForce);
            }
            return steering;
        }

        separation(boids: Boid[]) {
            const perceptionRadius = 24;
            const steering = p.createVector();
            let total = 0;
            boids.forEach(other => {
                const d = p.dist(
                    this.position.x,
                    this.position.y,
                    other.position.x,
                    other.position.y
                );
                if (other !== this && d < perceptionRadius) {
                    const diff = p5.Vector.sub(this.position, other.position);
                    diff.div(d * d);
                    steering.add(diff);
                    total += 1;
                }
            });
            if (total > 0) {
                steering.div(total);
                steering.setMag(this.maxSpeed);
                steering.sub(this.velocity);
                steering.limit(this.maxForce);
            }
            return steering;
        }

        cohesion(boids: Boid[]) {
            const perceptionRadius = 50;
            const steering = p.createVector();
            let total = 0;
            boids.forEach(other => {
                const d = p.dist(
                    this.position.x,
                    this.position.y,
                    other.position.x,
                    other.position.y
                );
                if (other !== this && d < perceptionRadius) {
                    steering.add(other.position);
                    total += 1;
                }
            });
            if (total > 0) {
                steering.div(total);
                steering.sub(this.position);
                steering.setMag(this.maxSpeed);
                steering.sub(this.velocity);
                steering.limit(this.maxForce);
            }
            return steering;
        }

        flock(boids: Boid[]) {
            const alignment = this.align(boids);
            const cohesion = this.cohesion(boids);
            const separation = this.separation(boids);

            alignment.mult(alignValue);
            cohesion.mult(cohesionValue);
            separation.mult(separationValue);

            this.acceleration.add(alignment);
            this.acceleration.add(cohesion);
            this.acceleration.add(separation);
        }

        update() {
            this.position.add(this.velocity);
            this.velocity.add(this.acceleration);
            this.velocity.limit(this.maxSpeed);
            this.acceleration.mult(0);
        }

        show() {
            p.strokeWeight(5);
            p.stroke(255);
            p.point(this.position.x, this.position.y);
        }
    }

    const flock = [];

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        for (let i = 0; i < 200; i++) flock.push(new Boid());
    };

    p.draw = () => {
        p.background(20);
        flock.forEach(boid => {
            boid.edges();
            boid.flock(flock);
            boid.update();
            boid.show();
        });

        if (p.frameCount % 240 === 0) {
            alignValue = p.random(2);
            cohesionValue = p.random(2);
            separationValue = p.random(2);
        }
    };

    p.mousePressed = () => {
        cohesionValue = 1.7;
        separationValue = 0.3;
    };

    p.mouseReleased = () => {
        cohesionValue = 0.3;
        separationValue = 1.7;
    };
};

const S171119 = () => <P5Wrapper sketch={sketch} />;

export default S171119;
