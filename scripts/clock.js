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
const colorBackgroundNames = ["Default", "Mint", "Sky", "Amber", "Rose"];
const imageBackgrounds = [
    {
        name: "Christmas",
        path: "./assets/Backgrounds/christmas.jpg",
        dark: { color: "#17345d", text: "#ffffff", overlay: "rgba(8, 24, 52, 0.48)", shadow: "0 2px 14px rgba(0, 0, 0, 0.55)" },
        light: { color: "#e7eef9", text: "#172b49", overlay: "rgba(242, 247, 255, 0.54)", shadow: "0 2px 14px rgba(255, 255, 255, 0.65)" }
    },
    {
        name: "Halloween",
        path: "./assets/Backgrounds/halloween.jpg",
        dark: { color: "#2b1c15", text: "#fff2dc", overlay: "rgba(18, 10, 7, 0.38)", shadow: "0 2px 14px rgba(0, 0, 0, 0.6)" },
        light: { color: "#f2e5d1", text: "#321c12", overlay: "rgba(255, 239, 214, 0.55)", shadow: "0 2px 14px rgba(255, 255, 255, 0.62)" }
    },
    {
        name: "Sinterklaas",
        path: "./assets/Backgrounds/sinterklaas.jpg",
        dark: { color: "#172d51", text: "#ffffff", overlay: "rgba(8, 23, 48, 0.48)", shadow: "0 2px 14px rgba(0, 0, 0, 0.55)" },
        light: { color: "#e4ebf6", text: "#172844", overlay: "rgba(238, 245, 255, 0.52)", shadow: "0 2px 14px rgba(255, 255, 255, 0.65)" }
    },
    {
        name: "Windows 11",
        path: "./assets/Backgrounds/win11-dark.png",
        dark: { color: "#08090c", text: "#ffffff", overlay: "rgba(0, 0, 0, 0.12)", shadow: "0 2px 14px rgba(0, 0, 0, 0.65)" },
        light: { color: "#d9dce2", text: "#171a20", overlay: "rgba(244, 246, 250, 0.68)", shadow: "0 2px 14px rgba(255, 255, 255, 0.7)" }
    }
];
const backgroundNames = [...colorBackgroundNames, ...imageBackgrounds.map((background) => background.name)];
const fonts = ["monospace", "sans-serif", "serif", "courier", "arial", "verdana", "georgia", "helvetica", "tahoma", "trebuchet ms"];
const fontNames = ["Monospace", "Sans-serif", "Serif", "Courier", "Arial", "Verdana", "Georgia", "Helvetica", "Tahoma", "Trebuchet MS"];

let dark = localStorage.getItem("dark") !== "false";
const savedBackgroundIndex = Number(localStorage.getItem("backgroundIndex")) || 0;
let backgroundIndex = ((savedBackgroundIndex % backgroundNames.length) + backgroundNames.length) % backgroundNames.length;
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
    const imageIndex = backgroundIndex - colorBackgroundNames.length;
    const image = imageBackgrounds[imageIndex];

    if (image && !dark) {
        dark = true;
        localStorage.setItem("dark", dark);
    }

    darkswitch.disabled = Boolean(image);
    let backgroundColor;
    let textColor;

    if (image) {
        const palette = dark ? image.dark : image.light;
        backgroundColor = palette.color;
        textColor = palette.text;
        document.body.style.backgroundImage = `linear-gradient(${palette.overlay}, ${palette.overlay}), url("${image.path}")`;
        document.body.style.setProperty("--clock-shadow", palette.shadow);
        document.body.classList.add("has-image-background");
    } else {
        const theme = dark ? themes.dark : themes.light;
        const index = backgroundIndex % theme.backgrounds.length;
        backgroundColor = theme.backgrounds[index];
        textColor = theme.text[index];
        document.body.style.backgroundImage = "none";
        document.body.style.removeProperty("--clock-shadow");
        document.body.classList.remove("has-image-background");
    }

    document.body.style.setProperty("--page-background", backgroundColor);
    document.body.style.setProperty("--page-text", textColor);
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.color = textColor;

    const themeLabel = image
        ? "Light mode unavailable for image backgrounds"
        : dark ? "Switch to light mode" : "Switch to dark mode";
    darkswitch.setAttribute("aria-label", themeLabel);
    darkswitch.title = themeLabel;

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
    if (backgroundIndex >= colorBackgroundNames.length) {
        return;
    }

    dark = !dark;
    localStorage.setItem("dark", dark);
    updateTheme();
}

function updateFont(index) {
    fontIndex = index;
    document.body.style.fontFamily = fonts[fontIndex];
    localStorage.setItem("fontIndex", fontIndex);
}

function setupDropdown(dropdown, names, selectedIndex, onChange, optionFonts = [], optionPreviews = []) {
    const selectedValue = dropdown.querySelector(".dropdown-value");
    const optionsContainer = dropdown.querySelector(".dropdown-options");

    names.forEach((name, index) => {
        const option = document.createElement("button");
        option.type = "button";
        option.className = "dropdown-option";
        option.dataset.value = index;
        option.setAttribute("aria-pressed", "false");

        if (optionPreviews[index]) {
            const preview = document.createElement("span");
            preview.className = "background-option-swatch";
            preview.style.backgroundImage = `url("${optionPreviews[index]}")`;
            preview.setAttribute("aria-hidden", "true");
            option.append(preview, document.createTextNode(name));
        } else {
            option.textContent = name;
        }

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

setupDropdown(
    backgroundDropdown,
    backgroundNames,
    backgroundIndex,
    switchBackground,
    [],
    [...colorBackgroundNames.map(() => ""), ...imageBackgrounds.map((background) => background.path)]
);
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
