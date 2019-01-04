function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  
  noStroke();
  fill(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 80);
  ellipse(mouseX, mouseY, (Math.random() * 90), (Math.random() * 90));
  frameRate(30);

  if (mouseIsPressed) {
    noStroke();
    fill(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
  } if (mouseX == pmouseX && mouseY == pmouseY) {
    noStroke();
    fill(255, 0);
  }

}
