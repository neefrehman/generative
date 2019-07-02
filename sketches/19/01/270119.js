(() => {

    const bubbles = [];
    class Bubble {

        constructor(x, y, r) {
            this.x = x || random((width / 2) + 60, (width / 2) - 60);
            this.y = y || random((height / 2) + 60, (height / 2) - 60);
            this.r = r || 15;
            this.speed = (width > 450) ? 2 : 1.5;
            this.alpha = 0;
        }

        move() {
            this.x = this.x + random(-this.speed, this.speed);
            this.y = this.y + random(-this.speed, this.speed);
        }

        show() {
            stroke(255);
            strokeWeight(2);
            fill(255, this.alpha);
            ellipse(this.x, this.y, this.r * 2);
        }

        hovered() {
            const d = dist(this.x, this.y, mouseX, mouseY);
            return (d - 15 < this.r);
        }

        collides(sibling) {
            const d = dist(this.x, this.y, sibling.x, sibling.y);
            return (d < this.r + sibling.r);
        }

        excited() {
            this.alpha = 255;
            this.speed = (width > 450) ? 8 : 6;
        }

        normal() {
            this.alpha = 0;
            this.speed = (width > 450) ? 2 : 1.5;
        }

    }




    setup = () => {
        createCanvas(windowWidth, windowHeight);
        frameRate(40);
        for (let i = 0; i < 30; i++) {
            bubbles[i] = new Bubble();
        }
    };


    draw = () => {

        background(20);

        for (const bubble of bubbles) {

            bubble.move();
            bubble.show();

            if (bubble.hovered()) {
                bubble.excited();
            } else {
                bubble.normal();
            }

            for (const sibling of bubbles) {
                if (bubble != sibling && bubble.collides(sibling)) {
                    bubble.excited();
                    sibling.excited();
                }
            }

        }

        if (bubbles.length > 300) {
            bubbles.splice(0, 1);
        }

    };


    mousePressed = () => {
        const bubble = new Bubble(mouseX, mouseY);
        bubbles.push(bubble);
    };


    mouseDragged = () => {
        const bubble = new Bubble(mouseX, mouseY);
        bubbles.push(bubble);
    };

})();
