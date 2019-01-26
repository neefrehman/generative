var bubbles = [];
var numberOfBubbles = 100;
var Bubble = class Bubble {
  constructor(x, y) {
    this.x = x || windowWidth / 2;
    this.y = y || windowHeight / 2;
  }
  move() {
    this.x = this.x + random(-3, 3);
    this.y = this.y + random(-3, 3);
  }
  show() {
    stroke(255);
    strokeWeight(2);
    noFill();
    ellipse(this.x, this.y, 24);
  }
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (var i = 0; i < numberOfBubbles; i++) {
    bubbles[i] = new Bubble();
  }
}

function draw() {
  background(10);
  for (var i = 0; i < bubbles.length; i++) {
    bubbles[i].move();
    bubbles[i].show();
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
