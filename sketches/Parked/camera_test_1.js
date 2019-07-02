(() => {

    let video;
    const constraints = {
        audio: false,
        video: {
            facingMode: "user"
        }
    };




    setup = () => {
        createCanvas(windowWidth, windowHeight);
        video = createCapture(constraints);
        video.hide();
    };


    draw = () => {
        background(20);
        image(video, 0, 0, mouseX, mouseY);
    };

})();
