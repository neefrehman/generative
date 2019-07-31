(() => {

    let randomOffSetOption;




    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);
        frameRate(10);

        randomOffSetOption = random(-50, 50);
    };


    draw = () => {
        background(20);

        let x2 = 0,
            y2 = 0,
            x3 = 0,
            y3 = 0,
            x4 = 0,
            y4 = 0;

        for (let x = 0; x < width; x += 100) {
            for (let y = 0; y < height; y += 100) {
                const offsetOptions = [x / 5, y / 5, randomOffSetOption];

                noFill();
                stroke(random(70, 255));
                strokeWeight(2);

                x += random(1, -1);
                y += random(1, -1);

                x2 += random(offsetOptions);
                y2 += random(offsetOptions);
                x3 -= random(offsetOptions);
                y3 += random(offsetOptions);
                x4 += random(offsetOptions);
                y4 += random(offsetOptions);

                beginShape();
                    vertex(x, y);
                    bezierVertex(x2, y2, x3, y3, x4, y4);
                endShape();
            }
        }
    };

})();
