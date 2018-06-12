import { Component } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import {  Splashscreen, CordovaOptions} from 'ionic-native';
import { TabsPage } from '../pages/Tabs/TabsPage/TabsPage';
import { LoginPage } from "../pages/LoginAndReset/LoginPage/LoginPage";
import { Keyboard } from '@ionic-native/keyboard';
import { StatusBar } from '@ionic-native/status-bar';
import { Cordova } from '@ionic-native/core';
//var root;
//declare var Pie;
declare var cordova;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage;

  constructor( private platform: Platform, statusBar: StatusBar,private keyboard: Keyboard) {
    if (localStorage.getItem("authtoken") == null) {
      this.rootPage = LoginPage;
    } else {
      this.rootPage = TabsPage;
    }
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    this.platform.ready().then(() => {

// let status bar overlay webview
//statusBar.overlaysWebView(true);

// set status bar to white

 //    statusBar.backgroundColorByHexString('#25A24D');
      if (this.platform.is("ios")) {
        statusBar.overlaysWebView(false);
        statusBar.backgroundColorByHexString("#25A24D");
      }
    
      Splashscreen.hide();
      keyboard.disableScroll(true);
  

    });
  }
}
