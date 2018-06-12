/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController, NavParams, LoadingController, ModalController} from 'ionic-angular';
import { Camera, ImagePicker } from 'ionic-native';
import { ActionSheetController } from 'ionic-angular'
import { InvoiceInfEntity } from "../../../services/Payments/PaymentDetailService/PaymentDetailService";
import { HttpService } from '../../../services/Commons/HttpService';
import {SlideImagesPage} from "../../Commons/SlideImagesPage/SlideImagesPage";
declare var swal;
@Component({
  selector: 'page-InvoiceApplyPage',
  templateUrl: 'InvoiceApplyPage.html'
})
export class InvoiceApplyPage {
  item = new InvoiceInfEntity();
  images = new Array();
  showImages = new Array();
  imgsDivStyle;
  loader;
  hasInvoice;
  //item中的evidenceImage 
  itemEvidenceImgUrl = new Array();
  evidenceImgUrl = new Array();
  constructor(public modalCtrl:ModalController, public loadingCtrl:LoadingController, public navCtrl: NavController,public navParams:NavParams,public actionSheetCtrl:ActionSheetController,public httpService:HttpService) {
   this.item = this.navParams.get("item");
   this.hasInvoice = this.navParams.get("hasInvoice");
   //进行初始化
      this.imgsDivStyle = {
     
        "width": "98%",
        "margin-left": "5px",
        "margin-right": "5px",
        "height": document.body.scrollHeight * 0.3 + "px"
      };
     
   if(this.hasInvoice){
      for(var i = 0 ; i < this.item.evidenceImgUrl.length;i++) {
      this.showImages.push(this.item.evidenceImgUrl[i]);
      this.itemEvidenceImgUrl.push(this.item.evidenceImgUrl[i]);
      }
  }
    
}
save() {
  var warningStr = "";
  if(this.item.toCompany == null || this.item.toCompany == "")
  warningStr += "发表抬头，";
  if(this.item.taxID == null || this.item.taxID == "")
  warningStr += "单位税号，";
  if(this.item.userName == null || this.item.userName == "")
  warningStr += "收件人，";
  if(this.item.userAddr == null || this.item.userAddr == "")
  warningStr += "联系地址，";
  if(this.item.userPhone == null || this.item.userPhone == "")
  warningStr += "联系电话，";
  if(warningStr != "")
  warningStr += "未填，";
  
  if(this.item.userPhone != null && this.item.userPhone != "") {
  //匹配手机正则表达式
  var ChinaMobile = new RegExp("(^1(3[4-9]|4[7]|5[0-27-9]|7[8]|8[2-478])\\d{8}$)|(^1705\\d{7}$)");
  var ChinaUnicom = new RegExp("(^1(3[0-2]|4[5]|5[56]|7[6]|8[56])\\d{8}$)|(^1709\\d{7}$)");
  var ChinaTelecom = new RegExp("(^1(33|53|77|8[019])\\d{8}$)|(^1700\\d{7}$)");
  
    if (!((ChinaMobile.exec(this.item.userPhone)) || (ChinaUnicom.exec(this.item.userPhone)) || (ChinaTelecom.exec(this.item.userPhone)))) {
       warningStr += "手机格式填写错误"
    }
  }
  if(warningStr == ""){
    this.loader = this.loadingCtrl.create(
      {content:"正在上传中"}
    );
    this.loader.present();
    //进行保存

    this.finalSave();
  
  }else
  swal("提醒",warningStr,"warning");
}
//最终的保存
finalSave() {
  this.evidenceImgUrl = [];
  if(this.hasInvoice) {
  for(var i = 0; i < this.itemEvidenceImgUrl.length;i++)
  this.evidenceImgUrl.push(this.itemEvidenceImgUrl[i]);
  }
  for(var i = 0; i < this.images.length;i++)
      this.evidenceImgUrl.push(this.images[i]);
  var projectid;
  if(this.hasInvoice)
  projectid = this.item.projectid;
  else
  projectid = this.navParams.get("projectid");
  var param = {
  projectid:projectid,	
  toCompany:this.item.toCompany,	
  taxID:this.item.taxID,
  userName:this.item.userName,
  userPhone:this.item.userPhone,
  userAddr:this.item.userAddr,
  evidenceImgUrl:this.evidenceImgUrl
  };
  var out = this;
  this.httpService.request("api/orders/invoiceapply",param,false).then(
  res => {
   out.loader.dismiss();
   if(res.code == 0){
    swal({
      title: "恭喜您",
      text: "修改成功",
      type: "success",
      height: 10000,
      width: 100,
  },
  function () {
    //重置密码
   
     out.navCtrl.pop();
      return true;
  });
   }else{
     swal("请求失败",res.message,"error");
   }
  }
  )
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
        
          let profileModal = this.modalCtrl.create(SlideImagesPage, { imgs: out.showImages, index: index });




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

                out.showImages.splice(index, 1);
               if(index < out.itemEvidenceImgUrl.length)
                   out.itemEvidenceImgUrl.splice(index,1);
                else{
                  out.images.splice(index - out.itemEvidenceImgUrl.length,1);
                }




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

            for (var i = 0; i < images.length; i++) {
       
              out.httpService.uploadImage(images[i],"type=2").then(
                res => {
                  if(res.code == 0){
                    cnt++;
                    out.images.push(res.data.fileUrl);
                    out.showImages.push(res.data.fileUrl);
                     if(cnt == images.length)
                     out.loader.dismiss();
                  }else{
                    swal("上传失败",res.message,"error");
                    out.loader.dismiss();
                  
                  
                  }
                }
              )
            }
       
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
            this.httpService.uploadImage(imageData,"type=2").then(
              res => {
                if(res.code == 0){
                
                  out.images.push(res.data.fileUrl);
                  out.showImages.push(res.data.fileUrl);
                  
                   out.loader.dismiss();
                }else{
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
ionViewWillLeave(){
  //this.showImages = new Array();
}
}