import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController, LoadingController, Platform } from 'ionic-angular';
import { LettersNotisPage } from '../../Personals/LettersNotisPage/LettersNotisPage';
import { SecuritySettingsPage } from '../../Personals/SecuritySettingsPage/SecuritySettingsPage';
import { BasicInfPage } from '../../Personals/BasicInfPage/BasicInfPage';
import { LoginPage } from '../../LoginAndReset/LoginPage/LoginPage';
import {TabsPage} from "../../Tabs/TabsPage/TabsPage";
import { FavCoursesPage } from "../../Personals/FavCoursesPage/FavCoursesPage";
import {HttpService} from "../../../services/Commons/HttpService";
declare  var swal;
@Component({
  selector: 'page-PersonalTabPage',
  templateUrl: 'PersonalTabPage.html',

})

export class PersonalTabPage {
  //未读的个数
  hasUnread = false;
  //总共未读的个数
  totalUnCnt;
  isAndroid = false;
  constructor(public navCtrl: NavController, public ActionSheetCtrl: ActionSheetController, public alertCtrl: AlertController,
     public loadingCtrl: LoadingController,private httpService:HttpService,public platform:Platform) {
    this.navCtrl = TabsPage.nav;
    if(!this.platform.is('ios')) 
    this.isAndroid = true;
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
    var nav = this.navCtrl;
   
    swal({
      title: "提醒",
      text: "你确认退出吗?",
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
        //进行缓存的清理和跳转
      localStorage.clear();
     nav.push(LoginPage);
      }
      return true;
    });
 
}
  //站内信模块
  pushMyMessage() {
    this.navCtrl.push(LettersNotisPage);
  }
ionViewWillEnter() {

  //查看是否有未读的通知或者站内信

    this.totalUnCnt = parseInt(localStorage.getItem("sysNewCnt")) +  parseInt(localStorage.getItem("messNewCnt"));
    if(this.totalUnCnt > 0)
    this.hasUnread = true;
    else
    this.hasUnread = false;
}
//展示收藏课程的信息
showFavorites() {
  this.navCtrl.push(FavCoursesPage);
}


}
