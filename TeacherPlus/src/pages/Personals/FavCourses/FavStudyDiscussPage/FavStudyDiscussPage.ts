import { Component } from '@angular/core';
import { HttpService } from "../../../../services/Commons/HttpService";
import { NavController, NavParams } from 'ionic-angular';
import {ExtraEntity} from "../../../../services/Tabs/Info/ExtraEntity";
declare var swal;
@Component({
  selector: 'page-FavStudyDiscussPage',
  templateUrl: 'FavStudyDiscussPage.html'
})
export class FavStudyDiscussPage {
  item;
  content;
  replies = new Array();
  extra: ExtraEntity;
  defaultAvator: string = "assets/img/default-avatar.jpg";
  constructor(public httpService: HttpService, public navCtrl: NavController, public navParams: NavParams) {
    this.item = this.navParams.get("item").metadata;
   
  }
  //发送
  ionViewWillEnter() {
    var param = {
        index:1,
        size:10
    };
    this.httpService.request("api/threads/" + this.item.threadid, param, true).then(
        res => {
            if (res.code == 0) {
              
                this.replies = res.data.replies.data;

                //进行遍历
                for (var i = 0; i < this.replies.length; i++) {
                    if (this.replies[i].isVoted)
                        this.replies[i].iconName = "thumbs-up";
                    else
                        this.replies[i].iconName = "ios-thumbs-up-outline";
                       
                      }
                 
                this.extra = res.data.replies.extra;
                
            } else
                swal("请求失败", res.message, "error");
        }
    )
}
    //下拉刷新
    doInfinite(scroll) {

      if (this.extra.hasNextPage) {
        //再次发起请求;
        var param = {
          index:++this.extra.index,
          size:10
      };
      this.httpService.request("api/threads/" + this.item.threadid, param, false).then(
          res => {
              scroll.complete();
              if (res.code == 0) {
  
                  var replies = res.data.replies.data;
            
                  //进行遍历
                  for (var i = 0; i < replies.length; i++) {
                      if (replies[i].isVoted)
                          replies[i].iconName = "thumbs-up";
                      else
                          replies[i].iconName = "ios-thumbs-up-outline";
                       
                          this.replies.push(replies[i]);
      
                      }
                      this.extra = res.data.replies.extra;
              } else
                  swal("请求失败", res.message, "error");
          }
      )   
      }else{
          scroll.complete();
      }
  }
}