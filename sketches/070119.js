function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {

  const posX = mouseX + (150 * Math.random()) - 150 * Math.random();
  const posY = mouseY + (150 * Math.random()) - 150 * Math.random();
  const col = 255 * Math.random();

  noStroke();
  fill(col, 100);
  ellipse(posX, posY, 30, 30);

}
