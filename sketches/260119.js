function setup() {
  createCanvas(windowWidth, windowHeight);
  background(10);
}

function draw() {

  stroke(255);

  if (windowWidth > windowHeight) {
    line(mouseX, 0, mouseX, windowHeight);
  } else if (windowHeight > windowWidth) {
    line(0, mouseY, windowHeight, mouseY);
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

new p5();
