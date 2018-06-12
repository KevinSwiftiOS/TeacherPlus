
/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Camera, ImagePicker } from 'ionic-native';

import { HttpService } from "../../../../services/Commons/HttpService";
import { ActionSheetController } from 'ionic-angular'
import { LoadingController } from 'ionic-angular';
import { SlideImagesPage } from "../../../Commons/SlideImagesPage/SlideImagesPage";
declare var swal;
@Component({
  selector: 'page-WriteExpersPage',
  templateUrl: 'WriteExpersPage.html'
})
export class WriteExpersPage {
 
  static receives = new Array();
  subject =  "";
  content =  "";
   attachs = [];
  //图片区域样式
  imgsDivStyle; loader;
  //图片
  images = new Array();
  constructor(public modalCtrl:ModalController, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, private httpService: HttpService) {
    //进行初始化
   
  
    this.imgsDivStyle = {
   
      "width": "98%",
      "margin-left": "5px",
      "margin-right": "5px",
      "height": document.body.scrollHeight * 0.3 + "px"
    }
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
            out.images = [];
            for(var i = 0;i < out.attachs.length;i++)
            out.images.push(out.attachs[i].fileUrl);
            let profileModal = this.modalCtrl.create(SlideImagesPage, { imgs: out.images, index: index });




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
                  out.attachs.splice(index, 1);
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
      {content:"正在上传中"}
    );
    let actionSheet = this.actionSheetCtrl.create({
      title: '请选择图片来源',
      buttons: [
        {
          text: "从相册中选取图片",
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
                          out.attachs.push(res.data);
                          if(cnt == images.length){
                            //发送短信
                         out.loader.dismiss();
                          }
                        
                        } else {
                        swal("上传失败",res.message,"error");
                    
                   
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
              out.loader.present();
              // imageData is either a base64 encoded string or a file URI
              // If it's base64:
              out.httpService.uploadImage(imageData, "type=9").then(
                res => {
                
                  if (res.code == 0) {
                
                     
                      
                        out.attachs.push(res.data);
                       
                          //发送短信
                       out.loader.dismiss();
                        
                      
                      } else {
                      swal("上传失败",res.message,"error");
                  
                 
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
    else if (this.content == "")
      swal("提醒", "未添加内容", "warning");
    else {
      //进行上传
      this.loader = this.loadingCtrl.create({
        content: "正在发送中"
      });
      this.loader.present();

    
      var success = true;
      
  

      this.save();
    }
       
      
    
  }
  //进行发送
  save() {

   
   //进行传送
   
  
  
   
   var params = {
    title:this.subject,
   
    content:this.content,
    projectid:localStorage.getItem("projectid"),
    id:"",
    attachs:this.attachs,
   };
   // 外部的提醒框
   var out = this;
 
    this.httpService.request("api/experiences/save",params,true).then(
      res => {
        if(res.code == 0){
        swal({
          title: "恭喜您",
          text: "发送成功",
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
        swal("修改失败",res.message,"error");
        out.loader.dismiss(); 
      }
     }
      
    )
  }
}