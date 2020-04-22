(() => {
    let xOff = 0;

    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);
        stroke(255, 18);
        noFill();
    };

    draw = () => {
        const x1 = 2 * width * noise(xOff + 10) - width / 2;
        const y1 = 2 * height * noise(xOff + 50) - height / 2;
        const x2 = 2 * width * noise(xOff + 20) - width / 2;
        const y2 = 2 * height * noise(xOff + 60) - height / 2;
        const x3 = 2 * width * noise(xOff + 30) - width / 2;
        const y3 = 2 * height * noise(xOff + 70) - height / 2;
        const x4 = 2 * width * noise(xOff + 40) - width / 2;
        const y4 = 2 * height * noise(xOff + 80) - height / 2;

        bezier(x1, y1, x2, y2, x3, y3, x4, y4);

        xOff += 0.002;

        if (frameCount % 2000 == 0) background(20);
    };
})();
