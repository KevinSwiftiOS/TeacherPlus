/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component, NgZone, ChangeDetectorRef } from '@angular/core';

import { NavController, PopoverController, ModalController, Platform } from 'ionic-angular';
import { HttpService } from "../../../../services/Commons/HttpService";
import { ActionSheetController } from 'ionic-angular'
import { LoadingController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { StudyVideoPage } from "../StudyVideoPage/StudyVideoPage";
import { StudyDocPage } from "../StudyDocPage/StudyDocPage";
import { StudyDiscussPage } from "../StudyDiscussPage/StudyDiscussPage";
import { StudyDownLoadPage } from "../StudyDownLoadPage/StudyDownLoadPage";
import { StudyHrefPage } from "../StudyHrefPage/StudyHrefPage";
import { HomeWorkDetailPage } from "../../ResearchPractice/HomeWorkDetailPage";
import { daysInMonth } from 'ionic-angular/util/datetime-util';
declare var swal;

@Component({
  selector: 'page-StudyVideoListPage',
  templateUrl: 'StudyVideoListPage.html'
})
export class StudyVideoListPage {
  // 实例化
  items = new Array();
  cover: string;
  progress;
  progressPercent = 50;
  interval;
  proStyle;
  loadProgress;
  courseTitle;
  isFavorites = false;
  iconName;
  isAndroid = false;
  map: { [key: string]: string; } = {
    "未做": "radio-button-off",
    "进行中": "contrast",
    "完成": "checkmark-circle"
  };

  constructor(private modalCtrl: ModalController,public platform:Platform,
    private chRef: ChangeDetectorRef,
    private zone: NgZone,
    public popoverCtrl: PopoverController,
    public navParams: NavParams,
    public navCtrl: NavController,
    private httpService: HttpService,
    public loadingCtrl: LoadingController) {
      if(!this.platform.is('ios')) 
      this.isAndroid = true;
    this.courseTitle = this.navParams.get("item").title;
    this.httpService.request("api/courses/" + this.navParams.get("item").id,
      { projectid: localStorage.getItem("projectid") }, true)
      .then(
        res => {
          if (res.code == 0) {
            //是否是喜欢课程
            this.isFavorites = res.data.isFavorites;
        
            if(this.isFavorites == true)
            this.iconName = "heart";
         
            else
            this.iconName = "heart-outline";
            this.loadProgress = (res.data.progress).substr(0, (res.data.progress.length - 1));
            this.items = res.data.groups;
            //进行循环 将视频时长进行转换
            for (var i = 0; i < this.items.length; i++) {
              var deItems = this.items[i].items;
              for (var j = 0; j < deItems.length; j++) {
                if (this.cover == null
                  && deItems[j].metadata.cover != null
                  && deItems[j].metadata.cover != "") {
                  this.cover = deItems[0].metadata.cover;
                }
                //显示icon
                deItems[j].icon = this.map[deItems[j].status];
                if (deItems[j].type == "观看视频") {
                  var duration: number = (deItems[j].metadata.duration);
                  var hour = Math.floor(duration / 3600);
                  duration -= hour * 3600;
                  var min = Math.floor(duration / 60);
                  duration -= 60 * min;
                  var second = duration;
                  deItems[j].metadata.length = this.PrefixInteger(hour, 2) + ":" + this.PrefixInteger(min, 2) + ":" + this.PrefixInteger(second, 2);
                }
                //this.items[i].items = deItems;
              }
            }
            if (this.cover == null) {
              this.cover = "./img/tplogo.png";
            }
          } else
            swal("请求失败", res.message, "error");
        }
      )
  }
  //详细视频信息
  detail(deItem) {
    switch (deItem.type) {
      case "观看视频":
        let profileModal = this.modalCtrl.create(StudyVideoPage, { item: deItem, courseProgress: this.loadProgress });
        profileModal.onDidDismiss(data => {
          //这里写相关操作 查看是否已经一个是视频观看完毕
          if (data != null) {
            //deItem = data.item;
            deItem.icon = this.map[deItem.status];
            this.loadProgress = data.courseProgress;
          }
        });
        profileModal.present();
        break;
      case "阅读文档":
        this.navCtrl.push(StudyDocPage, { item: deItem });
        break;
      case "完成作业":
        //是否是从作业实践中传过去的
        this.navCtrl.push(HomeWorkDetailPage, { item: deItem, isPractice: false });
        break;
      case "参与话题讨论":
        this.navCtrl.push(StudyDiscussPage, { item: deItem });
        break;
      case "下载资源":
        this.navCtrl.push(StudyDownLoadPage, { item: deItem });
        break;
      case "超链接":
        this.navCtrl.push(StudyHrefPage, { item: deItem });
        break;
      default:
        break;
    }

  }

  //2位补全
  PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
  }

 //收藏课程
 collect() {
  if(this.isFavorites == true)
  swal("提醒","该课程已收藏","warning");
  else{
   this.httpService.request("api/favorites/add/" + this.navParams.get("item").id,{},true).then(
     res => {
       if(res.code == 0){
         swal("恭喜您","收藏成功","success");
         this.isFavorites = true;
         this.iconName = "heart";
         
       }else{
         swal("收藏失败",res.message,"error");
       }
      }
   )
  }
 }
}