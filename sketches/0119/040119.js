function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {

    background(0);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);

    torus(100, 25, 48, 32);
    sphere(25, 48);

    var dirY = (mouseY / height - 0.5) * 2;
    var dirX = (mouseX / width - 0.5) * 2;
    directionalLight(255, 255, 255, -dirX, -dirY, 0.25);
    specularMaterial(255, 255, 255);

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

new p5();
