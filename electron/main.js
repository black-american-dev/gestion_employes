const { app, BrowserWindow } = require("electron");
const path = require("path");

// Start backend
require("../backend/src/server");

function createWindow() {
  const win = new BrowserWindow({
    width: 1500,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // DEV
  win.loadURL("http://localhost:5173");

  // PROD (later)
  // win.loadFile(path.join(__dirname, "../frontend/dist/index.html"));
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
