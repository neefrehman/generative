function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {

  frameRate(10);

  const x1 = (Math.random() * 200);
  const y1 = (Math.random() * 200);
  const x2 = (Math.random() * 200);
  const y2 = (Math.random() * 200);
  const x3 = (Math.random() * 200);
  const y3 = (Math.random() * 200);
  const x4 = (Math.random() * 200);
  const y4 = (Math.random() * 200);

  noStroke();
  fill((Math.random() * 255), 200);

  translate((-windowWidth/2), -windowHeight/2);
  quad(x1, y1, x2, y2, x3, y3, x4, y4);
  for (var i = 0; i <= windowWidth; i += 200) {
    translate(200, 0);
    quad(x1, y1, x2, y2, x3, y3, x4, y4);
  }

  for (var i2 = 0; i2 <= windowHeight; i2 += 200) {

    stroke((Math.random() * 255), 200);
    noFill();
    translate(-windowWidth - 400, 200);
    for (var i = 0; i <= windowWidth + 200; i += 200) {
      translate(200, 0);
      quad(x1, y1, x2, y2, x3, y3, x4, y4);
    }

    noStroke();
    fill((Math.random() * 255), 200);
    translate(-windowWidth - 400, 200);
    for (var i = 0; i <= windowWidth + 200; i += 200) {
      translate(200, 0);
      quad(x1, y1, x2, y2, x3, y3, x4, y4);
    }

  }

}
