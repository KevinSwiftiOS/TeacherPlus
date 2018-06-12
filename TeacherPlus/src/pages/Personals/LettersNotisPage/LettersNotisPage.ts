/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';


import { HttpService } from "../../../services/Commons/HttpService";
import { NotiDetialsPage } from "../Notis/NotiDetailsPage/NotiDetailsPage";
import { WriteLettersPage } from "../StationLetters/WriteLettersPage/WriteLettersPage";
import { LetterDetailsPage } from "../StationLetters/LetterDetailsPage/LetterDetailsPage";

import { ExtraEntity } from "../../../services/Tabs/Info/ExtraEntity";
declare var swal;
@Component({
  selector: 'page-LettersNotisPage',
  templateUrl: 'LettersNotisPage.html'
})
export class LettersNotisPage {
  type;
  messNewCnt;
  sysNewCnt;
  msgType;
  privateMessageType;
  receiveItems = new Array();
  sendItems = new Array();
  sysItems = new Array();
  //extra部分
  sysExtra:ExtraEntity;
  receiveExtra:ExtraEntity;
  sendExtra:ExtraEntity;
  isAndroid = false;
  constructor(public navCtrl: NavController, private httpService: HttpService,public platform:Platform) {
    if(!this.platform.is('ios')) 
    this.isAndroid = true;
    this.privateMessageType = "receive";
    this.msgType = "privateMessage";
    this.type = "receive";
    var receiveParam = {
      unreadonly: 0,
      index:1,
      size:10
    };
    this.httpService.request("api/privateMessage",receiveParam, false).then(

      res => {
       
        if (res.code == 0) {

          this.receiveItems = res.data.data;

          //    this.extra = res.data.extra;
          //循环遍历看是否已读
          for (var i = 0; i < this.receiveItems.length; i++) {
            if (this.receiveItems[i].isReaded == 1)
              this.receiveItems[i].iconName = "mail-open";
            else
              this.receiveItems[i].iconName = "mail";

          }
          this.receiveExtra = res.data.extra;
        
        } else
          swal("请求失败", res.message, "error");
      })
  }
  ionViewWillEnter() {

    this.messNewCnt =  parseInt(localStorage.getItem("messNewCnt"));
   

     this.sysNewCnt =  parseInt(localStorage.getItem("sysNewCnt"));

    
  }

  ngDoCheck() {
    this.sysNewCnt = parseInt(localStorage.getItem("sysNewCnt"));
    if (this.sysNewCnt <= 0)
      this.sysNewCnt = "";
    this.messNewCnt = parseInt(localStorage.getItem("messNewCnt"));
    if (this.messNewCnt <= 0)
      this.messNewCnt = "";

  }










  //系统消息中的详情 删除
  sysItemDetail(item) {
    this.navCtrl.push(NotiDetialsPage, { item: item });
  }
  sysItemRemove(item, index) {
    this.httpService.request("api/sysMessage/remove/" + item.id, "", true).then(
      res => {
        if (res.code == 0) {
          this.sysItems.splice(index, 1);
        } else
          swal("删除失败", res.message, "error");
      }
    )
  }





  //收件箱详情删除
  receiveDetail(item) {
    this.navCtrl.push(LetterDetailsPage, { item: item, isReceive: 1 }).then(
      res =>{
        item.iconName = "mail-open";
      }
    )
  }

  receiveRemove(item, index) {
    this.httpService.request("api/privateMessage/remove/" + item.id, "", true).then(
      res => {
        if (res.code == 0) {
          this.receiveItems.splice(index, 1);
        } else
          swal("删除失败", res.message, "error");
      }
    )
  }
//发件箱详情删除
  sendDetail(item) {
    this.navCtrl.push(LetterDetailsPage, { item: item, isReceive: 0 });
 
  }
  sendRemove(item, index) {
    this.httpService.request("api/privateMessage/remove/" + item.id, "", true).then(
      res => {
        if (res.code == 0) {
          this.sendItems.splice(index, 1);
        } else
          swal("删除失败", res.message, "error");
      }
    )
  }


  //刷新
  sendRefresh(refresher) {

    this.httpService.request("api/privateMessage/mysent", {
      index: 1,
      size: 1000
    }, false).then(

      res => {
        refresher.complete();
        if (res.code == 0) {

          this.sendItems = res.data.data;


          //     this.extra = res.data.extra;
          //循环遍历看是否已读
          for (var i = 0; i < this.sendItems.length; i++) {

            this.sendItems[i].iconName = "mail-open";

          }
        } else
          swal("请求失败", res.message, "error");
      })
  }
  receiveRefresh(refresher) {

    this.httpService.request("api/privateMessage", { unreadonly: 0 }, false).then(

      res => {
        refresher.complete();
        if (res.code == 0) {

          this.receiveItems = res.data.data;

          //    this.extra = res.data.extra;
          //循环遍历看是否已读
          for (var i = 0; i < this.receiveItems.length; i++) {
            if (this.receiveItems[i].isReaded == 1)
              this.receiveItems[i].iconName = "mail-open";
            else
              this.receiveItems[i].iconName = "mail";
          }
        } else
          swal("请求失败", res.message, "error");
      })
  }
  notiRefresh(refresher) {
 this.httpService.request("api/sysMessage", "", false).then(
      res => {
        refresher.complete();
        if (res.code == 0) {
          this.sysItems = res.data.data;
          //  this.columns = res.data.columns;
          //this.extra = res.data.extra;
        } else
          swal("请求失败", res.message, "error");
      }
    )
  }
  //刷新
  refresh(refresher) {
  
    switch (this.type) {
      case "receive":
        this.receiveRefresh(refresher);
        break;
      case "send":
        this.sendRefresh(refresher);
        break;
      case "noti":
        this.notiRefresh(refresher);
        break;
      default: break;
    }
  }
  //公有的写信
  writeEmail() {
    this.navCtrl.push(WriteLettersPage, { item: "", canAdd: true });
  }

  //选择收件箱
  selectedReceive() {
    this.type = "receive";
    this.privateMessageType = "receive";
    var receiveParam = {
      unreadonly: 0,
      index:1,
      size:10
    };
    this.httpService.request("api/privateMessage", receiveParam, false).then(

      res => {
        if (res.code == 0) {

          this.receiveItems = res.data.data;

          //    this.extra = res.data.extra;
          //循环遍历看是否已读
          for (var i = 0; i < this.receiveItems.length; i++) {
            if (this.receiveItems[i].isReaded == 1)
              this.receiveItems[i].iconName = "mail-open";
            else
              this.receiveItems[i].iconName = "mail";
          }
          this.receiveExtra = res.data.extra;
        
        } else
          swal("请求失败", res.message, "error");
      })
  }
  //选择发件箱
  selectedSend() {
    var sendParam = {
    
      index:1,
      size:10
    };      
    this.type = "send";
    this.privateMessageType = "send";
    this.httpService.request("api/privateMessage/mysent", sendParam, true).then(

      res => {

        if (res.code == 0) {

          this.sendItems = res.data.data;


          //     this.extra = res.data.extra;
          //循环遍历看是否已读
          for (var i = 0; i < this.sendItems.length; i++) {

            this.sendItems[i].iconName = "mail-open";

          }
          this.sendExtra = res.data.extra;
      
        } else
          swal("请求失败", res.message, "error");
      }
    )




  }
  //选择站内信
  selectedPrivateMessage() {
    this.msgType = "privateMessage";
    this.privateMessageType = "receive";
    this.type = "receive";
    var receiveParam = {
      unreadonly: 0,
      index:1,
      size:10
    };
    this.httpService.request("api/privateMessage", receiveParam, false).then(

      res => {
        if (res.code == 0) {

          this.receiveItems = res.data.data;

          //    this.extra = res.data.extra;
          //循环遍历看是否已读
          for (var i = 0; i < this.receiveItems.length; i++) {
            if (this.receiveItems[i].isReaded == 1)
              this.receiveItems[i].iconName = "mail-open";
            else
              this.receiveItems[i].iconName = "mail";
          }
          this.receiveExtra = res.data.extra;
          
        } else
          swal("请求失败", res.message, "error");
      }
    )




  }
  //选择通知
  selectedSystemMessage() {
    this.type = "noti";
    this.msgType = "systemMessage";
   var notiParam = {
     index:1,
     size:10
   };

    this.httpService.request("api/sysMessage", notiParam, true).then(
      res => {

        if (res.code == 0) {
          this.sysItems = res.data.data;
          //  this.columns = res.data.columns;
          //this.extra = res.data.extra;
          this.sysExtra = res.data.extra;
         
        } else
          swal("请求失败", res.message, "error");
      }
    )
  }
  //下拉刷新
  doInfinite():Promise<any>{
    //根据type加载不同的列表
    return new Promise((resolve) => {

    
    switch (this.type){
      case "noti":
      if(this.sysExtra.hasNextPage) { 
      var notiParam = {
        index:++this.sysExtra.index,
        size:10
      };
     
       this.httpService.request("api/sysMessage", notiParam, false).then(
         res => {
          resolve();
           if (res.code == 0) {
             var sysItems = res.data.data;
             for(var i = 0; i < sysItems.length;i++)
             this.sysItems.push(sysItems[i]);
             //  this.columns = res.data.columns;
             //this.extra = res.data.extra;
             this.sysExtra = res.data.extra;
           
           } else
             swal("请求失败", res.message, "error");
         }
       )
      }else{
        resolve();
      }



      break;
      case "send":
      if(this.sendExtra.hasNextPage) {
      var sendParam = {
    
        index:++this.sendExtra.index,
        size:10
      };      
     
      this.httpService.request("api/privateMessage/mysent", sendParam, false).then(
  
        res => {
        resolve();
          if (res.code == 0) {
  
            var sendItems = res.data.data;
  
  
            //     this.extra = res.data.extra;
            //循环遍历看是否已读
            for (var i = 0; i < sendItems.length; i++) {
  
              sendItems[i].iconName = "mail-open";
            this.sendItems.push(sendItems[i]);
            }
            this.sendExtra = res.data.extra;
          
          } else
            swal("请求失败", res.message, "error");
        }
      )
    
    }else{
      resolve();
    }













      break;
      case "receive":
      if(this.receiveExtra.hasNextPage){
      var receiveParam = {
        unreadonly: 0,
        index:++this.receiveExtra.index,
        size:10
      };

      this.httpService.request("api/privateMessage", receiveParam, false).then(
  
        res => {
       resolve();
          if (res.code == 0) {
          
            var receiveItems = res.data.data;
  
            //    this.extra = res.data.extra;
            //循环遍历看是否已读
            for (var i = 0; i < receiveItems.length; i++) {
              if (receiveItems[i].isReaded == 1)
              receiveItems[i].iconName = "mail-open";
              else
                receiveItems[i].iconName = "mail";
            this.receiveItems.push(receiveItems[i]);
              }
            this.receiveExtra = res.data.extra;
          
          } else
            swal("请求失败", res.message, "error");
        })










      }else{
        resolve();
      }
      break;
      default:
      resolve();
      break;
    }
  })
}
}