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
const analogClock = document.getElementById("analog-clock");
const analogToggle = document.getElementById("analog-toggle");
const dateToggle = document.getElementById("date-toggle");
const numericSetting = document.getElementById("numeric-setting");
const numericToggle = document.getElementById("numeric-toggle");
const dateDisplay = document.getElementById("clock-date");
const hourHand = document.getElementById("hour-hand");
const minuteHand = document.getElementById("minute-hand");
const secondHand = document.getElementById("second-hand");
const modeOptions = document.querySelectorAll(".mode-option");
const timerControls = document.getElementById("timer-controls");
const timerMinutes = document.getElementById("timer-minutes");
const timerSeconds = document.getElementById("timer-seconds");
const timerStartButton = document.getElementById("timer-start");
const timerResetButton = document.getElementById("timer-reset");
const stopwatchControls = document.getElementById("stopwatch-controls");
const stopwatchDisplayControls = document.getElementById("stopwatch-display-controls");
const stopwatchStartButtons = document.querySelectorAll('[data-stopwatch-action="start"]');
const stopwatchLapButtons = document.querySelectorAll('[data-stopwatch-action="lap"]');
const stopwatchResetButtons = document.querySelectorAll('[data-stopwatch-action="reset"]');
const stopwatchLapLists = document.querySelectorAll(".stopwatch-laps");
const stopwatchDisplayLaps = document.getElementById("stopwatch-display-laps");
const colorBackgroundNames = ["Default", "Green", "Blue", "Orange", "Red/Pink"];
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
        name: "Dark",
        path: "./assets/Backgrounds/dark.jpg",
        dark: { color: "#08090c", text: "#ffffff", overlay: "rgba(0, 0, 0, 0.12)", shadow: "0 2px 14px rgba(0, 0, 0, 0.65)" },
        light: { color: "#d9dce2", text: "#171a20", overlay: "rgba(244, 246, 250, 0.68)", shadow: "0 2px 14px rgba(255, 255, 255, 0.7)" }
    },
    {
        name: "Forest",
        path: "./assets/Backgrounds/forest.jpg",
        dark: { color: "#12382f", text: "#f1fff8", overlay: "rgba(5, 27, 22, 0.46)", shadow: "0 2px 14px rgba(0, 0, 0, 0.62)" },
        light: { color: "#dcebe1", text: "#193b30", overlay: "rgba(238, 249, 239, 0.68)", shadow: "0 2px 14px rgba(255, 255, 255, 0.72)" }
    },
    {
        name: "Mountain",
        path: "./assets/Backgrounds/mountain.jpg",
        dark: { color: "#5f7f9c", text: "#000000", overlay: "rgba(0, 0, 0, 0.25)", shadow: "none" },
        light: { color: "#e3eafa", text: "#1a304a", overlay: "rgba(239, 245, 255, 0.72)", shadow: "0 2px 14px rgba(255, 255, 255, 0.75)" }
    }
];
const backgroundNames = [...colorBackgroundNames, ...imageBackgrounds.map((background) => background.name)];
const fonts = ["monospace", "sans-serif", "serif", "courier", "arial", "verdana", "georgia", "helvetica", "tahoma", "trebuchet ms"];
const fontNames = ["Monospace", "Sans-serif", "Serif", "Courier", "Arial", "Verdana", "Georgia", "Helvetica", "Tahoma", "Trebuchet MS"];

let dark = localStorage.getItem("dark") !== "false";
const savedBackgroundIndex = Number(localStorage.getItem("backgroundIndex")) || 0;
let backgroundIndex = ((savedBackgroundIndex % backgroundNames.length) + backgroundNames.length) % backgroundNames.length;
let fontIndex = Number(localStorage.getItem("fontIndex")) % fonts.length || 0;
let analogMode = localStorage.getItem("analogMode") === "true";
let showDate = localStorage.getItem("showDate") === "true";
let numericDate = localStorage.getItem("numericDate") === "true";
let activeMode = "clock";
let timerRemaining = 300000;
let timerDeadline = 0;
let timerRunning = false;
let stopwatchElapsed = 0;
let stopwatchStartedAt = 0;
let stopwatchRunning = false;

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
    const now = new Date();
    const time = now.toLocaleTimeString("nl-NL");

    if (timerRunning) {
        timerRemaining = Math.max(0, timerDeadline - Date.now());
        if (timerRemaining === 0) {
            timerRunning = false;
            timerStartButton.textContent = "Start";
            playTimerAlert();
            document.body.classList.add("timer-flash");
            window.setTimeout(() => document.body.classList.remove("timer-flash"), 700);
        }
    }

    if (activeMode === "timer") {
        clock.textContent = formatDuration(timerRemaining, false);
        document.title = `${clock.textContent} | Timer`;
        return;
    }

    if (activeMode === "stopwatch") {
        const elapsed = stopwatchElapsed + (stopwatchRunning ? performance.now() - stopwatchStartedAt : 0);
        clock.textContent = formatDuration(elapsed, true);
        document.title = `${clock.textContent} | Stopwatch`;
        return;
    }

    const seconds = now.getSeconds();
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;

    clock.textContent = time;
    dateDisplay.textContent = numericDate
        ? now.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
        : now.toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    hourHand.style.transform = `translateX(-50%) rotate(${hours * 30}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minutes * 6}deg)`;
    secondHand.style.transform = `translateX(-50%) rotate(${seconds * 6}deg)`;
    analogClock.setAttribute("aria-label", `Analog clock, ${time}`);
    document.title = `${time} | ${pageTitle}`;
}

function formatDuration(milliseconds, tenths) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const base = [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
    return tenths ? `${base}.${Math.floor((milliseconds % 1000) / 100)}` : base;
}

function getTimerDuration() {
    const minutes = Math.min(5999, Math.max(0, Number(timerMinutes.value) || 0));
    const seconds = Math.min(59, Math.max(0, Number(timerSeconds.value) || 0));
    return (minutes * 60 + seconds) * 1000;
}

function playTimerAlert() {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.8);
    oscillator.addEventListener("ended", () => audioContext.close(), { once: true });
}

function updateToolControls() {
    document.body.classList.toggle("stopwatch-mode", activeMode === "stopwatch");
    timerControls.hidden = activeMode !== "timer";
    stopwatchControls.hidden = activeMode !== "stopwatch";
    stopwatchDisplayControls.hidden = activeMode !== "stopwatch";
    stopwatchDisplayLaps.hidden = activeMode !== "stopwatch";
    timerStartButton.textContent = timerRunning ? "Pause" : "Start";
    stopwatchStartButtons.forEach((button) => {
        button.textContent = stopwatchRunning ? "Pause" : "Start";
    });
    stopwatchLapButtons.forEach((button) => {
        button.disabled = !stopwatchRunning;
    });
}

function selectMode(mode) {
    activeMode = mode;
    modeOptions.forEach((option) => option.setAttribute("aria-pressed", String(option.dataset.mode === mode)));
    updateDisplayOptions();
    updateToolControls();
    updateClock();
}

function updateDisplayOptions() {
    analogToggle.checked = analogMode;
    dateToggle.checked = showDate;
    numericToggle.checked = numericDate;
    numericSetting.hidden = !showDate;
    clock.hidden = activeMode === "clock" && analogMode;
    analogClock.hidden = activeMode !== "clock" || !analogMode;
    dateDisplay.hidden = activeMode !== "clock" || !showDate;
    localStorage.setItem("analogMode", analogMode);
    localStorage.setItem("showDate", showDate);
    localStorage.setItem("numericDate", numericDate);
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

    const positionOptions = () => {
        if (!dropdown.open) {
            dropdown.classList.remove("options-below");
            optionsContainer.style.removeProperty("max-height");
            return;
        }

        const panel = settingsMenu.querySelector(".settings-panel");
        const panelBounds = panel.getBoundingClientRect();
        const triggerBounds = dropdown.querySelector("summary").getBoundingClientRect();
        const panelScrolls = getComputedStyle(panel).overflowY !== "visible";
        const topLimit = panelScrolls ? panelBounds.top : 0;
        const bottomLimit = panelScrolls ? panelBounds.bottom : window.innerHeight;
        const spaceAbove = Math.max(0, triggerBounds.top - topLimit - 6);
        const spaceBelow = Math.max(0, bottomLimit - triggerBounds.bottom - 6);
        const openBelow = spaceBelow > spaceAbove;
        const availableSpace = openBelow ? spaceBelow : spaceAbove;

        dropdown.classList.toggle("options-below", openBelow);
        optionsContainer.style.maxHeight = `${Math.min(240, window.innerHeight * 0.4, availableSpace)}px`;
    };

    dropdown.addEventListener("toggle", positionOptions);
    window.addEventListener("resize", positionOptions);

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
document.addEventListener("click", (event) => {
    if (!settingsMenu.contains(event.target)) {
        settingsMenu.open = false;
    }
});
settingsMenu.addEventListener("toggle", updateSettingsButton);
modeOptions.forEach((option) => option.addEventListener("click", () => selectMode(option.dataset.mode)));
timerStartButton.addEventListener("click", () => {
    if (timerRunning) {
        timerRemaining = Math.max(0, timerDeadline - Date.now());
        timerRunning = false;
    } else {
        if (timerRemaining <= 0) {
            const minutes = Math.max(0, Number(timerMinutes.value) || 0);
            const seconds = Math.min(59, Math.max(0, Number(timerSeconds.value) || 0));
            timerRemaining = (minutes * 60 + seconds) * 1000;
        }
        if (timerRemaining > 0) {
            timerDeadline = Date.now() + timerRemaining;
            timerRunning = true;
        }
    }
    updateToolControls();
    updateClock();
});
timerResetButton.addEventListener("click", () => {
    timerRunning = false;
    timerRemaining = getTimerDuration();
    timerStartButton.textContent = "Start";
    updateClock();
});
timerMinutes.addEventListener("input", () => {
    if (!timerRunning) {
        timerRemaining = getTimerDuration();
        updateClock();
    }
});
timerSeconds.addEventListener("input", () => {
    if (!timerRunning) {
        timerRemaining = getTimerDuration();
        updateClock();
    }
});
stopwatchStartButtons.forEach((button) => button.addEventListener("click", () => {
    if (stopwatchRunning) {
        stopwatchElapsed += performance.now() - stopwatchStartedAt;
        stopwatchRunning = false;
    } else {
        stopwatchStartedAt = performance.now();
        stopwatchRunning = true;
    }
    updateToolControls();
    updateClock();
}));
stopwatchLapButtons.forEach((button) => button.addEventListener("click", () => {
    if (stopwatchRunning) {
        const elapsed = stopwatchElapsed + performance.now() - stopwatchStartedAt;
        stopwatchLapLists.forEach((list) => {
            const lap = document.createElement("li");
            lap.textContent = formatDuration(elapsed, true);
            list.prepend(lap);
        });
    }
}));
stopwatchResetButtons.forEach((button) => button.addEventListener("click", () => {
    stopwatchRunning = false;
    stopwatchElapsed = 0;
    stopwatchLapLists.forEach((list) => list.replaceChildren());
    updateToolControls();
    updateClock();
}));
analogToggle.addEventListener("change", () => {
    analogMode = analogToggle.checked;
    updateDisplayOptions();
});
dateToggle.addEventListener("change", () => {
    showDate = dateToggle.checked;
    updateDisplayOptions();
});
numericToggle.addEventListener("change", () => {
    numericDate = numericToggle.checked;
    updateDisplayOptions();
    updateClock();
});
updateDisplayOptions();
updateToolControls();
updateClock();
updateTheme();
updateFont(fontIndex);
updateFullscreenControl();
updateSettingsButton();
setInterval(updateClock, 100);
