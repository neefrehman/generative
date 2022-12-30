import React from "react";
import type p5 from "p5";

import { P5Renderer } from "Renderers/P5";

const sketch = (p: p5) => {
  const particles: Particle[] = [];
  const noiseScale = 100000;

  class Particle {
    x: number;
    y: number;
    d: number;
    col: number;
    dir: p5.Vector;
    vel: p5.Vector;
    pos: p5.Vector;
    speed: number;
    history: p5.Vector[];

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.d = 36;
      this.col = 255;

      this.dir = p.createVector(0, 0);
      this.vel = p.createVector(0, 0);
      this.pos = p.createVector(this.x, this.y);
      this.speed = p.width > 500 ? 3 : 2;

      this.history = [];
    }

    move() {
      const angle =
        p.noise(this.pos.x / noiseScale, this.pos.y / noiseScale) *
        p.TWO_PI *
        noiseScale;
      this.dir.x = p.cos(angle);
      this.dir.y = p.sin(angle);
      this.vel = this.dir.copy();
      this.vel.mult(this.speed);
      this.pos.add(this.vel);

      if (
        this.pos.x > p.width ||
        this.pos.x < 0 ||
        this.pos.y > p.height ||
        this.pos.y < 0
      ) {
        this.pos.x = p.random(50, p.width);
        this.pos.y = p.random(50, p.height);
      }

      const v = p.createVector(this.pos.x, this.pos.y);
      this.history.push(v);

      if (this.history.length > 70) {
        this.history.splice(0, 1);
      }

      for (let i = 0; i < this.history.length; i++) {
        this.history[i].x += p.random(-2, 2);
        this.history[i].y += p.random(-2, 2);
      }
    }

    display() {
      p.noStroke();
      p.fill(this.col);
      p.ellipse(this.pos.x, this.pos.y, this.d);

      for (let i = 0; i < this.history.length; i++) {
        const pos = this.history[i];
        const col = p.map(i, 0, this.history.length, 75, this.col);
        p.fill(col);
        const d = p.map(i, 0, this.history.length, 1, this.d * 0.9);
        p.ellipse(pos.x, pos.y, d, d);
      }
    }

    isHovered() {
      const d = p.dist(this.pos.x, this.pos.y, p.mouseX, p.mouseY);
      return d - 50 < this.d;
    }

    excite() {
      this.d = 52;
      this.speed = 6;
      this.pos.x += p.random(-25, 25);
      this.pos.y += p.random(-25, 25);
      this.col = 0;
    }

    deExcite() {
      this.d = 36;
      this.speed = p.width > 500 ? 3 : 2;
      this.col = 255;
    }
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    const initialParticleCount = p.width > 450 ? 30 : 15;
    for (let i = 0; i < initialParticleCount; i++) {
      particles.push(new Particle(p.random(p.width), p.random(p.height)));
    }
  };

  p.draw = () => {
    p.background(20);

    particles.forEach(particle => {
      particle.display();
      particle.move();

      if (particle.isHovered()) {
        particle.excite();
      } else {
        particle.deExcite();
      }
    });
  };
};

const S110419 = () => <P5Renderer sketch={sketch} />;

export default S110419;
