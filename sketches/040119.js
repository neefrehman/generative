function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {

  background(255);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  torus(100, 25, 48, 32);

  var dirY = (mouseY / height - 0.5) *2;
  var dirX = (mouseX / width - 0.5) *2;
  directionalLight(250, 250, 250, -dirX, -dirY, 0.25);
  specularMaterial(250, 250, 250);

}
