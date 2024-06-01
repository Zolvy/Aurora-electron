"use strict";
console.log('Settings Created')
import * as config from './index.json'
/*Web Sever */
export let appPort = 3000;
/* Mica */
import { MicaBrowserWindow, IS_WINDOWS_11 } from 'mica-electron';
export const applyMicaEffect = (window: MicaBrowserWindow) => {
  if (IS_WINDOWS_11) {
    // window.setMicaEffect();
    // window.setMicaTabbedEffect();
    window.setMicaAcrylicEffect();
  }
}; 
/* App Info */
console.log(config.Version);
/* Pages */
import { Request, Response, } from "express";
export let pages = {
  "/": (req: Request, res: Response) => {
    res.render("../web/index.ejs", { title: "Aura" });
  },
  "/home": (req: Request, res: Response) => {
    res.render("../web/views/home", { title: "Aura" });
  },
  "/settings": (req: Request, res: Response) => {
    res.render("../web/views/settings", { title: "Aura" });
  },
}