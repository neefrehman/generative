(() => {

    var video;
    width = window.innerWidth;




    setup = () => {
        createCanvas(windowWidth, windowHeight);
        video = createCapture(VIDEO);
        video.hide();
    };


    draw = () => {
        background(20);
        image(video, 0, 0, mouseX, mouseY);
    };

})(); new p5();
