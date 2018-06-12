/**
 * Created by hcnucai on 2017/3/9. */
 import { Component } from '@angular/core';

 import { NavController, LoadingController, Platform, ViewController } from 'ionic-angular';
 import { NavParams } from 'ionic-angular/navigation/nav-params';
 import { HttpService } from "../../../../services/Commons/HttpService";
 import { VgAPI } from 'videogular2/core';
 import { VgMedia } from 'videogular2/core';
 import { StatusBar } from '@ionic-native/status-bar';
 declare var swal;
 
 @Component({
     selector: 'page-FavStudyVideoPage',
     templateUrl: 'FavStudyVideoPage.html',
     providers: [HttpService]
 })
 export class FavStudyVideoPage {
 
     public videoSrc: any;
     //整体的状态
     deItem;
     interval;
     api: VgAPI;
     media;
   
 
     constructor(public viewController: ViewController,
         public plt: Platform,
         public navCtrl: NavController,
         public loadingCtrl: LoadingController,
         public navParams: NavParams,
         private httpService: HttpService,public statusBar: StatusBar,public platform:Platform) {
            statusBar.backgroundColorByHexString("#000000");
         this.deItem = this.navParams.get("item");
   
         this.videoSrc = this.deItem.metadata.url;
       
         //表示从来没有看过
      
     }
     //视频加载完毕
     onPlayerReady(api: VgAPI) {
         this.api = api;
         this.media = this.api.getDefaultMedia;
         this.api.currentTime = 0;
             //var out = this;
             this.api.play();
         }
       
     

     
     
 
     cancel() {
        if (this.platform.is("ios")) {
            this.statusBar.overlaysWebView(false);
            this.statusBar.backgroundColorByHexString("#25A24D");
          }
       
         //this.signtime(() => {
             this.viewController.dismiss();
         //});
     }
 }