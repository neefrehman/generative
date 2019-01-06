function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
}

function draw() {

  const posX = mouseX + (200 * Math.random()) - 200 * Math.random();
  const posY = mouseY + (200 * Math.random()) - 200 * Math.random();
  const col = mouseX / width * (255 * Math.random());

  noStroke();
  fill(col, 100);
  ellipse(posX, posY, 30, 30);

}
