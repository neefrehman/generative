(() => {
    let cols, rows;
    let scale = 22;

    let xDir = 1;
    let yDir = 1;
    let xMult = 1;
    let yMult = 1;

    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);

        const w = windowWidth;
        const h = windowHeight;
        cols = w / scale;
        rows = h / scale;
    };

    draw = () => {
        background(20);
        stroke(255);
        noFill();

        for (let y = 0; y < rows; y++) {
            beginShape(TRIANGLE_STRIP);
            for (let x = 0; x < cols; x++) {
                vertex(x * xMult * scale, y * scale);
                vertex(x * yMult * scale, y + 1 * scale);
            }
            endShape();
        }

        scale += 0.01;
        yMult += yDir * 0.05;
        xMult += xDir * 0.02;

        if (frameCount % 100 === 0) {
            xDir = xDir * -1;
        }

        if (frameCount % 170 === 0) {
            yDir = yDir * -1;
        }
    };
})();
