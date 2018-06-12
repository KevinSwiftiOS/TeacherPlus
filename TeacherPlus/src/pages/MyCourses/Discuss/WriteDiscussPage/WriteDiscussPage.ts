
/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController, PopoverController, ModalController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Camera, ImagePicker } from 'ionic-native';
import { ActionSheetController } from 'ionic-angular'
import { LoadingController } from 'ionic-angular';
import { HttpService } from "../../../../services/Commons/HttpService";
import { SlideImagesPage } from "../../../Commons/SlideImagesPage/SlideImagesPage";
import { debugOutputAstAsTypeScript } from '@angular/compiler';
declare var swal;
@Component({
  selector: 'page-WriteDiscussPage',
  templateUrl: 'WriteDiscussPage.html'
})
export class WriteDiscussPage {

  cateid = "";
  subject = "";
  content = "";
  totalHtml = "";
  attachs = [];
  //图片区域样式
  loader;
  cates = [];
  //图片
  images = new Array();
  constructor(public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    private httpService: HttpService) {
    //进行初始化

    this.getCates();
    if(this.cates.length > 0){
      this.cateid = this.cates[0].id;
    }
  }

  getCates() {
    this.httpService.request("api/threads/cates", {}, false).then(
      res => {
        if (res.code == 0) {
          this.cates = res.data;
        } else {
          swal("请求失败", res.message, "error");
        }
      });
  }

  //编辑图片 预览删除或者添加图片
  editImg(index) {
    //如果是点击了加号

    //进行删除或者预览
    this.removeOrPreView(index);

  }

  //预览或者删除
  removeOrPreView(index) {
    var out = this;
    let actionSheet = this.actionSheetCtrl.create({
      title: "请选择操作",
      buttons: [
        {
          text: "预览",
          role: "destructive",
          handler: () => {
            var imgs = [];
            for(var i = 0; i < out.images.length;i++)
              imgs.push(out.images[i].fileUrl);
            let profileModal = this.modalCtrl.create(SlideImagesPage, { imgs: imgs, index: index });
            profileModal.onDidDismiss(data => {
              //这里写相关操作

            });
            profileModal.present();
          }
        },
        {
          text: "删除",
          role: 'danger',
          handler: () => {
            var out = this;
            swal({
              title: "提醒",
              text: "你确认删除吗?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              closeOnConfirm: true,
              closeOnCancel: true
            },
              function (isConfirm) {
                if (isConfirm) {
                  //进行删除
                  out.images.splice(index, 1);
                }

              });
            return true;
          }
        },
      ]
    });
    actionSheet.present();
  }
  //添加图片
  addImg() {
    var out = this;
    out.loader = out.loadingCtrl.create(
      {
        content:"正在上传中"
      }
    );
    let actionSheet = this.actionSheetCtrl.create({
      title: '请选择图片来源',
      buttons: [
        {
          text: "从相册中选择照片",
          role: 'destructive',
          handler: () => {
           
            ImagePicker.getPictures({
              maximumImagesCount: 3
            }).then(images => {
              var cnt = 0;
              if(images.length > 0)
              out.loader.present();
              for (var i = 0; i < images.length; i++)
              out.httpService.uploadImage(images[i], "type=9").then(
                res => {
                
                  if (res.code == 0) {
                    cnt++;
                 out.images.push(res.data);
    
                    if (cnt == images.length) {
                      //发送短信
                   out.loader.dismiss();
                    }
    
                  } else {
                    swal("上传失败", res.message, "error");
                    out.loader.dismiss();
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
              out.httpService.uploadImage(imageData, "type=9").then(
                res => {
                if(res.code == 0){
                 out.images.push(res.data);
    
                  
                      //发送短信
                   out.loader.dismiss();
                    
    
                  } else {
                    swal("上传失败", res.message, "error");
                    out.loader.dismiss();
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
  //发送短信
  send() {


    if (this.subject == "")
      swal("提醒", "未写主题", "warning");
    else if (this.cateid == "") {
      swal("提醒", "未选择帖子类别", "warning");
    } else if (this.content == "") {
      swal("提醒", "未填写内容", "warning");
    } else {
      //进行上传
      this.loader = this.loadingCtrl.create({
        content: "正在发送中"
      });
      this.loader.present();


  
      

  
        this.save();
      

    }
  }
  //进行发送
  save() {

    //联系人用字符串进行组装
for(var i = 0; i < this.images.length;i++)
this.totalHtml += "<div><img src =" + "\"" + this.images[i].fileUrl + "\"" + "/></div>";
    //进行传送
    var data = {
      subject: this.subject,
      cateid: this.cateid,
      parentid: "",
      content: this.content + this.totalHtml,
      quoteid: "",
    };

    var params = {
      projectid: localStorage.getItem("projectid"),
      postype: 1,
      data: data
    };
    // 外部的提醒框
    var out = this;

    this.httpService.request("api/threads/create", params, false).then(
      res => {
        if (res.code == 0) {
          swal({
            title: "恭喜您",
            text: "发帖成功",
            type: "success",
            height: 10000,
            width: 100,
          },
            function () {
              //重置密码
              out.loader.dismiss();
              out.navCtrl.pop();
              return true;
            });
        }
        else {
          swal("发帖失败", res.message, "error");
          out.loader.dismiss();
        }
      }

    )
  }

}