/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';
import { HttpService } from "../../../../services/Commons/HttpService";
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { ReplyExpersPage } from "../ReplyExpersPage/ReplyExpersPage";
import { ActionSheetController } from 'ionic-angular'
import { LoadingController } from 'ionic-angular';
import { ExperDetailsEntity } from "../../../../services/Tabs/MyCourse/ExperDetailsEntity";
import { SlideImagesPage } from "../../../Commons/SlideImagesPage/SlideImagesPage";
declare var swal;

@Component({
  selector: 'page-ExperDetailsPage',
  templateUrl: 'ExperDetailsPage.html'
})
export class ExperDetailsPage {
  defaultAvator: string = "assets/img/default-avatar.jpg";
  item: ExperDetailsEntity;
  title;
  content;
  attachs = new Array();
  comments = new Array();
  loader;
  isTop;
  isGood;
  author;
  releaseTime;
  imgs = new Array();
  images = [];
  constructor(public modalCtrl: ModalController, public loadingCtrl: LoadingController, public navCtrl: NavController, private navParams: NavParams, private httpService: HttpService) {


  }
  //回复
  reply() {
    let profileModal = this.modalCtrl.create(ReplyExpersPage, { id: this.navParams.get("item").id });




    profileModal.onDidDismiss(data => {
      //这里写相关操作
      this.httpService.request("api/experiences/" + this.navParams.get("item").id, {}, true).then(
        res => {
          if (res.code == 0) {

            this.item = res.data;
            this.isTop = this.item.isTop;
            this.isGood = this.item.isGood;
            this.author = this.item.author;
            this.releaseTime = this.item.releaseTime;

            this.title = this.item.title;
            this.content = this.item.content;
            this.comments = this.item.comments;

        
            //附件大小进行转换

            this.attachs = this.item.attachs;
            for (var i = 0; i < this.attachs.length; i++) {
              this.attachs[i].fileLength = (this.attachs[i].fileLength / 1048576).toFixed(2);

            }


          } else
            swal("请求失败", res.message, "error");
        }
      )
    });
    profileModal.present();


  }

  //删除回帖
  remove(comment, index) {
    this.loader = this.loadingCtrl.create({
      content: "请稍等"
    });
    var out = this;
    this.loader.present();
    this.httpService.request("api/experiences/removeComment/" + comment.id, "", true).then(
      res => {
        out.loader.dismiss();
        if (res.code == 0) {
          swal("恭喜您", "删除成功", "success");
          out.comments.splice(index, 1);
        }
        else
          swal("删除失败", res.message, "error");
      }
    )
  }
  //点赞帖子
  voteup() {
    var loader = this.loadingCtrl.create({
      content: "请稍等"
    });
    loader.present();
    this.httpService.request("api/experiences/" + this.navParams.get("item").id + "/voteup", "", true).then(
      res => {
        loader.dismiss();
        if (res.code == 0) {
          swal("恭喜您", "点赞成功", "success");
        } else
          swal("点赞失败", res.message, "error");
      }
    )
  }
  //研修心得详情
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













  ionViewWillEnter() {
    this.httpService.request("api/experiences/" + this.navParams.get("item").id, {}, true).then(
      res => {
        if (res.code == 0) {

          this.item = res.data;
          this.isTop = this.item.isTop;
          this.isGood = this.item.isGood;
          this.author = this.item.author;
          this.releaseTime = this.item.releaseTime;

          this.title = this.item.title;
          this.content = this.item.content;
          this.comments = this.item.comments;
          var patt = /<img[^>]+src=['"]([^'"]+)['"]+/g;
          var temp;
           
           while( (temp= patt.exec(this.content)) != null ) {
               this.images.push(temp[1]);
           }
        
          //附件大小进行转换

          this.attachs = this.item.attachs;
          for (var i = 0; i < this.attachs.length; i++) {
            this.attachs[i].fileLength = (this.attachs[i].fileLength / 1048576).toFixed(2);
            if (this.attachs[i].fileType == '图片')
              this.imgs.push(this.attachs[i]);
          }

        } else
          swal("请求失败", res.message, "error");
      }
    )
  }
//获取当前元素
Modal(event) {
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