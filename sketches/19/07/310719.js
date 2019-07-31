(() => {

    let x2, y2, x3, y3, x4, y4;

    let gridSize;




    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);
        frameRate(10);

        x2 = 0,
        y2 = 0,
        x3 = 0,
        y3 = 0,
        x4 = 0,
        y4 = 0;

        gridSize = (width > 450) ? 180 : 150;
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
