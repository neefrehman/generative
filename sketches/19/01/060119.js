function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    frameRate(10);
}


var x1 = (Math.random() * 100);
var y1 = (Math.random() * 100);
var x2 = (Math.random() * 100);
var y2 = (Math.random() * 100);
var x3 = (Math.random() * 100);
var y3 = (Math.random() * 100);
var x4 = (Math.random() * 100);
var y4 = (Math.random() * 100);


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
        for (var i = 0; i <= width + 100; i += 100) {
            translate(100, 0);
            quad(x1, y1, x2, y2, x3, y3, x4, y4);
        }
    };

    translate((-width / 2) - 100, (-height / 2));
    filled();
    drawHorizontally();

    for (var i2 = 0; i2 <= height; i2 += 100) {
        translate(-width - 180, 100);
        outlined();
        drawHorizontally();

        translate(-width - 180, 100);
        filled();
        drawHorizontally();
    }

}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


new p5();
