(() => {

    let x2, y2, x3, y3, x4, y4,
        gridSize,
        xOff = 0,
        yOff = 200;




    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);
        frameRate(10);

        x2 = width / 2,
        y2 = height / 2,
        x3 = width / 2,
        y3 = height / 2,
        x4 = width / 2,
        y4 = height / 2;

        gridSize = (width > 450) ? 200 : 120;
    };


    draw = () => {
        background(20);

        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {

                noFill();
                stroke(random(70, 255));
                strokeWeight(2);

                x += random(1, -1);
                y += random(1, -1);

                x2 = map(noise(xOff +   0), 0, 1, 0, width) + random(-5, 5);
                y2 = map(noise(yOff + 500), 0, 1, 0, width) + random(-5, 5);
                x3 = map(noise(xOff +   0), 0, 1, 0, width) + random(-5, 5);
                y3 = map(noise(yOff +   0), 0, 1, 0, width) + random(-5, 5);
                x4 = map(noise(xOff +   0), 0, 1, 0, width) + random(-5, 5);
                y4 = map(noise(yOff +   0), 0, 1, 0, width) + random(-5, 5);

                beginShape();
                vertex(x, y);
                bezierVertex(x2, y2, x3, y3, x4, y4);
                endShape();
            }
        }

        xOff += 0.02;
        yOff += 0.02;
    };

})();
