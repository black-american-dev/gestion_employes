const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

// global, permanent, writable directory
const USER_DATA_DIR = app.getPath('userData')
const UPLOADS_DIR = path.join(USER_DATA_DIR, 'uploads')

// make sure it exists
const fs = require('fs')
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

// expose to backend
process.env.USER_DATA_DIR = USER_DATA_DIR
process.env.UPLOADS_DIR = UPLOADS_DIR

let mainWindow;

async function startBackend() {
  try {
    console.log("Starting backend...");
    await import("../backend/src/server.js");
    console.log("Backend started");
  } catch (err) {
    console.error("Backend failed to start:", err);
    throw err;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const indexPath = path.join(__dirname, "../frontend/dist/index.html");
  console.log("Loading frontend:", indexPath);

  mainWindow.loadFile(indexPath);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    await startBackend();
    createWindow();
  } catch (err) {
    // write error to file so we can see it
    const logPath = path.join(app.getPath("desktop"), "electron-error-demo.log");
    fs.writeFileSync(logPath, err.stack || err.toString());
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
