const clock = document.getElementById("clock");
const darkswitch = document.getElementById("dark-light");
const themeIcon = document.getElementById("theme-icon");

let dark = localStorage.getItem("dark") !== "false";
let backgroundIndex = Number(localStorage.getItem("backgroundIndex")) || 0;

const themes = {
    light: {
        backgrounds: ["#ffffff", "#dcfce7", "#9cd8ff", "#fef3c7", "#fce7f3"],
        text:        ["#000000", "#14532d", "#075985", "#92400e", "#9d174d"]
    },
    dark: {
        backgrounds: ["#000000", "#14532d", "#075985", "#92400e", "#9d174d"],
        text:        ["#ffffff", "#dcfce7", "#9cd8ff", "#fef3c7", "#fce7f3"]
    }
};

function updateClock() {
    clock.textContent = new Date().toLocaleTimeString("nl-NL");
}

function updateTheme() {
    const theme = dark ? themes.dark : themes.light;
    const index = backgroundIndex % theme.backgrounds.length;

    document.body.style.backgroundColor = theme.backgrounds[index];
    document.body.style.color = theme.text[index];

    darkswitch.setAttribute(
        "aria-label",
        dark ? "Switch to light mode" : "Switch to dark mode"
    );

    themeIcon.innerHTML = dark
    ? '<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>'
    : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>';

    localStorage.setItem("backgroundIndex", backgroundIndex);
}

function switchBackground() {
    const theme = dark ? themes.dark : themes.light;

    backgroundIndex = (backgroundIndex + 1) % theme.backgrounds.length;
    updateTheme();
}

function switchDark() {
    dark = !dark;
    localStorage.setItem("dark", dark);
    updateTheme();
}

updateClock();
updateTheme();
setInterval(updateClock, 1000);
