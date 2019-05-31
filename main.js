const allPages = document.querySelectorAll(".page");
const homePage = document.querySelector(".home-page");
const sketchPage = document.querySelector(".sketch-page");
const fourOhFourPage = document.querySelector(".fourohfour-page");

const sketchLinks = document.querySelectorAll(".sketch-list a");
const homeLinks = document.querySelectorAll(".home-link");
const codeLink = document.querySelector(".code-link");
const loadingIndicator = document.querySelector("p.loading");

let controller,
    sketchScript;


const removeSketch = () => {
    if (sketchScript) sketchScript.remove();

    const canvases = document.querySelectorAll("canvas");
    if (canvases.length == 1 && canvases[0].classList.contains("p5canvas")) {
        remove();
    } else {
        canvases.forEach(canvas => canvas.remove());
    }
};


const showPage = newPage => {
    removeSketch();
    allPages.forEach(page => page.classList.remove("show"));
    newPage.classList.add("show");
};


const goToSketch = sketch => {
    loadingIndicator.textContent = "Loading";
    showPage(sketchPage);
    document.title = `${sketch} - Generative`;

    const loadingIndicatorTimeout = setTimeout(() => {
        loadingIndicator.classList.add("show");
    }, 90);

    const year = sketch.substr(4, 2);
    const month = sketch.substr(2, 2);
    const pathToSketch = `sketches/${year}/${month}/${sketch}.js`;

    codeLink.textContent = sketch;
    codeLink.href = `https://github.com/neefrehman/Generative/blob/master/${pathToSketch}`;

    controller = new AbortController();
    const signal = controller.signal;
 
    fetch(pathToSketch, {signal})
        .then(response => {
            response.text().then(text => {
                sketchScript = document.createElement("script");
                sketchScript.textContent = text;
                document.body.appendChild(sketchScript);

                loadingIndicator.textContent = "Loaded";
                clearTimeout(loadingIndicatorTimeout);
                setTimeout(() => loadingIndicator.classList.remove("show"), 400);
            });
        })
        .catch((error) => {
            loadingIndicator.textContent = (error.code == undefined) ? "Error" : `${error.code} Error`;
        });
};


const goHome = () => {
    if (controller) controller.abort();
    showPage(homePage);
    document.title = "Generative - Neef Rehman";
};


const goTo404 = () => {
    showPage(fourOhFourPage);
    document.title = "404 - Generative";
};


const getUrlPath = () => location.pathname.split("/").filter(v => v !== "");
let urlPath = getUrlPath();
let linkedSketch;


if (urlPath.length == 0) {
    goHome();
} else {
    linkedSketch = urlPath[urlPath.length - 1];

    const linkedSketchButton = document.getElementById(linkedSketch);
    if (linkedSketchButton) {
        goToSketch(linkedSketch);
    } else {
        goTo404();
    }
}


window.addEventListener("popstate", () => {
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


// p5 windowResize into global namespace
windowResized = () => {
    if (!canvas.classList.contains("not-full-screen")) {
        resizeCanvas(windowWidth, windowHeight);
    }
};
