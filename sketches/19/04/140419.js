(() => {

    const slices = [];
    class Slice {

        constructor(x, y, r) {
            this.x = x || random(width);
            this.y = y || height;
            this.r = r || 32;
            this.speed = 4;
            this.growth = (width > 450) ? 6 : 3;

            this.fill = 20;
            this.stroke = 255;
        }

        move() {
            this.y = this.y + random(-this.speed, this.speed);
            this.r = this.r + noise(this.growth);
        }

        show() {
            stroke(this.stroke);
            strokeWeight(1);
            fill(this.fill);
            ellipse(this.x, this.y, this.r * 2);
        }

        hovered() {
            const d = dist(this.x, this.y, mouseX, mouseY);
            return (d - 5 < this.r);
        }

        excited() {
            this.growth = this.growth * 3;
            this.fill = 255;
            this.stroke = 0;
        }

        normal() {
            this.growth = (width > 450) ? 4 : 2;
            this.fill = 20;
            this.stroke = 255;
        }

    }




    setup = () => {

        createCanvas(windowWidth, windowHeight);
        background(20);
        frameRate(20);

        const initialSliceCount = Math.floor(width / 25);
        for (let i = 0; i < initialSliceCount; i++) {
            slices[i] = new Slice();
        }

    };


    draw = () => {
        background(20);

        for (const slice of slices) {

            slice.move();
            slice.show();

            if (slice.hovered()) {
                slice.excited();
            } else {
                slice.normal();
            }

            if (slice.y < -slice.r) {
                slice.y = height + slice.r;
            }

        }

    };

})();
