import React from "react";
import type p5 from "p5";

import { P5Renderer } from "Renderers/P5";

const sketch = (p: p5) => {
  const slices: Slice[] = [];
  class Slice {
    x: number;
    y: number;
    r: number;
    speed: number;
    growth: number;

    constructor(x?: number, y?: number, r?: number) {
      this.x = x || p.random(p.width);
      this.y = y || p.height;
      this.r = r || 30;
      this.speed = 4;
      this.growth = p.width > 450 ? 6 : 3;
    }

    move() {
      this.y -= p.random(this.speed);
      this.r += p.random(-this.growth, this.growth);
    }

    show() {
      p.stroke(255);
      p.strokeWeight(1);
      p.fill(20);
      p.ellipse(this.x, this.y, this.r * 2);
    }

    hovered() {
      const d = p.dist(this.x, this.y, p.mouseX, p.mouseY);
      return d - 15 < this.r;
    }

    excited() {
      this.speed *= 1.2;
      this.growth *= 1.2;
    }

    normal() {
      this.speed = 4;
      this.growth = p.width > 450 ? 4 : 2;
    }
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(20);
    p.frameRate(20);

    const initialSliceCount = Math.floor(p.width / 25);
    for (let i = 0; i < initialSliceCount; i++) {
      slices[i] = new Slice();
    }
  };

  p.draw = () => {
    slices.forEach(slice => {
      slice.move();
      slice.show();

      if (slice.hovered()) {
        slice.excited();
      } else {
        slice.normal();
      }

      if (slice.y < -slice.r) {
        // eslint-disable-next-line no-param-reassign
        slice.y = p.height + slice.r;
      }
    });
  };

  p.mousePressed = () => {
    p.background(20);
  };
};

const S290119 = () => <P5Renderer sketch={sketch} />;

export default S290119;
