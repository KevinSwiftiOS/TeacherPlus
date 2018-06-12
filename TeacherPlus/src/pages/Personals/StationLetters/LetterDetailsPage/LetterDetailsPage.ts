/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { HttpService } from "../../../../services/Commons/HttpService";
import { WriteLettersPage } from "../WriteLettersPage/WriteLettersPage";
import { SlideImagesPage } from "../../../Commons/SlideImagesPage/SlideImagesPage";
import { ImageViewerController } from 'ionic-img-viewer';
declare var swal;
@Component({
  selector: 'page-LetterDetailsPage',
  templateUrl: 'LetterDetailsPage.html'
})

export class LetterDetailsPage {
  item: any;
  isReceive: any;
  attachs;
  navTitle;

  //   ngAfterViewInit() {
  //     this.slides.autoplay = 2000;
  //     this.slides.autoplayDisableOnInteraction = false;
  // }
  imgs = new Array();

  constructor(public imageViewerCtrl:ImageViewerController, public modalCtrl: ModalController, public LoadingCtrl: LoadingController, public navCtrl: NavController, public navParam: NavParams, public httpService: HttpService) {
    this.item = this.navParam.get("item");
    this.attachs = this.item.attachs;
  
    //进行遍历
    for (var i = 0; i < this.attachs.length; i++) {
      this.attachs[i].fileLength = (this.attachs[i].fileLength / 1048576).toFixed(2);
      if (this.attachs[i].fileType == '图片')
        this.imgs.push(this.attachs[i]);
    }

    this.isReceive = this.navParam.get("isReceive");
    if (this.item.isReaded == false) {
      this.httpService.request("api/privateMessage/signread/" + this.item.id, "", true).then(
        res => {
          if (res.code == 0) {

            var messNewCnt = parseInt(localStorage.getItem("messNewCnt")) - 1;
            localStorage.setItem("messNewCnt", messNewCnt.toString());
          }
          else
            swal("标记失败", res.message, "error");
        }
      )
    }
  }
  //回复短信
  reply() {
    if (this.isReceive) {
      this.navCtrl.push(WriteLettersPage, { item: this.navParam.get("item"), canAdd: false });
    } else
      swal("提醒", "不能回复自己", "warning");
  }

  //删除短信
  remove() {
    var loader = this.LoadingCtrl.create({
      content: "请稍等"
    });
    var navCtrl = this.navCtrl;
    loader.present();
    this.httpService.request("api/privateMessage/remove/" + this.item.id, "", true).then(
      res => {
        loader.dismiss();
        if (res.code == 0) {
          navCtrl.pop();
        } else
          swal("删除失败", res.message, "error");
      }
    )
  }
  //附件内容详情 打开超链接
  detailAttach(attach) {

    if (attach.fileType == '图片') {
      //进行遍历

      //进行遍历
      var index = 0;
      for (; index < this.imgs.length; index++) {
        if (this.imgs[index].fileId == attach.fileId)
          break;
      }
      var showImages = new Array();
      for(var j = 0; j < this.imgs.length;j++)
      showImages.push(this.imgs[j].fileUrl);
      let profileModal = this.modalCtrl.create(SlideImagesPage, { imgs: showImages, index: index });




      profileModal.onDidDismiss(data => {
        //这里写相关操作

      });
      profileModal.present();




    } else
      this.httpService.openBrowser(attach.fileUrl);
  }


  // presentImage(myImage) {
  //   console.log(232323232);
  //   const imageViewer = this.imageViewerCtrl.create(myImage);
  //   imageViewer.present();

    
  // }
}
