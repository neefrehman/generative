function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {

  stroke(255);
  line(mouseX, 0, mouseX, windowHeight);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

new p5();
