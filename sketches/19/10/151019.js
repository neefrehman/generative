(() => {
    let w, h;
    let cols, rows;
    let scale = 20;

    const terrain = [];

    let xOff = 0,
        yOff = 0;
    const maxZOff = 60;

    setup = () => {
        createCanvas(windowWidth, windowHeight, WEBGL);
        background(20);
        frameRate(24);

        w = windowWidth;
        h = windowHeight;
        cols = w / scale;
        rows = h / scale;

        for (let y = 0; y < rows; y++) {
            terrain[y] = [];
        }
    };

    draw = () => {
        background(20);
        stroke(255);
        strokeWeight(0.7);
        noFill();

        rotateX(PI / 3);
        translate(-width / 2, -height / 2);

        for (let y = 0; y < rows - 1; y++) {
            beginShape(TRIANGLE_STRIP);
            for (let x = 0; x < cols; x++) {
                terrain[y][x] = map(noise(xOff, yOff), 0, 1, -maxZOff, maxZOff);
                vertex(x * scale, y * scale, terrain[y][x]);
                xOff += 0.005;
            }
            yOff += 0.005;
            endShape();
        }
    };
})();
