// Dark mode
const darkModeToggle = document.documentElement;

darkModeToggle.addEventListener("dblclick", () => {
    document.documentElement.classList.toggle("dark");

    if (document.documentElement.classList.contains("dark")) {
        localStorage.setItem("darkMode", true);
    } else {
        localStorage.removeItem("darkMode");
    }
});




// SPA logic
const homeContent = document.querySelector(".home-content");
const sketchLinks = document.querySelectorAll(".sketchlink");
const sketchContent = document.querySelector(".sketch-content");
const homeLink = document.querySelector(".home-link");
const codeLink = document.querySelector(".code-link");
const fourOhFourContent = document.querySelector(".fourohfour-content");
let sketchScript;


const removeSketch = () => {
    remove(); // p5
    sketchScript.remove();
};


const goToSketch = sketch => {
    sketchContent.classList.add("show");
    homeContent.classList.add("hide");

    if (document.querySelector("canvas")) removeSketch();

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
    sketchContent.classList.remove("show");
    homeContent.classList.remove("hide");

    removeSketch();

    document.title = "Generative - Neef Rehman";
};


const goTo404 = () => {
    homeContent.classList.add("hide");
    sketchContent.classList.remove("show");
    fourOhFourContent.classList.add("show");

    document.title = "404 - Generative - Neef Rehman";
};


const getUrlPath = () => location.pathname.split("/").filter(v => v !== "");
let urlPath = getUrlPath();
let linkedSketch = urlPath[urlPath.length - 1];


if (urlPath.length >= 1 && location.protocol != "file:") {
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


homeLink.addEventListener("click", () => {
    goHome();
    history.pushState("", document.title, "/");
});
