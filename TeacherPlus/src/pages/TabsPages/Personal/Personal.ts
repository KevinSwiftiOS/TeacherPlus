import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { StationLettersPage } from '../../PersonalPages/StationLetters/StationLettersPage';
import { SecuritySettingsPage } from '../../PersonalPages/SecuritySettingsPage/SecuritySettingsPage';
import { BasicInfPage } from '../../PersonalPages/BasicInfPage/BasicInfPage';
import {  Camera,HTTP } from 'ionic-native';
@Component({
  selector: 'page-contact',
  templateUrl: 'Personal.html'
})
export class PersonalPage {
  constructor(public navCtrl: NavController, public ActionSheetCtrl: ActionSheetController) {

  }
  //选择头像
  selectHead() {
    let actionSheet = this.ActionSheetCtrl.create({
      title: '请选择头像来源',
      buttons: [
        {
          text: "相机",
          role: 'destructive',
          handler: () => {
            var options = {
              // Some common settings are 20, 50, and 100
             quality:50,
             destinationType:1,
             sourceType:1,
             allowEdit:true,
             targetWidth:50,
             targetHeight:50,
             saveToPhotoAlbum:true,
            };

            Camera.getPicture(options).then((imageData) => {
              // imageData is either a base64 encoded string or a file URI
              // If it's base64:
              console.log(imageData);
            }, (err) => {
              // Handle error
            });

          }
        },
        {
          text: "相册",
          role: 'destructive',
          handler: () => {
        
        }
        },
        {
          text: "取消",
          role: 'cancel',
          handler: () => {
            

          }
        },
      ]
    });
    actionSheet.present();
  }
  //编辑基本资料
  editBasicInf() {
    this.navCtrl.push(BasicInfPage);
  }
  //安全设置
  securitySettings() {
    this.navCtrl.push(SecuritySettingsPage);
  }
  //退出登录
  exit() {

  }
  //站内信模块
  pushMyMessage() {
    this.navCtrl.push(StationLettersPage);
  }
}
