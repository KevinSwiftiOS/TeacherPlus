/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';
import { HttpService } from "../../../services/Commons/HttpService";
import { PersonInfEntity } from "../../../services/Personals/BasicService/PersonInfEntity";
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Camera, ImagePicker } from 'ionic-native';
import { ActionSheetController } from 'ionic-angular'
import { LoadingController } from 'ionic-angular';

declare var swal;
@Component({
  selector: 'page-BasicInfPage',
  templateUrl: 'BasicInfPage.html',
  providers: [HttpService],
})
export class BasicInfPage {
  basicInfo = new PersonInfEntity();
  username = localStorage.getItem("username");
  //保存之前的个人头像 进行对比 
  beforeSaveAvator;
  loader;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public ActionSheetCtrl: ActionSheetController, private httpService: HttpService) {

    this.loader = this.loadingCtrl.create({
      content: "请稍等"
    });
    this.httpService.request("api/account/profile", "", true).then(
      res => {
        this.loader.dismiss();
        if (res.code == 0) {

          this.basicInfo = res.data;


          if (res.data.avator == null) {

            this.basicInfo.avator = "assets/img/default-avatar.jpg";
          }
          //保存记录前的头像
          this.beforeSaveAvator = res.data.avator;
        } else
          swal("请求失败", res.message, "error");
      }
    )

  }
  //选择性别
  selectSex() {
    let actionSheet = this.ActionSheetCtrl.create({
      title: '请选择性别',
      buttons: [
        {
          text: "男",
          role: 'destructive',
          handler: () => {
            this.basicInfo.sex = "男";
          }
        },
        {
          text: "女",
          role: 'destructive',
          handler: () => {
            this.basicInfo.sex = "女";
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
  //保存
  save() {

    var ChinaMobile = new RegExp("(^1(3[4-9]|4[7]|5[0-27-9]|7[8]|8[2-478])\\d{8}$)|(^1705\\d{7}$)");
    var ChinaUnicom = new RegExp("(^1(3[0-2]|4[5]|5[56]|7[6]|8[56])\\d{8}$)|(^1709\\d{7}$)");
    var ChinaTelecom = new RegExp("(^1(33|53|77|8[019])\\d{8}$)|(^1700\\d{7}$)");
    var email = new RegExp("^([a-z0-9_\\.-]+)@([\\da-z\\.-]+)\\.([a-z\\.]{2,6})$");
    var QQ = new RegExp("^" + "\\" + "d{5,10}$");
    var postCode = new RegExp("^[1-9][0-9]{5}$");
    var flags = [true, true, true, true];
    var errorMes = ["手机", "邮箱", "QQ", "邮编"];
    var flag = true;

    if (this.basicInfo.mobile != null && this.basicInfo.mobile != "") {
      if (!((ChinaMobile.exec(this.basicInfo.mobile)) || (ChinaUnicom.exec(this.basicInfo.mobile)) || (ChinaTelecom.exec(this.basicInfo.mobile)))) {
        flag = false;
        flags[0] = false;
      }
    }
    if (this.basicInfo.email != null && this.basicInfo.email != "") {
      if (!(email.exec(this.basicInfo.email))) {
        flag = false;
        flags[1] = false;
      }
    }
    if (this.basicInfo.QQ != null && this.basicInfo.QQ != "") {
      if (!(QQ.exec(this.basicInfo.QQ))) {
        flag = false;
        flags[2] = false;
      }
    }

    if (this.basicInfo.zipcode != null && this.basicInfo.zipcode != "") {
      if (!(postCode.exec(this.basicInfo.zipcode))) {
        flag = false;
        flags[3] = false;
      }
    }
    if (!flag) {
      var err = ""
      for (var i = 0; i < 4; i++) {
        if (flags[i] == false)
          err += errorMes[i] + ",";
      }
      this.loader.dismiss();
      swal("提醒", err + "填写格式错误", "warning");

    } else {
      var avator = this.basicInfo.avator;
      if (this.basicInfo.avator == "assets/img/default-avatar.jpg")
        avator = null;
      var param = {
        name: this.basicInfo.name,
        mobile: this.basicInfo.mobile,
        email: this.basicInfo.email,
        avator: avator,
        addr: this.basicInfo.addr,
        zipcode: this.basicInfo.zipcode,
        QQ: this.basicInfo.QQ,
        sex: this.basicInfo.sex,
        district: this.basicInfo.district,
        company: this.basicInfo.company,
        subject: this.basicInfo.subject
      };
       
      var out = this;
      out.loader = out.loadingCtrl.create(
        {
          content:"正在保存中"
        }
      );
      out.loader.present();
      this.httpService.request("api/account/saveprofile", param, true).then(
        res => {

          out.loader.dismiss();
          if (res.code == 0) {
            //设置参数

            swal("恭喜您", "保存成功", "success");


          }
          else
            swal("保存失败", res.message, "error");
        });
    }
  }
  //保存头像
  selectHead() {
    var out = this;
    out.loader = out.loadingCtrl.create(
      {content:"正在上传中"}
    );
    let actionSheet = this.ActionSheetCtrl.create({
      title: '请选择头像来源',
      buttons: [
        {
          text: "从相册中选取图片",
          role: 'destructive',
          handler: () => {
       
            ImagePicker.getPictures({
              maximumImagesCount: 1
            }).then(images => {
              if(images.length > 0)
              out.loader.present();
           
      out.httpService.uploadImage(images[0], "type=1").then(
        res => {


          if (res.code == 0) {
            var datas = res.data;
           out.loader.dismiss();
            out.basicInfo.avator = res.data.fileUrl;
            out.beforeSaveAvator = res.data.fileUrl;

    


          } else {
            out.loader.dismiss();
            swal("上传失败", res.message, "error");
          }

        }
      )
            })
          }
        },
        {
          text: "拍摄照片",
          role: 'destructive',
          handler: () => {
           
            var options = {
              // Some common settings are 20, 50, and 100
              quality: 100,
              destinationType: 1,
              sourceType: 1,
              allowEdit: false,
              targetWidth: 100,
              targetHeight: 100,
              saveToPhotoAlbum: true,
            };

            Camera.getPicture(options).then((imageData) => {
              // imageData is either a base64 encoded string or a file URI
              // If it's base64:
              out.loader.present();
              out.httpService.uploadImage(imageData, "type=1").then(
                res => {
        
        
                  if (res.code == 0) {
                    var datas = res.data;
                    out.loader.dismiss();
                    out.basicInfo.avator = res.data.fileUrl;
                    out.beforeSaveAvator = res.data.fileUrl;
        
            
        
        
                  } else {
                    out.loader.dismiss();
                    swal("上传失败", res.message, "error");
                  }
        
                }
              )
            }, (err) => {
              // Handle error

            });

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


}











