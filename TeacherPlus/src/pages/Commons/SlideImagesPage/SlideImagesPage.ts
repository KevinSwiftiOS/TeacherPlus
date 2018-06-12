import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';

import { StatusBar } from '@ionic-native/status-bar';
import { NavController, LoadingController,Slides,NavParams, Platform, ViewController } from 'ionic-angular';

declare var swal;
@Component({
  selector: 'page-SlideImagesPage',
  templateUrl: 'SlideImagesPage.html'
})
export class SlideImagesPage {
  @ViewChild(Slides) slides: Slides;
 
  imgs = new Array();
  index = 0;
  Title = "223";
  constructor(public navCtrl: NavController,public navParams:NavParams,public viewCtrl:ViewController, public statusBar: StatusBar,public platform:Platform) {
    statusBar.backgroundColorByHexString("#000000");
    this.imgs = this.navParams.get("imgs");
  this.index = (this.navParams.get("index"));
 
 // this.indexTitle = "/" + this.imgs.length;

}
dismisssSlide() {
  if (this.platform.is("ios")) {
    this.statusBar.overlaysWebView(false);
    this.statusBar.backgroundColorByHexString("#25A24D");
  }
  this.viewCtrl.dismiss();
}
slideChanged() {
  let currentIndex = this.slides.getActiveIndex();
  //this.indexTitle = (currentIndex + 1)  + "/" + this.imgs.length;
}
}