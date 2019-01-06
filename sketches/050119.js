function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(10);
}

function draw() {

  const x1 = (Math.random() * 200);
  const y1 = (Math.random() * 200);
  const x2 = (Math.random() * 200);
  const y2 = (Math.random() * 200);
  const x3 = (Math.random() * 200);
  const y3 = (Math.random() * 200);
  const x4 = (Math.random() * 200);
  const y4 = (Math.random() * 200);

  const filled = ()=> {
    noStroke();
    fill((Math.random() * 255), 200);
  };

  const outlined = ()=> {
    stroke((Math.random() * 255), 200);
    noFill();
  };

  const drawHorizontally = () => {
    for (var i = 0; i <= windowWidth + 400; i += 200) {
      translate(200, 0);
      quad(x1, y1, x2, y2, x3, y3, x4, y4);
    }
  };

  translate((-windowWidth/2) - 200, -windowHeight/2);
  filled();
  drawHorizontally();

  for (var i2 = 0; i2 <= windowHeight; i2 += 200) {

    translate(-windowWidth - 600, 200);
    outlined();
    drawHorizontally();

    translate(-windowWidth - 600, 200);
    filled();
    drawHorizontally();

  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
