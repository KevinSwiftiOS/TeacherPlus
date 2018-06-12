import { Component } from '@angular/core';

import { NavController, NavParams,ViewController} from 'ionic-angular';
import {HttpService} from "../../../../services/Commons/HttpService";

declare var swal;
@Component({
  selector: 'page-ReplyTopicPage',
  templateUrl: 'ReplyTopicPage.html'
})
export class ReplyTopicPage {
    content;
    topicItem;
    item;
    replyName;
  constructor(public viewCtrl:ViewController, public navCtrl: NavController,public navParams:NavParams, private httpService:HttpService) {
    this.topicItem = this.navParams.get("topicItem");
    this.item = this.navParams.get("item");
    if(this.item != null && this.item != "")
    this.replyName = "回复" + this.item.author + "：";
    else
    this.replyName = "";
}
send() {
    var quiteid = "";
    if(this.item != null && this.item != "")
    quiteid = this.item.id;
    var param = {
        projectid:localStorage.getItem("projectid"),
        postype:2,
        data:{
            subject:"",
            cateid:"",
            parentid:this.topicItem.id,
            content:this.content,
            quoteid:quiteid,
        }
    };
 
    var out = this;
    this.httpService.request("api/threads/create",param,true).then(
        res => {
            if(res.code == 0){
                swal({
                    title: "恭喜您",
                    text: "回帖成功",
                    type: "success",
                    height: 10000,
                    width: 100,
                },
                function () {
                  //重置密码
              
                   out.viewCtrl.dismiss();
                    return true;
                });
            }else
            swal("回帖失败",res.message,"error");
    })
}
//页面消失
cancel() {
    this.viewCtrl.dismiss();
}
}