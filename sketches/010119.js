console.log("I've been loaded");

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
}

function draw() {

  // background(255);
  ellipse(mouseX, mouseY, (Math.random() * 90), (Math.random() * 90));
  noStroke();
  fill(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 80);

  if (mouseIsPressed) {
    fill(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
  } if (mouseX == pmouseX && mouseY == pmouseY) {
    fill(255, 0);
  } if (windowWidth < 550) {
    ellipse(mouseX, mouseY, (Math.random() * 70), (Math.random() * 70));
    frameRate(20);
  }

}
