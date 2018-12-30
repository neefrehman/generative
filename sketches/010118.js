function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  if (mouseIsPressed) {
    fill(255);
  } else {
    noStroke();
    fill(Math.floor((Math.random()*255)), Math.floor((Math.random()*255)), Math.floor((Math.random()*255)), 75);
  }
  ellipse(mouseX, mouseY, (Math.random()*100), (Math.random()*100));
}
