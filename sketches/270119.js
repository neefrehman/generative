var bubbles = [];
var Bubble = class Bubble {

  constructor(x, y, r) {
    this.x = x || random((windowWidth / 2) + 50, (windowWidth / 2) - 50);
    this.y = y || random((windowHeight / 2) + 50, (windowHeight / 2) - 50);
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
    return (d < this.r);
  }

  intersects(other) {
    const d = dist(this.x, this.y, other.x, other.y);
    return (d < this.r + other.r);
  }

};

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (var i = 0; i < 30; i++) {
    bubbles[i] = new Bubble();
  }
}

function draw() {

  background(20);

  for (const bubble of bubbles) {

    bubble.move();
    bubble.show();

    if (bubble.hovered()) {
      bubble.alpha = 255;
      bubble.speed = 10;
    } else {
      bubble.alpha = 0;
      bubble.speed = 1;
    }

    for (const other of bubbles) {
      if (bubble != other && bubble.intersects(other)) {
        bubble.alpha = 255;
        other.alpha = 255;
        bubble.speed = 10;
        other.speed = 10;
      }
    }

  }

  if (bubbles.length > 300) {
    bubbles.splice(0, 1);
  }

}

function mousePressed() {
  const b = new Bubble(mouseX, mouseY);
  bubbles.push(b);
}

function mouseDragged() {
  const b = new Bubble(mouseX, mouseY);
  bubbles.push(b);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

new p5();
