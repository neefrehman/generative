(() => {

    const slices = [];
    class Slice {

        constructor(x, y, r) {
            this.x = x || random(width);
            this.y = y || 0;
            this.r = r || 36;
            this.speed = 5;
            this.growth = (width > 450) ? 6 : 3;
            this.growthDirection = -1;
            this.maxR = 48;

            this.fill = 20;
            this.stroke = 255;
        }

        move() {
            this.y = this.y + random(this.speed);
            this.r = this.r + this.growthDirection * noise(this.growth);

            if (this.r < 1) {
                this.growthDirection = 1;
            } else if (this.r > this.maxR) {
                this.maxR = this.maxR + 4;
                this.growthDirection = -1;
            }

            if (this.y > height + this.r + 150) {
                this.y = -this.r;
            }
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
            this.fill = 255;
            this.stroke = 0;
        }

        normal() {
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
