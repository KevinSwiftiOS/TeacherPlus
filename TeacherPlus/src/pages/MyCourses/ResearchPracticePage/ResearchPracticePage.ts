/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {HttpService} from "../../../services/Commons/HttpService";
import { ActionSheetController } from 'ionic-angular'
import { LoadingController } from 'ionic-angular';
import { HomeWorkDetailPage } from "../ResearchPractice/HomeWorkDetailPage";
declare var swal;
@Component({
  selector: 'page-ResearchPracticePage',
  templateUrl: 'ResearchPracticePage.html'
})
export class ResearchPracticePage {

 items = new Array();
  
 constructor(public loadingCtrl:LoadingController,private httpService:HttpService, public navCtrl: NavController) {

  
 }
 //作业详情
 detail(item){
    //进行判断时间与现在时间
     //与当前时间进行比较
     this.navCtrl.push(HomeWorkDetailPage,{item:item,isPractice:true});
 }
 doRefresh(refresher) {
  this.httpService.request("api/homeworks",{projectid:localStorage.getItem("projectid")},false).then(

    res => {
      refresher.complete();      
      if(res.code == 0){
        
           this.items = res.data;
      }else
      swal("请求失败",res.message,"error");
    }
  )
}
//页面进入时
ionViewWillEnter(){
  this.httpService.request("api/homeworks",{projectid:localStorage.getItem("projectid")},true).then(
    
    res => {
      
      if(res.code == 0){
        
           this.items = res.data;
      }else
      swal("请求失败",res.message,"error");
    }
  )
}
}

