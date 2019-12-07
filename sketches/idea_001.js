(() => {
    let x = 0,
        y = 0,
        px = 0,
        py = 0;

    const easing = 0.1;

    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);
        stroke(255);
    };

    draw = () => {
        // var targetX = mouseX;
        x += (mouseX - x) * easing;
        // var targetY = mouseY;
        y += (mouseY - y) * easing;
        var weight = dist(x, y, px, py);
        strokeWeight(weight);
        line(x, y, px, py);
        py = y;
        px = x;
    };
})();
