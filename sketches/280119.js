var bubbles = [];
var Bubble = class Bubble {

  constructor(x, y, r) {
    this.x = x || random((width / 2) + 30, (width / 2) - 30);
    this.y = y || random((height / 2) + 30, (height / 2) - 30);
    this.r = r || 17;
    this.speed = (width > 450) ? 2 : 1.5;
    this.color = 255;
    this.colorChange = -0.3 + random(0.003);
  }

  move() {
    this.x = this.x + random(-this.speed, this.speed);
    this.y = this.y + random(-this.speed, this.speed);
    this.color = this.color + this.colorChange;

    if (this.color <= -10) {
      this.colorChange = -this.colorChange;
    } else if (this.color >= 265) {
      this.colorChange = -this.colorChange;
    }
  }

  show() {
    noStroke();
    fill(this.color, this.color, this.color);
    ellipse(this.x, this.y, this.r * 2);
  }

  intersects(other) {
    const d = dist(this.x, this.y, other.x, other.y);
    return (d < this.r + other.r);
  }

  excited() {
    this.speed = (width > 450) ? 5 : 4;
  }

  normal() {
    this.speed = (width > 450) ? 2 : 1.5;
  }

};

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(20);
  frameRate(40);
  for (var i = 0; i < 50; i++) {
    bubbles[i] = new Bubble();
  }
}

function draw() {

  for (const bubble of bubbles) {

    bubble.move();
    bubble.show();

    for (const other of bubbles) {
      if (bubble != other && bubble.intersects(other)) {
        bubble.excited();
        other.excited();
      } else {
        bubble.normal();
        other.normal();
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
