const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false,
      preload: path.join(__dirname, "./preload.js"), // path to your preload.js file
    },
  });

  win.loadFile("ui/index.html");
};

app.whenReady().then(() => {
  createWindow();
});

// Event Handling

/**
 * FUNCTION YOU WANT ACCESS TO ON THE FRONTEND
 */
ipcMain.handle("doJSONConversion", async (event, { handlers, common }) => {
  try {
    fs.mkdirSync("output");
  } catch (e) {
    console.log("Output folder already exist");
  }
  fs.writeFileSync("output/common.json", JSON.stringify(common, null, 2));

  fs.writeFileSync(
    "output/sourceHandler.json",
    JSON.stringify(handlers.sourceHandler, null, 2)
  );
  fs.writeFileSync(
    "output/destinationHandler.json",
    JSON.stringify(handlers.destinationHandler, null, 2)
  );

  // TODO:
  console.log("Run newman commands here!");
  return new Promise(function (resolve, reject) {
    // do stuff
    resolve("this worked!");
  });
});
