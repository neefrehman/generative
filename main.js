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
const sketchLinks = document.querySelectorAll(".sketchlink");
const codeLink = document.querySelector(".code");
const scriptContainer = document.querySelector(".script-container");
const homeContent = document.querySelector(".home-content");
const footer = document.querySelector("footer");
const homeLink = document.querySelector(".home");

sketchLinks.forEach(sketchLink => {

    sketchLink.addEventListener("click", () => {
        const sketchName = sketchLink.innerHTML;

        footer.classList.add("show");
        homeContent.classList.add("hide");

        const script = document.createElement("script");
        script.src = `sketches/${sketchName}.js`;
        document.body.appendChild(script);

        document.title = `${sketchName} - Generative - Neef Rehman`;
        codeLink.innerHTML = sketchName;
        codeLink.href = `https://github.com/neefrehman/Generative/blob/master/sketches/${sketchName}.js`;
        history.replaceState("", `${sketchName} - Generative - Neef Rehman`, sketchName);
    });

});


homeLink.addEventListener("click", () => {
    footer.classList.remove("show");
    homeContent.classList.remove("hide");

    remove();
    document.body.removeChild(document.body.lastChild);

    document.title = "Generative - Neef Rehman";
    history.replaceState("", document.title, "/");
});


// Back button back to index.html


// if (URL contains xxxxxx) {
//     const linkedSketch = window.url.substring[0];
//     const linkedSketchButton = document.querySelector(".sketchURL");
//
//     linkedSketchButton.click();
// }
