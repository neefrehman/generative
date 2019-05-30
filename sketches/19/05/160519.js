(() => {

    let r = Math.floor((Math.random() * 255));
    // let g = Math.floor((Math.random() * 255));
    let b = Math.floor((Math.random() * 200)) + 55;




    setup = () => {
        createCanvas(windowWidth, windowHeight);
        pixelDensity(1);
    };
    

    draw = () => {
        background(20);

        loadPixels();

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (x + y * width) * 4;
                pixels[index + 0] = x;
                pixels[index + 1] = r;
                pixels[index + 2] = y;
                pixels[index + 3] = b;
            }
        }

        updatePixels();
    };


    mousePressed = () => {
        r = Math.floor((Math.random() * 255));
        // g = Math.floor((Math.random() * 255));
        b = Math.floor((Math.random() * 255));
    };

})(); new p5();
