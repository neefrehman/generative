import React from "react";
import type p5 from "p5";

import { P5Renderer } from "Renderers/P5";

const sketch = (p: p5) => {
  let cols: number;
  let rows: number;
  const scale = 20;

  const terrain: number[][] = [];

  let flying = 0;
  const noisiness = 0.15;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.background(20);
    p.frameRate(24);
    p.stroke(255);
    p.strokeWeight(0.5);
    p.noFill();

    cols = p.windowWidth / scale;
    rows = p.windowHeight / scale;
  };

  p.draw = () => {
    flying -= noisiness;
    let yOff = 0;
    for (let x = 0; x < rows; x++) {
      terrain[x] = [];
      let xOff = flying;
      for (let y = 0; y < cols; y++) {
        terrain[x][y] = p.map(p.noise(xOff, yOff), 0, 1, -100, 100);
        xOff += noisiness;
      }
      yOff += noisiness;
    }

    p.background(20);

    p.rotateX(p.PI / 3);
    p.translate(-p.width / 2, -p.height / 2);

    for (let y = 0; y < rows - 1; y++) {
      p.beginShape(p.TRIANGLE_STRIP);
      for (let x = 0; x < cols; x++) {
        p.vertex(x * scale, y * scale, terrain[y][x]);
      }
      p.endShape();
    }
  };
};

const S161019 = () => <P5Renderer sketch={sketch} />;

export default S161019;
