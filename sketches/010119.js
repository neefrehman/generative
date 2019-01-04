function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {

  if (mouseIsPressed) {
    noStroke();
    fill(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
  } if (mouseX == pmouseX && mouseY == pmouseY) {
    noStroke();
    fill(255, 0);
  } else {
    noStroke();
    fill(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 80);
  }

  if (windowWidth < 550) {
    ellipse(mouseX, mouseY, (Math.random() * 70), (Math.random() * 70));
  } else {
    ellipse(mouseX, mouseY, (Math.random() * 90), (Math.random() * 90));
  }

  frameRate(30);

}
