/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
declare var videojs;
@Component({
  selector: 'page-StudyVedioPage',
  templateUrl: 'StudyVedioPage.html'
})
export class StudyVedioPage {

  constructor(public navCtrl: NavController) {
 
 }
  ionViewDidEnter() {
   var player = videojs("example_video_1", {
    "techOrder": ["flash","html"],
    "autoplay":true,
    

}, function(){

    this.on('loadeddata',function(){
        console.log(this)
    })

    this.on('ended',function(){
         this.pause();
         this.hide()
    })

 });
console.log(player.duration);  
}
}
