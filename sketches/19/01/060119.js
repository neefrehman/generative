(() => {

    const x1 = (Math.random() * 100);
    const y1 = (Math.random() * 100);
    const x2 = (Math.random() * 100);
    const y2 = (Math.random() * 100);
    const x3 = (Math.random() * 100);
    const y3 = (Math.random() * 100);
    const x4 = (Math.random() * 100);
    const y4 = (Math.random() * 100);

    setup = () => {
        createCanvas(windowWidth, windowHeight, WEBGL);
        frameRate(10);
    };


    draw = () => {

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

    };

})(); new p5();
