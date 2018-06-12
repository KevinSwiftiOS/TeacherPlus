import { Component } from '@angular/core';
import { NavController, ActionSheetController, LoadingController, ModalCmp, ModalController } from 'ionic-angular';
import { HttpService } from "../../../services/Commons/HttpService";
import { NavParams } from 'ionic-angular/navigation/nav-params';
//html解析 有时会略过一些非安全标签 
import { DomSanitizer } from '@angular/platform-browser';
import {SlideImagesPage} from "../../Commons/SlideImagesPage/SlideImagesPage";


declare var swal;

//declare var WeChat;

@Component({
    selector: 'page-InfoDetailsPage',
    templateUrl: 'InfoDetailsPage.html',
    providers: [HttpService],
})
export class InfoDetailsPage {
    content;
    title: string;
    canShare = true;
    //预览图片数组
    images = [];
    infocate;
    constructor(public modalCtrl:ModalController, public loadingCtrl:LoadingController, public ActionSheetCtrl:ActionSheetController, public navCtrl: NavController, private httpService: HttpService, private navParams: NavParams, private sanitize: DomSanitizer) {
        this.infocate = this.navParams.get("item").infocate;
        this.httpService.request("api/infomation/" +  this.navParams.get("item").id, "", true).then(
            res => {
                if (res.code == 0) {
                   // console.log(res.data);
                    this.content = this.sanitize.bypassSecurityTrustHtml(res.data.content);
                    this.title = res.data.title;
                    this.canShare = res.data.canShare;
                    var patt = /<img[^>]+src=['"]([^'"]+)['"]+/g;
                   var temp;
                    
                    while( (temp= patt.exec(this.content)) != null ) {
                        this.images.push(temp[1]);
                    }
                   
                   
                   // console.log(res.data);
                
            }
                else
                    swal("请求失败", res.message, "error");
            }
        )
    }
     //QQ好友 微信好友 朋友圈分享分享
  share() {
    var param = {
      type:1,
      id: this.navParams.get("item").id
    };
   
    this.httpService.request("api/common/shareInfomation",param,true).then(
    res => {
      if(res.code == 0){
       
        this.httpService.shareService(res.data);
     
      }else
      swal("请求失败",res.message,"error");
    })

    
  }
  //获取当前元素
  imgModal(event) {
   // var obj = event.srcElement;
 var index = 0;
 
    var indexImg = (event.srcElement.src);
    for(;index < this.images.length;index++)
    if(indexImg == this.images[index])
    break;
   if(index < this.images.length) {
    let profileModal = this.modalCtrl.create(SlideImagesPage, { imgs: this.images, index: index });




    profileModal.onDidDismiss(data => {
      //这里写相关操作

    });
    profileModal.present();
    }
}
}
