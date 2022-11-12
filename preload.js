// boilerplate code for electron...
const { contextBridge, ipcRenderer } = require("electron");

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

contextBridge.exposeInMainWorld("api", {
  invoke: (channel, data) => {
    let validChannels = ["doJSONConversion"]; // list of ipcMain.handle channels you want access in frontend to
    if (validChannels.includes(channel)) {
      // ipcRenderer.invoke accesses ipcMain.handle channels like 'doJSONConversion'
      // make sure to include this return statement or you won't get your Promise back
      return ipcRenderer.invoke(channel, data);
    }
  },
});
