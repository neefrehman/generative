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


// // SPA
// const sketchLinks = document.querySelectorAll(".sketchlink");
// const codeLink = document.querySelector(".code");
//
// sketchLinks.forEach(link => {
//
//     link.addEventListener("click", () => {
//         const sketchName = link.innerHTML;
//         history.replaceState(stateObj, `${sketchName} - Generative - Neef Rehman`, `${sketchName}.html`);
//         codeLink.innerHTML = sketchName;
//         // Show Footer
//         // Hide body & add .sketch
//         // Load in script
//     });
//
// });
