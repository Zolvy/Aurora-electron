import { app, BrowserWindow, session } from "electron";
import * as path from "path";
import express, { Request, Response } from "express";
let appPort = 3000;
let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1244,
    height: 700,
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
      color: "#1d1c1c",
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

  /***** WEBSERVER *****/
  let expressApp = express();
  // Serve static files from the 'renderer' directory
  expressApp.use(express.static(path.join(__dirname, "../src/web")));

  expressApp.set("views", path.join(__dirname, "../src/web"));
  expressApp.set("view engine", "ejs");

  expressApp.get("/", (req: Request, res: Response) => {
    res.render("index", { title: "Aura" });
  });

  expressApp.listen(appPort, () => {
    console.log(`Express server running at http://localhost:${appPort}`);
  });

  expressApp.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
  });
  /***************/
  mainWindow.loadURL(`http://localhost:${appPort}`);
}

app.whenReady().then(() => {
  createWindow();
  /***** Haxer!!!! ****/
  session.defaultSession.webRequest.onBeforeSendHeaders(
    async (details, callback) => {
      if (details.url === "https://buy.itunes.apple.com/account/web/info") {
        details.requestHeaders["sec-fetch-site"] = "same-site";
        details.requestHeaders["DNT"] = "1";
        const itspod = await mainWindow?.webContents.executeJavaScript(
          'window.localStorage.getItem("itspod")',
        );
        if (itspod !== null) {
          details.requestHeaders["Cookie"] = `itspod=${itspod}`;
        }
      }
      if (details.url.includes("apple.com")) {
        details.requestHeaders["DNT"] = "1";
        details.requestHeaders["authority"] = "amp-api.music.apple.com";
        details.requestHeaders["origin"] = "https://beta.music.apple.com";
        details.requestHeaders["referer"] = "https://beta.music.apple.com";
        details.requestHeaders["sec-fetch-dest"] = "empty";
        details.requestHeaders["sec-fetch-mode"] = "cors";
        details.requestHeaders["sec-fetch-site"] = "same-site";
      }
      callback({ requestHeaders: details.requestHeaders });
    },
  );
  /********************/
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
