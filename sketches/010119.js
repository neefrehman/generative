function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {

  noStroke();
  // background(255);
  ellipse(mouseX, mouseY, (Math.random() * 90), (Math.random() * 90));
  fill(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 80);
  frameRate(30);

  if (mouseIsPressed) {
    fill(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
  } if (mouseX == pmouseX && mouseY == pmouseY) {
    fill(255, 0);
  } if (windowWidth < 550) {
    ellipse(mouseX, mouseY, (Math.random() * 70), (Math.random() * 70));
    frameRate(20);
  }

}
