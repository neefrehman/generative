(() => {

    let video;
    const constraints = {
        audio: false,
        video: {
            facingMode: "user"
        }
    };

    const screenShots = [];




    setup = () => {
        createCanvas(windowWidth, windowHeight);
        background(20);
        video = createCapture(constraints);
        video.hide();
    };


    draw = () => {
        image(video, 0, 0, width, height);
    };

    mousePressed = () => {
        screenShots.push(video.get());
    };

})(); new p5();
