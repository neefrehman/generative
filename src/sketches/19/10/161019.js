(() => {
    let cols, rows;
    let scale = 20;

    const terrain = [];

    let flying = 0;
    const noisiness = 0.15;

    setup = () => {
        createCanvas(windowWidth, windowHeight, WEBGL);
        background(20);
        frameRate(24);
        stroke(255);
        strokeWeight(0.5);
        noFill();

        cols = windowWidth / scale;
        rows = windowHeight / scale;
    };

    draw = () => {
        flying -= noisiness;
        let yOff = 0;
        for (let x = 0; x < rows; x++) {
            terrain[x] = [];
            let xOff = flying;
            for (let y = 0; y < cols; y++) {
                terrain[x][y] = map(noise(xOff, yOff), 0, 1, -100, 100);
                xOff += noisiness;
            }
            yOff += noisiness;
        }

        background(20);

        rotateX(PI / 3);
        translate(-width / 2, -height / 2);

        for (let y = 0; y < rows - 1; y++) {
            beginShape(TRIANGLE_STRIP);
            for (let x = 0; x < cols; x++) {
                vertex(x * scale, y * scale, terrain[y][x]);
            }
            endShape();
        }
    };
})();
