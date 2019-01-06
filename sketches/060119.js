function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(10);
}

const quadpoints = {
  x1: (Math.random() * 200),
  y1: (Math.random() * 200),
  x2: (Math.random() * 200),
  y2: (Math.random() * 200),
  x3: (Math.random() * 200),
  y3: (Math.random() * 200),
  x4: (Math.random() * 200),
  y4: (Math.random() * 200)
};

function draw() {

  const filled = () => {
    noStroke();
    fill((Math.random() * 255), 100);
  };

  const outlined = () => {
    stroke((Math.random() * 255), 200);
    noFill();
  };

  const drawHorizontally = () => {
    for (var i = 0; i <= windowWidth + 100; i += 100) {
      translate(100, 0);
      quad(quadpoints);
    }
  };

  translate((-windowWidth/2) - 100, -windowHeight/2);
  filled();
  drawHorizontally();

  for (var i2 = 0; i2 <= windowHeight; i2 += 100) {

    translate(-windowWidth - 180, 100);
    outlined();
    drawHorizontally();

    translate(-windowWidth - 180, 100);
    filled();
    drawHorizontally();

  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
