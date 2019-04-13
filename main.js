document.addEventListener("DOMContentLoaded", () => {

    const allPages = document.querySelectorAll(".page");
    const homePage = document.querySelector(".home-page");
    const sketchPage = document.querySelector(".sketch-page");
    const fourOhFourPage = document.querySelector(".fourohfour-page");

    const sketchLinks = document.querySelectorAll(".sketch-link");
    const homeLinks = document.querySelectorAll(".home-link");
    const codeLink = document.querySelector(".code-link");

    let sketchScript;


    const removeSketch = () => {
        while (document.querySelector("canvas")) {
            remove(); // p5
            sketchScript.remove();
        }
    };


    const showPage = newPage => {
        removeSketch();
        allPages.forEach(page => page.classList.remove("show"));
        newPage.classList.add("show");
    };


    const goToSketch = sketch => {
        showPage(sketchPage);

        const month = sketch.substr(2, 2);
        const year = sketch.substr(4, 2);

        sketchScript = document.createElement("script");
        sketchScript.src = `sketches/${year}/${month}/${sketch}.js`;
        document.body.appendChild(sketchScript);

        codeLink.innerHTML = sketch;
        codeLink.href = `https://github.com/neefrehman/Generative/blob/master/sketches/${year}/${month}/${sketch}.js`;
        document.title = `${sketch} - Generative`;
    };


    const goHome = () => {
        showPage(homePage);

        document.title = "Generative - Neef Rehman";
    };


    const goTo404 = () => {
        showPage(fourOhFourPage);

        document.title = "404 - Generative";
    };


    const getUrlPath = () => location.pathname.split("/").filter(v => v !== "");
    let urlPath = getUrlPath();
    let linkedSketch = urlPath[urlPath.length - 1];


    if (urlPath.length >= 1) {
        const linkedSketchButton = document.getElementById(linkedSketch);

        if (linkedSketchButton) {
            goToSketch(linkedSketch);
        } else {
            goTo404();
        }
    } else {
        goHome();
    }


    window.addEventListener("popstate", e => {
        urlPath = getUrlPath();
        const newLinkedSketch = urlPath[urlPath.length - 1];

        if (urlPath.length == 0 || newLinkedSketch == linkedSketch) {
            goHome();
            history.replaceState("", document.title, "/");
        } else {
            goToSketch(newLinkedSketch);
        }

        urlPath = getUrlPath();
        linkedSketch = urlPath[urlPath.length - 1];
    });


    sketchLinks.forEach(link => {
        link.addEventListener("click", () => {
            goToSketch(link.id);
            history.pushState("", `${link.id} - Generative`, link.id);
        });
    });


    homeLinks.forEach(link => {
        link.addEventListener("click", () => {
            goHome();
            history.pushState("", document.title, "/");
        });
    });

});


// p5 windowResize into global namespace
windowResized = () => {
    resizeCanvas(windowWidth, windowHeight);
};
