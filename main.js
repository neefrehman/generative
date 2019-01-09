// Dark mode
const darkModeToggle = document.documentElement;

darkModeToggle.addEventListener("dblclick", e => {
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
const sketchContent = document.querySelector("footer");
const canvas = document.querySelector("canvas");
const homeLink = document.querySelector(".home-link");
const codeLink = document.querySelector(".code-link");

const goToSketch = sketch => {
    sketchContent.classList.add("show");
    homeContent.classList.add("hide");

    const script = document.createElement("script");
    script.src = `sketches/${sketch}.js`;
    document.body.appendChild(script);

    codeLink.innerHTML = sketch;
    codeLink.href = `https://github.com/neefrehman/Generative/blob/master/sketches/${sketch}.js`;
    document.title = `${sketch} - Generative - Neef Rehman`;
    history.pushState("", `${sketch} - Generative - Neef Rehman`, sketch);
};

const goHome = () => {
    sketchContent.classList.remove("show");
    homeContent.classList.remove("hide");

    remove();
    document.body.removeChild(document.body.lastChild);

    document.title = "Generative - Neef Rehman";
    history.replaceState("", document.title, "/");
};

const urlPath = () => location.pathname.split("/").filter((v) => v !== "");
const linkedSketch = urlPath()[urlPath().length - 1];

if (urlPath().length >= 1 && location.protocol != "file:") {
    const sketchButton = document.getElementById(linkedSketch);

    if (sketchButton) {
        goToSketch(linkedSketch);
    } else if (location.href.split(location.host)[1] != "/404") {
        window.location.href = "/404";
    }
}

sketchLinks.forEach(link => {
    link.addEventListener("click", () => goToSketch(link.innerHTML));
});

homeLink.addEventListener("click", () => goHome());

window.addEventListener("popstate", () => {
    // const newUrlPath = () => location.pathname.split("/").filter((v) => v !== "");
    // const newLinkedSketch = newUrlPath()[newUrlPath().length - 1];

    if (urlPath().length == 0) {
        goHome();
    } else {
        goToSketch(linkedSketch);
    }
  });
