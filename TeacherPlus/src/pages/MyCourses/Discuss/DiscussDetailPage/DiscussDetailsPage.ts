/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { ReplyTopicPage } from "../ReplyTopicPage/ReplyTopicPage";
import { HttpService } from "../../../../services/Commons/HttpService";
import { ColumnEntity } from "../../../../services/Tabs/Info/ColumnEntity";
import {SlideImagesPage} from "../../../Commons/SlideImagesPage/SlideImagesPage";
import { ExtraEntity } from "../../../../services/Tabs/Info/ExtraEntity";
declare var swal;
@Component({
    selector: 'page-DiscussDetailsPage',
    templateUrl: 'DiscussDetailsPage.html',
    providers: [HttpService]
})
export class DiscussDetailsPage {
    images = [];
    defaultAvator: string = "assets/img/default-avatar.jpg";
    item: any;
    iconName;
    replies = new Array();
    extra: ExtraEntity;
    columns: ColumnEntity[];
    constructor(private modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService) {
        this.item = navParams.get("item");
        this.iconName = "ios-thumbs-up-outline";
       // var imgReg = /<img .*? + src=['"]([^<>]*?)['"];
     //  var b=/<img src=\"([^\"]*?)\">/gi 
       //var s=a.match(b) for(var i= 0;i<s.length;i++) { alert(s[i]); alert(RegExp.$1) }
       var patt = /<img[^>]+src =['"]([^'"]+)['"]+/g;
       var temp;

        while( (temp= patt.exec(this.item.content)) != null ) {
            this.images.push(temp[1]);
        }
      
        //帖子是我的这个有问题
    }
    //查看主题回复
    reply() {
        if (this.item.isForbiddenDiscuss)
            swal("提醒", "此帖禁止讨论", "warning");
        else {

            this.modal("");
        }
    }


    //点赞帖子
    voteup() {
        this.httpService.request("api/threads/voteup/" + this.item.id, "", true).then(
            res => {
                if (res.code == 0) {
                    swal("恭喜您", "点赞成功", "success");
                    this.iconName = "thumbs-up";
                } else
                    swal("删除失败", res.message, "error");
            }
        )
    }
    ionViewWillEnter() {
        var param = {
            index:1,
            size:10
        };
        this.httpService.request("api/threads/" + this.item.id, param, true).then(
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
    //回帖点赞
    voteupReplay(reply) {
        if (reply.isVoted) {
            this.httpService.request("api/threads/removeReplayVoteup/" + reply.id, "", true).then(
                res => {
                    if (res.code == 0) {
                        swal("恭喜您", "取消成功", "success");
                        reply.isVoted = false;
                        reply.iconName = "ios-thumbs-up-outline";
                        reply.voteupCount--;
                    }
                    else
                        swal("取消失败", res.message, "error");
                }
            )
        }
        else {
            this.httpService.request("api/threads/voteupReplay/" + reply.id, "", true).then(
                res => {
                    if (res.code == 0) {
                        swal("恭喜您", "点赞成功", "success");
                        reply.isVoted = true;
                        reply.iconName = "thumbs-up";
                        reply.voteupCount++;
                    }
                    else
                        swal("点赞失败", res.message, "error");
                }
            )
        }
    }
    //删除回帖
    removeReplay(reply, i) {
        var out = this;
        if (reply.isMine) {
            this.httpService.request("api/threads/removeReplay/" + reply.id, "", true).then(
                res => {
                    if (res.code == 0) {
                        swal("恭喜您", "删除成功", "success");
                        out.replies.splice(i, 1);
                    }
                    else
                        swal("取消失败", res.message, "error");
                }
            )
        } else {
            swal("提醒", "无法进行删除", "warning");
        }
    }
    //回复某个帖子
    replyQuoteid(reply) {
        if (this.item.isForbiddenDiscuss)
            swal("提醒", "此帖禁止讨论", "warning");
        else {

            this.modal(reply);
        }
    }
    modal(reply) {
        let profileModal = this.modalCtrl.create(ReplyTopicPage, { topicItem: this.item, item: reply });




        profileModal.onDidDismiss(data => {
            //这里写相关操作
            this.httpService.request("api/threads/" + this.item.id, "", true).then(
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


                    } else
                        swal("请求失败", res.message, "error");
                }
            )
        });
        profileModal.present();

    }
    //下拉刷新
doInfinite(scroll) {

    if (this.extra.hasNextPage) {
      //再次发起请求;
      var param = {
        index:++this.extra.index,
        size:10
    };
    this.httpService.request("api/threads/" + this.item.id, param, false).then(
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
  //获取当前元素
  imgModal(event) {
    // var obj = event.srcElement;
  var index = 0;
  
     var indexImg = (event.srcElement.src);
  
     for(;index < this.images.length;index++)
     if(indexImg == this.images[index])
     break;
    if(index < this.images.length) {
     let profileModal = this.modalCtrl.create(SlideImagesPage, { imgs: this.images, index: index });
 
 
 
 
     profileModal.onDidDismiss(data => {
       //这里写相关操作
 
     });
     profileModal.present();
     }
 }
}
