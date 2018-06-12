/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController,PopoverController } from 'ionic-angular';
import {StudyVideoListPage} from "../ResearchCourses/StudyVideoListPage/StudyVideoListPage";
import {HttpService} from "../../../services/Commons/HttpService";

// import {ProgressPage} from "../ResearchCourses/ProgressPage/ProgressPage";
declare var swal;
@Component({
  selector: 'page-ResearchCoursePage',
  templateUrl: 'ResearchCoursePage.html',
  providers:[HttpService]
})
export class ResearchCoursePage {
 items = new Array();
 alertMessage;
  constructor(public navCtrl:NavController, public popoverCtrl:PopoverController,public httpService:HttpService) {
    
    
 
    
 }
 //推入视频列表
 goToStudy(deItem) {
  this.navCtrl.push(StudyVideoListPage,{item:deItem});
 }
 //页面进入时
 ionViewWillEnter() {
  this.httpService.request("api/courses",{projectid:localStorage.getItem("projectid")},true).then(
    res => {
    
      if(res.code == 0) {
      
        this.items = res.data.groups;
        this.alertMessage = res.data.alertMessage;
        for(var i = 0 ; i < this.items.length;i++){
          var deItems = this.items[i].items;
          for(var j = 0; j < deItems.length;j++)
          deItems[j].progress = (deItems[j].progress).substr(0,(deItems[j].progress.length - 1));
        this.items[i].items = deItems;
        }
      
    
      }else{
      swal("请求失败",res.message,"error");
    
    }
    }
  )
 }

}
