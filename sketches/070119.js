console.log("I've been loaded");

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
}

function draw() {

  const distanceFromMouse = (width > 769) ? 200 : 100;
  const posX = mouseX + (distanceFromMouse * Math.random()) - distanceFromMouse * Math.random();
  const posY = mouseY + (distanceFromMouse * Math.random()) - distanceFromMouse * Math.random();
  const col = mouseX / width * (255 * Math.random());

  noStroke();
  fill(col, 100);
  ellipse(posX, posY, 30, 30);

}
