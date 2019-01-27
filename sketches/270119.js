var bubbles = [];
var Bubble = class Bubble {

  constructor(x, y, r) {
    this.x = x || random((windowWidth / 2) + 60, (windowWidth / 2) - 60);
    this.y = y || random((windowHeight / 2) + 60, (windowHeight / 2) - 60);
    this.r = r || 15;
    this.alpha = 0;
    this.speed = 2;
  }

  move() {
    this.x = this.x + random(-this.speed, this.speed);
    this.y = this.y + random(-this.speed, this.speed);
  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill(255, this.alpha);
    ellipse(this.x, this.y, this.r * 2);
  }

  hovered() {
    const d = dist(mouseX, mouseY, this.x, this.y);
    return (d - 15 < this.r);
  }

  intersects(other) {
    const d = dist(this.x, this.y, other.x, other.y);
    return (d < this.r + other.r);
  }

  normal() {
    this.alpha = 0;
    this.speed = 2;
  }

  excited() {
    this.alpha = 255;
    this.speed = 8;
  }

};

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(40);
  for (var i = 0; i < 30; i++) {
    bubbles[i] = new Bubble();
  }
}

function draw() {

  background(20);

  for (var bubble of bubbles) {

    bubble.move();
    bubble.show();

    if (bubble.hovered()) {
      bubble.excited();
    } else {
      bubble.normal();
    }

    for (var other of bubbles) {
      if (bubble != other && bubble.intersects(other)) {
        bubble.excited();
        other.excited();
      }
    }

  }

  if (bubbles.length > 300) {
    bubbles.splice(0, 1);
  }

}

function mousePressed() {
  const bubble = new Bubble(mouseX, mouseY);
  bubbles.push(bubble);
}

function mouseDragged() {
  const bubble = new Bubble(mouseX, mouseY);
  bubbles.push(bubble);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

new p5();
