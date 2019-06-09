// https://www.youtube.com/watch?v=rNqaw8LT2ZU&list=PLRqwX-V7Uu6aKKsDHZdDvN6oCJ2hRY_Ig&index=4
// IIFE stops it from working!!

(() => {

    let video;




    setup = () => {
        const canvas = createCanvas(320, 240);
        canvas.class("p5canvas not-full-screen");
        pixelDensity(1);

        video = createCapture(VIDEO);
        video.size(320, 240);
    };


    draw = () => {
        background(20);

        video.loadPixels();
        loadPixels();

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (x + y * width) * 4;
                const r = video.pixels[index + 0];
                const g = video.pixels[index + 1];
                const b = video.pixels[index + 2];
                const bright = (r + g + b) / 3;

                pixels[index + 0] = bright;
                pixels[index + 1] = bright;
                pixels[index + 2] = bright;
                pixels[index + 3] = 255;
            }
        }

        updatePixels();
    };

})();

new p5();
