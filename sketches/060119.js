function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

const x1 = (Math.random() * 250);
const y1 = (Math.random() * 250);
const x2 = (Math.random() * 250);
const y2 = (Math.random() * 250);
const x3 = (Math.random() * 250);
const y3 = (Math.random() * 250);
const x4 = (Math.random() * 250);
const y4 = (Math.random() * 250);

const filled = ()=> {
  noStroke();
  fill((Math.random() * 255), 200);
};

const outlined = ()=> {
  stroke((Math.random() * 255), 200);
  noFill();
};

const drawHorizontal = () => {
  for (var i = 0; i <= windowWidth + 250; i += 250) {
    translate(250, 0);
    quad(x1, y1, x2, y2, x3, y3, x4, y4);
  }
};

function draw() {

  frameRate(10);

  translate((-windowWidth/2) - 250, -windowHeight/2);
  filled();
  drawHorizontal();

  for (var i2 = 0; i2 <= windowHeight; i2 += 250) {

    translate(-windowWidth - 400, 250);
    outlined();
    drawHorizontal();

    translate(-windowWidth - 400, 250);
    filled();
    drawHorizontal();

  }

}
