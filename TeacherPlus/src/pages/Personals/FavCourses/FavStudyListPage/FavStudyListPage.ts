/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component, NgZone, ChangeDetectorRef } from '@angular/core';

import { NavController, PopoverController, ModalController, Platform } from 'ionic-angular';
import { HttpService } from "../../../../services/Commons/HttpService";
import { ActionSheetController } from 'ionic-angular'
import { LoadingController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { FavStudyVideoPage } from "../FavStudyVideoPage/FavStudyVideoPage";
import { FavStudyDiscussPage } from "../FavStudyDiscussPage/FavStudyDiscussPage";
import { FavStudyDocPage } from "../FavStudyDocPage/FavStudyDocPage";
import { FavStudyWorkPage } from "../FavStudyWorkPage/FavStudyWorkPage";
import { FavStudyDownAndHrefPage } from "../FavStudyDownAndHrefPage/FavStudyDownAndHrefPage";
import { daysInMonth } from 'ionic-angular/util/datetime-util';
declare var swal;

@Component({
  selector: 'page-FavStudyListPage',
  templateUrl: 'FavStudyListPage.html'
})
export class FavStudyListPage {
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
  map: { [key: string]: string; } = {
    "观看视频": "videocam",
    "阅读文档": "document",
    "完成作业": "create",
    "参与话题讨论": "chatboxes",
    "下载资源": "download", 
    "超链接": "browsers", 
  };
  isAndroid = false;
  constructor(private modalCtrl: ModalController,
    private chRef: ChangeDetectorRef,
    private zone: NgZone,
    public popoverCtrl: PopoverController,
    public navParams: NavParams,
    public navCtrl: NavController,
    private httpService: HttpService,
    public loadingCtrl: LoadingController,public platform:Platform) {
      if(!this.platform.is('ios')) 
      this.isAndroid = true;
    this.courseTitle = this.navParams.get("item").title;
    this.cover =  this.navParams.get("item").cover;
    this.httpService.request("api/favorites/course/" + this.navParams.get("item").id,
      {}, true)
      .then(
        res => {
          if (res.code == 0) {
            //是否是喜欢课程
      
        
            this.items = res.data.groups;
            //进行循环 将视频时长进行转换
            for (var i = 0; i < this.items.length; i++) {
              var deItems = this.items[i].items;
            
              for (var j = 0; j < deItems.length; j++) {
                //显示icon
              
                deItems[j].icon = this.map[deItems[j].type];
       
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
           
          } else
            swal("请求失败", res.message, "error");
        }
      )
  }
  //详细视频信息
  detail(deItem) {
    switch (deItem.type) {
      case "观看视频":
        let profileModal = this.modalCtrl.create(FavStudyVideoPage, { item: deItem, courseProgress: this.loadProgress });
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
        this.navCtrl.push(FavStudyDocPage, { item: deItem });
        break;
      case "完成作业":
        //是否是从作业实践中传过去的
        this.navCtrl.push(FavStudyWorkPage, { item: deItem });
        break;
      case "参与话题讨论":
        this.navCtrl.push(FavStudyDiscussPage, { item: deItem });
        break;
      case "下载资源":
        this.navCtrl.push(FavStudyDownAndHrefPage, { item: deItem});
        break;
      case "超链接":
        this.navCtrl.push(FavStudyDownAndHrefPage, { item: deItem });
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
         this.iconName = "star";
         
       }else{
         swal("收藏失败",res.message,"error");
       }
      }
   )
  }
 }
}