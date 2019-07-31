(() => {

    let x2, y2, x3, y3, x4, y4,
        gridSize;




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

        gridSize = (width > 450) ? 170 : 110;
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

                x2 += random(20, -20);
                y2 += random(20, -20);
                x3 += random(20, -20);
                y3 += random(20, -20);
                x4 += random(20, -20);
                y4 += random(20, -20);

                beginShape();
                    vertex(x, y);
                    bezierVertex(x2, y2, x3, y3, x4, y4);
                endShape();
            }
        }
    };

})();
