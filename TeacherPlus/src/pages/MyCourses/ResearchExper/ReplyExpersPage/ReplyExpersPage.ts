/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController,ViewController} from 'ionic-angular';
import {HttpService} from "../../../../services/Commons/HttpService";
import { ActionSheetController } from 'ionic-angular'
import { LoadingController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';

declare var swal;
@Component({
  selector: 'page-ReplyExpersPage',
  templateUrl: 'ReplyExpersPage.html'
})
export class ReplyExpersPage {
  content;
  item;
  constructor(public viewCtrl:ViewController, public navParams:NavParams, public navCtrl: NavController,private httpService:HttpService,private loadingCtrl:LoadingController) {
    
     

}

//发送评论
send() {
  var param = {
   
    content:this.content
  };
  var out = this;
  this.httpService.request("api/experiences/" + this.navParams.get("id") + "/comment",param,true).then(
    res => {
        
        
               if(res.code == 0){
                swal({
                  title: "恭喜您",
                  text: "评论成功",
                  type: "success",
                  height: 10000,
                  width: 100,
              },
              function () {
                //重置密码
             
                 out.navCtrl.pop();
                  return true;
              });
            
               
              }else{
                swal("请求失败",res.message,"error");
              }
            })
}
//取消
cancel() {
  this.viewCtrl.dismiss();
}
}