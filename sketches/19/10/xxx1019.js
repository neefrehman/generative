(() => {
    let cols, rows;
    let scale = 20;

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
                vertex(x * scale, y * scale);
                vertex(x * scale, y + 1 * scale);
            }
            endShape();
        }
    };
})();
