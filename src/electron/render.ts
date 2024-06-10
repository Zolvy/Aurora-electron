import 
{
app,
BrowserWindow, 
ipcMain, 
dialog,
Tray
} 
from "electron";
import './rpc'
import { PARAMS, VALUE, MicaBrowserWindow, IS_WINDOWS_11, WIN10 } from 'mica-electron';
import * as path from "path";
import express, { Request, Response, NextFunction } from "express";
import expressLayouts from "express-ejs-layouts";
import { appPort, pages, applyMicaEffect } from "./settings";
import { Build } from './index.json'

let mainWindow: BrowserWindow | null;
function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, "../assets/aurora.png"),
    width: 1300,
    height: 550,
    frame: true,
    x: undefined,
    y: undefined,
    minWidth: 900,
    minHeight: 590,
    backgroundColor: "#1d1c1c",
    title: "Resale",
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 20, y: 13 },
    titleBarOverlay: {
      color: "rgba(29, 28, 0, 0)", 
      symbolColor: "#ffffff",
      height: 50,
    },
    useContentSize: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      preload: path.join(__dirname, "../utils/preload.js"),
    },
  });

  /** Unused for now, Breaks window controls **/
//applyMicaEffect(mainWindow)

  /***** WEBSERVER *****/
  const expressApp = express();
  expressApp.use(express.static(path.join(__dirname, "../src/web")));

  expressApp.set("views", path.join(__dirname, "../src/web"));
  expressApp.set("view engine", "ejs");
  expressApp.use(expressLayouts);
  expressApp.set("layout", "layout/chrome-drag");
  expressApp.use((req, res, next) => {
    if (req.path !== '/') {
      res.locals.layout = 'layout/chrome-player-layout';
    }
    next();
  });
  for (const [path, handler] of Object.entries(pages)) {
    expressApp.get(path, handler);
  }

  expressApp.listen(appPort, () => {
    console.log(`Express server running at http://localhost:${appPort}`);
  });

  expressApp.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
  });
  mainWindow.loadURL(`http://localhost:${appPort}`);
  /***************/
}

app.whenReady().then(() => {
console.log("Electron App Created, ID:", Build )
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  
});
});

//open file
ipcMain.on('open-file-dialog', (event) => {
  dialog.showOpenDialog({ properties: ['openDirectory'] }).then((result) => {
    if (!result.canceled && result.filePaths.length > 0) {
      event.reply('selected-file', result.filePaths[0]);
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
