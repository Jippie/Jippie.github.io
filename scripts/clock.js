const clock = document.getElementById("clock");
const darkswitch = document.getElementById("dark-light");
const themeIcon = document.getElementById("theme-icon");

let dark = localStorage.getItem("dark") !== "false";

function updateClock() {
    clock.textContent = new Date().toLocaleTimeString("nl-NL");
}
function updateTheme() {
    document.body.style.backgroundColor = dark ? "black" : "white";
    document.body.style.color = dark ? "white" : "black";

    darkswitch.setAttribute(
        "aria-label",
        dark ? "Switch to light mode" : "Switch to dark mode"
    );

    themeIcon.innerHTML = dark
    ? '<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>'
    : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>';
}

function switchDark() {
    dark = !dark;
    localStorage.setItem("dark", dark);
    updateTheme();
}

updateClock();
updateTheme();
setInterval(updateClock, 1000);
