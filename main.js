// Dark mode
const darkModeToggle = document.documentElement;
const darkMode = () => document.documentElement.classList.toggle("dark");

darkModeToggle.addEventListener("dblclick", e => {
    darkMode();

    if (document.documentElement.classList.contains("dark")) {
        localStorage.setItem("darkMode", true);
    } else {
        localStorage.removeItem("darkMode");
    }
});


// SPA logic
const homeContent = document.querySelector(".home-content");
const sketchLinks = document.querySelectorAll(".sketchlink");
const footer = document.querySelector("footer");
const homeLink = document.querySelector(".home-link");
const codeLink = document.querySelector(".code-link");
const getURLPath = () => location.pathname.split("/").filter((v) => v !== "");
const linkedSketch = getURLPath()[getURLPath().length - 1];

const goToSketch = sketch => {
    footer.classList.add("show");
    homeContent.classList.add("hide");

    const script = document.createElement("script");
    script.src = `sketches/${sketch}.js`;
    document.body.appendChild(script);

    document.title = `${sketch} - Generative - Neef Rehman`;
    codeLink.innerHTML = sketch;
    codeLink.href = `https://github.com/neefrehman/Generative/blob/master/sketches/${sketch}.js`;
    history.replaceState("", `${sketch} - Generative - Neef Rehman`, sketch);
};

const goHome = () => {
    footer.classList.remove("show");
    homeContent.classList.remove("hide");

    remove();
    document.body.removeChild(document.body.lastChild);

    document.title = "Generative - Neef Rehman";
    history.replaceState("", document.title, "/");
};

if (getURLPath().length >= 1 && (location.protocol != "file:")) {
    const sketchButton = document.getElementById(linkedSketch);

    if (sketchButton) {
        goToSketch(linkedSketch);
    } else {
        window.location.href = "/404";
    }
}

sketchLinks.forEach(link => {
    link.addEventListener("click", () => goToSketch(link.innerHTML));
});

homeLink.addEventListener("click", () => goHome());

// TODO: Back button => goHome();
