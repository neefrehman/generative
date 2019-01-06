function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

const x1 = (Math.random() * 100);
const y1 = (Math.random() * 100);
const x2 = (Math.random() * 100);
const y2 = (Math.random() * 100);
const x3 = (Math.random() * 100);
const y3 = (Math.random() * 100);
const x4 = (Math.random() * 100);
const y4 = (Math.random() * 100);

function draw() {

  frameRate(10);

  const filled = ()=> {
    noStroke();
    fill((Math.random() * 255), 100);
  };

  const outlined = ()=> {
    stroke((Math.random() * 255), 200);
    noFill();
  };

  const drawHorizontal = () => {
    for (var i = 0; i <= windowWidth + 100; i += 100) {
      translate(100, 0);
      quad(x1, y1, x2, y2, x3, y3, x4, y4);
    }
  };

  translate((-windowWidth/2) - 100, -windowHeight/2);
  filled();
  drawHorizontal();

  for (var i2 = 0; i2 <= windowHeight; i2 += 100) {

    translate(-windowWidth - 180, 100);
    outlined();
    drawHorizontal();

    translate(-windowWidth - 180, 100);
    filled();
    drawHorizontal();

  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
