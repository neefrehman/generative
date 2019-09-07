(() => {
    let angle = 0;
    let circleHeight = 200;
    let circleWidth = 150;
    let direction = 1;

    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);
    };

    draw = () => {
        background(20);

        push();
        translate(width / 2, height / 2);
        rotate(angle);
        fill(180, 20, 90);
        ellipse(0, 0, circleHeight, circleWidth);
        pop();

        circleHeight -= 1 * direction;
        circleWidth += 1 * direction;
        if (frameCount % 50 === 0) direction = direction * -1;

        angle += 0.1;
    };
})();
