(() => {
    let w, h;
    let cols, rows;
    let scale = 20;

    setup = () => {
        createCanvas(windowWidth, windowHeight, WEBGL);
        background(20);
        frameRate(24);

        w = windowWidth;
        h = windowHeight;
        cols = w / scale;
        rows = h / scale;
    };

    draw = () => {
        background(20);
        stroke(255);
        strokeWeight(0.7);
        noFill();

        rotateX(PI / 3);
        translate(-width / 2, -height / 2);

        const zOff = 6;

        for (let y = 0; y < rows; y++) {
            beginShape(TRIANGLE_STRIP);
            for (let x = 0; x < cols; x++) {
                vertex(x * scale, y * scale, random(-zOff, zOff));
            }
            endShape();
        }
    };
})();
