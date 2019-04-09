var spores = [];
var Spore = class Spore {

    constructor(x, y, r) {
        this.x = x || random((width / 2) + 30, (width / 2) - 30);
        this.y = y || random((height / 2) + 30, (height / 2) - 30);
        this.r = r || 17;
        this.speed = (width > 450) ? 3.5 : 2.5;
        this.color = 255;
        this.colorChangeRate = -0.3 + random(0.004);
    }

    move() {
        this.x = this.x + random(-this.speed, this.speed);
        this.y = this.y + random(-this.speed, this.speed);
        this.color = this.color + this.colorChangeRate;

        if (this.color <= -5) {
            this.colorChangeRate = -this.colorChangeRate;
        } else if (this.color >= 260) {
            this.colorChangeRate = -this.colorChangeRate;
        }
    }

    show() {
        noStroke();
        fill(this.color, this.color, this.color);
        ellipse(this.x, this.y, this.r * 2);
    }

    collides(sibling) {
        const d = dist(this.x, this.y, sibling.x, sibling.y);
        return (d < this.r + sibling.r);
    }

    excited() {
        this.speed = (width > 450) ? 6 : 4;
    }

    normal() {
        this.speed = (width > 450) ? 3.5 : 2.5;
    }

};




setup = () => {

  createCanvas(windowWidth, windowHeight);
  background(20);
  frameRate(40);

  const initialSporeCount = (width > 450) ? 50 : 40;
  for (let i = 0; i < initialSporeCount; i++) {
    spores[i] = new Spore();
  }

};


draw = () => {

  for (const spore of spores) {

    spore.move();
    spore.show();

    for (const sibling of spores) {
      if (spore != sibling && spore.collides(sibling)) {
        spore.excited();
        sibling.excited();
      } else {
        spore.normal();
        sibling.normal();
      }
    }

  }

  if (spores.length > 500) {
    spores.splice(0, 1);
  }

};


mousePressed = () => {
  const spore = new Spore(mouseX, mouseY);
  spores.push(spore);
};


mouseDragged = () => {
  const spore = new Spore(mouseX, mouseY);
  spores.push(spore);
};


windowResized = () => {
  resizeCanvas(windowWidth, windowHeight);
  background(20);
};


new p5();
