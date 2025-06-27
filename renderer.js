const { ipcRenderer } = require("electron");

let recording = false;
let hotkeyTest = "";

// Initialize UI elements
const recordButton = document.getElementById("recordButton");
const hotkeyDisplay = document.getElementById("hotkeyDisplay");
const refreshButton = document.getElementById("refreshButton");
const backButton = document.getElementById("backButton");
const forwardButton = document.getElementById("forwardButton");
const sizeSelect = document.getElementById("sizeSelect");
const hotkeyRecorder = document.getElementById("hotkeyRecorder");
const appVersion = document.getElementById("appVersion");
const settingsButton = document.getElementById("settingsButton");
const settingsDialog = document.getElementById("settingsDialog");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  refreshButton.addEventListener("click", () => ipcRenderer.send("refresh"));
  backButton.addEventListener("click", () => ipcRenderer.send("back"));
  forwardButton.addEventListener("click", () => ipcRenderer.send("forward"));
  sizeSelect.addEventListener("change", handleSizeChange);
  recordButton.addEventListener("click", toggleRecording);
  document.addEventListener("click", cancelRecordingOnClick);
  
  // Settings dialog handlers
  settingsButton.addEventListener("click", showSettingsDialog);
  saveButton.addEventListener("click", saveSettings);
  cancelButton.addEventListener("click", hideSettingsDialog);
  
  // Load current URLs
  loadCurrentURLs();
});

document.addEventListener("keydown", handleKeydown);

// Event Handlers
function handleSizeChange(event) {
  ipcRenderer.send("set_window_size", event.target.value);
  event.target.blur();
}

function toggleRecording() {
  recording = !recording;
  updateRecordingUI();
}

function handleKeydown(event) {
  if (recording && !event.repeat) {
    event.preventDefault();
    processKeydownEvent(event);
  }
}

function cancelRecordingOnClick(event) {
  if (recording && !recordButton.contains(event.target)) {
    cancelRecording();
  }
}

// Helper Functions
function processKeydownEvent(event) {
  const modifierKeys = getModifierKeys(event);
  let keyName = getKeyName(event);

  if (shouldRecordKey(modifierKeys, keyName)) {
    const hotkey = convertToElectronShortcut([...modifierKeys, keyName]);
    const displayHotkey = convertToDisplayShortcut([...modifierKeys, keyName]);

    ipcRenderer.send("set_hotkey", hotkey);
    hotkeyDisplay.value = displayHotkey;
    hotkeyTest = displayHotkey;
    cancelRecording();
  }
}

function getModifierKeys(event) {
  const modifierKeys = [];
  if (event.ctrlKey) modifierKeys.push("Ctrl");
  if (event.shiftKey) modifierKeys.push("Shift");
  if (event.altKey) modifierKeys.push("Alt");
  if (event.metaKey) modifierKeys.push("Meta");
  return modifierKeys;
}

function getKeyName(event) {
  if (event.key === " ") return "Space";

  return event.key;
}

function shouldRecordKey(modifierKeys, keyName) {
  return (
    modifierKeys.length > 0 &&
    keyName &&
    !["Control", "Shift", "Alt", "Meta"].includes(keyName)
  );
}

function updateRecordingUI() {
  if (recording) {
    hotkeyDisplay.value = "Press Shortcut";
    recordButton.textContent = "Stop Recording";
    hotkeyRecorder.style.borderColor = "#82A1C1";
  } else {
    hotkeyDisplay.value = hotkeyTest;
    recordButton.textContent = "Toggle Global";
    hotkeyRecorder.style.borderColor = "#373738";
  }
}

function cancelRecording() {
  recording = false;
  updateRecordingUI();
}

// Conversion Functions
function convertToElectronShortcut(keys) {
  return keys
    .map((key) => {
      switch (key) {
        case "Ctrl":
          return "Control";
        case "Shift":
          return "Shift";
        case "Alt":
          return "Alt";
        case "Meta":
          return process.platform === "darwin" ? "Command" : "Super";
        default:
          return key.toUpperCase();
      }
    })
    .join("+");
}

function convertToDisplayShortcut(keys) {
  return keys
    .map((key) => {
      switch (key) {
        case "Ctrl":
          return "^";
        case "Shift":
          return "⇧";
        case "Alt":
          return "⌥";
        case "Meta":
          return "⌘";
        default:
          return key;
      }
    })
    .join(" ");
}

function convertElectronShortcutToDisplay(shortcut) {
  return shortcut
    .split("+")
    .map((key) => {
      switch (key) {
        case "Control":
          return "^";
        case "Shift":
          return "⇧";
        case "Alt":
          return "⌥";
        case "Command":
        case "Super":
          return "⌘";
        default:
          return key;
      }
    })
    .join(" ");
}

// Settings Dialog Functions
function showSettingsDialog() {
  settingsDialog.style.display = "flex";
  ipcRenderer.send("hide-browser-view");
  lucide.createIcons();
}

function hideSettingsDialog() {
  settingsDialog.style.display = "none";
  ipcRenderer.send("show-browser-view");
}

function loadCurrentURLs() {
  ipcRenderer.send("get-urls");
}

function saveSettings() {
  const urls = {
    url1: document.getElementById("url1").value || "https://chatgpt.com/",
    url2: document.getElementById("url2").value || "https://claude.ai/",
    url3: document.getElementById("url3").value || "https://tidbit.ai/",
    url4: document.getElementById("url4").value || "https://aistudio.google.com/",
    url5: document.getElementById("url5").value || "https://notion.so/",
  };
  
  ipcRenderer.send("update-urls", urls);
  hideSettingsDialog();
}

// IPC Renderer Events
ipcRenderer.on("config", (event, config) => {
  hotkeyDisplay.value = convertElectronShortcutToDisplay(config.hotkey);
  hotkeyTest = convertElectronShortcutToDisplay(config.hotkey);
  sizeSelect.value = config.sizeKey;
  appVersion.textContent = `v${config.appVersion}`;
});

ipcRenderer.on("urls-data", (event, urls) => {
  document.getElementById("url1").value = urls.url1;
  document.getElementById("url2").value = urls.url2;
  document.getElementById("url3").value = urls.url3;
  document.getElementById("url4").value = urls.url4;
  document.getElementById("url5").value = urls.url5;
});
