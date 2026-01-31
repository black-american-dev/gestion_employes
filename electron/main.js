const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const fs = require("fs");
const { fork } = require("child_process");

const USER_DATA_DIR = app.getPath("userData");
const UPLOADS_DIR = path.join(USER_DATA_DIR, "uploads");
const DATABASE_DIR = path.join(USER_DATA_DIR, "database");

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(DATABASE_DIR)) fs.mkdirSync(DATABASE_DIR, { recursive: true });

process.env.USER_DATA_DIR = USER_DATA_DIR;
process.env.UPLOADS_DIR = UPLOADS_DIR;
process.env.DATABASE_DIR = DATABASE_DIR;
process.env.ASSETS_DIR = path.join(process.resourcesPath, "backend", "src");

let mainWindow;
let backendProc;

function startBackend() {
  console.log("Starting backend (child process)...");

  const backendPath = path.join(__dirname, "../backend/src/server.js");

  backendProc = fork(backendPath, [], {
    env: process.env,     
    stdio: "inherit",   
  });

  backendProc.on("error", (err) => {
    console.error("Backend process error:", err);
  });

  backendProc.on("exit", (code) => {
    console.log("Backend exited with code:", code);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    icon: path.join(__dirname, "../assets/favicon2.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const indexPath = path.join(__dirname, "../frontend/dist/index.html");
  mainWindow.loadFile(indexPath);

  mainWindow.on("closed", () => (mainWindow = null));
}

app.whenReady().then(() => {
  try {
    Menu.setApplicationMenu(null);
    startBackend();
    createWindow();
  } catch (err) {
    const logPath = path.join(app.getPath("desktop"), "electron-error-demo.log");
    fs.writeFileSync(logPath, err.stack || err.toString());
    app.quit();
  }
});

app.on("before-quit", () => {
  if (backendProc) backendProc.kill();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
