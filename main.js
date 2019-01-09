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

sketchLinks.forEach(sketchLink => {

    sketchLink.addEventListener("click", () => {
        const sketchName = sketchLink.innerHTML;
        const script = document.createElement("script");

        footer.classList.add("show");
        homeContent.classList.add("hide");

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

const getURLPath = () => location.pathname.split('/').filter((v) => v !== '');

// if (URL contains xxxxxx) {
    const linkedSketch = getURLPath();
        if (linkedSketch.length == 0) {
            console.log("at home page");
        } else if (linkedSketch.length >= 1) {
            const sketchId = linkedSketch[linkedSketch.length - 1];
            console.log(sketchId);

            const linkedSketchButton = document.getElementById(sketchId);
            linkedSketchButton.click();
        }
// }
