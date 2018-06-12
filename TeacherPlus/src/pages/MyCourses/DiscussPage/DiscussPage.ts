/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import {DiscussDetailsPage} from "../Discuss/DiscussDetailPage/DiscussDetailsPage"
import {HttpService} from "../../../services/Commons/HttpService";
import { NavController, Platform } from 'ionic-angular';

import {WriteDiscussPage} from "../Discuss/WriteDiscussPage/WriteDiscussPage";
import { ColumnEntity } from "../../../services/Tabs/Info/ColumnEntity";

import { ExtraEntity } from "../../../services/Tabs/Info/ExtraEntity";
declare var swal;
@Component({
  selector: 'page-DiscussPage',
  templateUrl: 'DiscussPage.html',
  providers:[HttpService]
})
export class DiscussPage {
 items = new Array();
 extra: ExtraEntity;
 columns: ColumnEntity[];
 isAndroid = false;
static navCtrl;
  constructor(private httpService:HttpService,public navCtrl:NavController,public platform:Platform) {
    if(!this.platform.is('ios')) 
    this.isAndroid = true;
    
 }

detail(item) {
 this.navCtrl.push(DiscussDetailsPage,{item:item});
}

   //上拉刷新
   doRefresh(refresher) {
    this.httpService.request("api/threads",{projectid:localStorage.getItem("projectid")},false).then(
      res => {
        refresher.complete();  
        if(res.code == 0){
          refresher.complete();
         this.items = res.data.data;
         this.extra = res.data.extra;
        }else
        swal("请求失败",res.message,"error");
      }
    )
  }
 //删除帖子
 remove(item,index){
 
   var out = this;
   this.httpService.request("api/threads/remove/" + item.id,{},true).then(
     res => {
       if(res.code == 0){
        swal({
          title: "恭喜您",
          text: "删除成功",
          type: "success",
          height: 10000,
          width: 100,
      },
      function () {
        //重置密码
        out.items.splice(index,1);
      
          return true;
      });
         
       }else{
         swal("删除失败",res.message,"error");
       }
     }
   )
 }
 //发表帖子
 create() {
  this.navCtrl.push(WriteDiscussPage);
 }
ionViewWillEnter() {
  var param = {
    projectid:localStorage.getItem("projectid"),
    index:1,
    size:10,
    keyword:""
  }
  this.httpService.request("api/threads",param,true).then(
    res => {
      if(res.code == 0){
       this.items = res.data.data;
       this.extra = res.data.extra;
      }else
      swal("请求失败",res.message,"error");
    }
  )
}
//下拉刷新
doInfinite(scroll) {

  if (this.extra.hasNextPage) {
    //再次发起请求;
    this.httpService.request("api/threads", {projectid:localStorage.getItem("projectid"), index: ++this.extra.index }, false).then(
      res => {
        scroll.complete();
        if (res.code == 0) {
          var resdata = res.data.data;
          for (var j = 0; j < resdata.length; j++)
            this.items.push(resdata[j]);
         
          this.extra = res.data.extra;
        }
        else
          swal("请求失败", res.message, "error");
      }
    )
  } else {
   
    scroll.complete();
  }

}
}

