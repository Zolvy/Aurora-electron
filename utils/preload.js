const { contextBridge, ipcRenderer } = require('electron');

if (!contextBridge) {
  // If contextBridge is not available, fallback to the old way of exposing functionality
  window.electron = {
    send: (channel, data) => {
      const validChannels = ['open-login-window'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      const validChannels = ['cookies'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
  };
} else {
  // If contextBridge is available, use it to expose functionality
  contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => {
      const validChannels = ['open-login-window'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      const validChannels = ['cookies'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
  });
}
