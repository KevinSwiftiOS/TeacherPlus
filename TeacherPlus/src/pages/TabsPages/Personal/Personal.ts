import { Component } from '@angular/core';
import { NavController, ActionSheetController,AlertController, ToastController, LoadingController, Loading  } from 'ionic-angular';
import { StationLettersPage } from '../../PersonalPages/StationLetters/StationLettersPage';
import { SecuritySettingsPage } from '../../PersonalPages/SecuritySettingsPage/SecuritySettingsPage';
import { BasicInfPage } from '../../PersonalPages/BasicInfPage/BasicInfPage';
import {  Camera,ImagePicker,Transfer } from 'ionic-native';

@Component({
  selector: 'page-contact',
  templateUrl: 'Personal.html',
  
})

export class PersonalPage {
 lastImage: string = null;
  loading: Loading;

  constructor(public navCtrl: NavController, public ActionSheetCtrl: ActionSheetController,public alertCtrl: AlertController,
  public toastCtrl: ToastController, public loadingCtrl: LoadingController) {


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
    
    ImagePicker.getPictures({
      maximumImagesCount:1
    }).then(images => {
      let image = images[0];
       let ft = new Transfer();
        let filename = "head" + ".jpg";
        let options = {
            fileKey: 'file',
            fileName: filename,
            mimeType: 'image/jpeg',
            chunkedMode: false,
            headers: {
                'Content-Type' : undefined
            },
            params: {
               authtoken:"0B849459E30161BE5A5E302F257022FA1FCF5D09E7BD2A2D",
               type:1
            }
        }; 
      
        ft.upload(image, "http://dodo.hznu.edu.cn/api/upfile", options, false)
        .then((result: any) => {
          console.log(result.response);
           alert("成功");
        }).catch((error: any) => {
            console.log(error);
             alert("失败");
        }); 

        })
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
    console.log("记载");

  }
  //站内信模块
  pushMyMessage() {
    this.navCtrl.push(StationLettersPage);
  }

 
  

}
