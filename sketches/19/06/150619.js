(() => {

    let noiseIncrement = 0.01;
    let tOff = 0;



    setup = () => {
        const canvasSize = (window.innerWidth > 500) ? 360 : 220;
        const canvas = createCanvas(canvasSize, canvasSize);
        canvas.class("p5Canvas not-full-screen");

        background(20);
        pixelDensity(1);
    };


    draw = () => {
        loadPixels();

        let yOff = 0;

        for (let y = 0; y < width; y++) {
            let xOff = 0;

            for (let x = 0; x < height; x++) {
                const index = (x + y * width) * 4;
                const brightness = noise(xOff, yOff, tOff) * 255;
                pixels[index + 0] = brightness;
                pixels[index + 1] = brightness;
                pixels[index + 2] = brightness;
                pixels[index + 3] = 255;

                xOff += noiseIncrement;
            }
            yOff += noiseIncrement;
        }

        tOff += noiseIncrement * 0.75;

        updatePixels();
    };


    mousePressed = () => {
        
    };

})();


