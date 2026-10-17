const clock = document.getElementById("clock");
const pageTitle = document.title;
const settingsMenu = document.getElementById("settings-menu");
const settingsButton = settingsMenu.querySelector("summary");
const darkswitch = document.getElementById("dark-light");
const themeIcon = document.getElementById("theme-icon");
const fullscreenButton = document.getElementById("fullscreen");
const fullscreenIcon = document.getElementById("fullscreen-icon");
const backgroundDropdown = document.getElementById("background-dropdown");
const fontDropdown = document.getElementById("font-dropdown");
const backgroundNames = ["Default", "Mint", "Sky", "Amber", "Rose"];
const fonts = ["monospace", "sans-serif", "serif", "courier", "arial", "verdana", "georgia", "helvetica", "tahoma", "trebuchet ms"];
const fontNames = ["Monospace", "Sans-serif", "Serif", "Courier", "Arial", "Verdana", "Georgia", "Helvetica", "Tahoma", "Trebuchet MS"];

let dark = localStorage.getItem("dark") !== "false";
let backgroundIndex = Number(localStorage.getItem("backgroundIndex")) || 0;
let fontIndex = Number(localStorage.getItem("fontIndex")) % fonts.length || 0;

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
    document.title = `${clock.textContent} | ${pageTitle}`;
}

function updateSettingsButton() {
    const label = settingsMenu.open ? "Close settings" : "Open settings";
    settingsButton.setAttribute("aria-label", label);
    settingsButton.title = label;
}

function updateTheme() {
    const theme = dark ? themes.dark : themes.light;
    const index = backgroundIndex % theme.backgrounds.length;
    const backgroundColor = theme.backgrounds[index];
    const textColor = theme.text[index];

    document.body.style.setProperty("--page-background", backgroundColor);
    document.body.style.setProperty("--page-text", textColor);
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.color = textColor;

    darkswitch.setAttribute(
        "aria-label",
        dark ? "Switch to light mode" : "Switch to dark mode"
    );

    themeIcon.innerHTML = dark
    ? '<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>'
    : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>';

    localStorage.setItem("backgroundIndex", backgroundIndex);
}

function switchBackground(index) {
    backgroundIndex = index;
    updateTheme();
}

function switchDark() {
    dark = !dark;
    localStorage.setItem("dark", dark);
    updateTheme();
}

function updateFont(index) {
    fontIndex = index;
    document.body.style.fontFamily = fonts[fontIndex];
    localStorage.setItem("fontIndex", fontIndex);
}

function setupDropdown(dropdown, names, selectedIndex, onChange, optionFonts = []) {
    const selectedValue = dropdown.querySelector(".dropdown-value");
    const optionsContainer = dropdown.querySelector(".dropdown-options");

    names.forEach((name, index) => {
        const option = document.createElement("button");
        option.type = "button";
        option.className = "dropdown-option";
        option.dataset.value = index;
        option.textContent = name;
        option.setAttribute("aria-pressed", "false");

        if (optionFonts[index]) {
            option.style.fontFamily = optionFonts[index];
        }

        option.addEventListener("click", () => {
            selectedIndex = index;
            selectedValue.textContent = name;
            dropdown.querySelector("summary").setAttribute("aria-label", `${name}`);
            optionsContainer.querySelectorAll(".dropdown-option").forEach((item) => {
                item.setAttribute("aria-pressed", String(item === option));
            });
            dropdown.open = false;
            onChange(index);
        });

        optionsContainer.append(option);
    });

    selectedValue.textContent = names[selectedIndex] || names[0];
    optionsContainer.children[selectedIndex]?.setAttribute("aria-pressed", "true");

    dropdown.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            dropdown.open = false;
            dropdown.querySelector("summary").focus();
        }
    });

    document.addEventListener("click", (event) => {
        if (!dropdown.contains(event.target)) {
            dropdown.open = false;
        }
    });
}

setupDropdown(backgroundDropdown, backgroundNames, backgroundIndex % backgroundNames.length, switchBackground);
setupDropdown(fontDropdown, fontNames, fontIndex, updateFont, fonts);

function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
}

function updateFullscreenControl() {
    const isFullscreen = Boolean(document.fullscreenElement);
    const label = isFullscreen ? "Exit fullscreen" : "Enter fullscreen";

    fullscreenButton.setAttribute("aria-label", label);
    fullscreenButton.title = label;
    fullscreenIcon.innerHTML = isFullscreen
        ? '<path d="M9 3v3a3 3 0 0 1-3 3H3m18 0h-3a3 3 0 0 1-3-3V3M3 15h3a3 3 0 0 1 3 3v3m12-6h-3a3 3 0 0 0-3 3v3"/>'
        : '<path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3"/>';
}

document.addEventListener("fullscreenchange", updateFullscreenControl);
settingsMenu.addEventListener("toggle", updateSettingsButton);
updateClock();
updateTheme();
updateFont(fontIndex);
updateFullscreenControl();
updateSettingsButton();
setInterval(updateClock, 1000);
