import { Component } from '@angular/core';

import { NavController,PopoverController, NavParams, ViewController} from 'ionic-angular';
import { HttpService } from '../../../../services/Commons/HttpService';
declare var swal;
@Component({
  selector: 'page-StudyDiscussReplyPage',
  templateUrl: 'StudyDiscussReplyPage.html'
})

export class StudyDiscussReplyPage {
    content; 
    threadid;
  constructor(public navCtrl: NavController,public httpService:HttpService,public navParams:NavParams,public viewCtrl:ViewController) {
this.threadid = this.navParams.get("parentid");
}
  //发送
  send() {
    if (this.content == "") {
      swal("提醒", "内容未填写", "warning");
    } else {

      //联系人用字符串进行组装

      //进行传送
      var data = {
        subject: "",
        cateid: "",
        parentid: this.threadid,
        content: this.content,
        quoteid: "",
      };

      var params = {
        projectid: localStorage.getItem("projectid"),
        postype: 2,
        data: data,
      };
      // 外部的提醒框
      var out = this;

      this.httpService.request("api/threads/create", params, true).then(
        res => {
          if (res.code == 0) {
            swal("恭喜您", "回帖成功", "success");

            this.httpService.request("api/threads/" + this.threadid, "", true).then(
              res => {
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
          
              }
            )
          }
          else {
            swal("回帖失败", res.message, "error");

          }
        }

      )
    }
  }
  //页面消失
cancel() {
    this.viewCtrl.dismiss();
}
}