import { app, BrowserWindow } from "electron";
import { PARAMS, VALUE, MicaBrowserWindow, IS_WINDOWS_11, WIN10 } from 'mica-electron';
import * as path from "path";
import express, { Request, Response, NextFunction } from "express";
import expressLayouts from "express-ejs-layouts";

let appPort = 3000;
let mainWindow: MicaBrowserWindow | null;

let pages = {
  "/": (req: Request, res: Response) => {
    res.render("../web/index.ejs", { title: "Aura" });
  },
  "/home": (req: Request, res: Response) => {
    res.render("../web/views/home", { title: "Aura" });
  },
};

function createWindow() {
  mainWindow = new MicaBrowserWindow({
    width: 1740,
    height: 900,
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
      color: "rgba(29, 28, 0, 0)", // Slightly transparent to blend better
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

  // Apply Mica effect for Windows 11
  if (IS_WINDOWS_11) {
  //  mainWindow.setMicaEffect();
    // Alternatively, you can use:
    // mainWindow.setMicaTabbedEffect();
     mainWindow.setMicaAcrylicEffect();
  }

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
  /***************/
  mainWindow.loadURL(`http://localhost:${appPort}`);
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
