/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController,NavParams} from 'ionic-angular';
import {HttpService} from "../../../../services/Commons/HttpService";
declare var swal;
@Component({
  selector: 'page-NotiDetailsPage',
  templateUrl: 'NotiDetailsPage.html'
})
export class NotiDetialsPage{
content:string;
title:string;
constructor(public navCtrl: NavController,private httpService:HttpService,private navParams:NavParams) {
 var item = this.navParams.get("item");
 this.title = item.subject;
 this.content = item.content;
 if(item.isReaded == false){
    this.httpService.request("api/sysMessage/signread/" + item.id,"",true).then(
        res => {
            if(res.code == 0){
                var sysNewCnt = parseInt(localStorage.getItem("sysNewCnt")) - 1;
               localStorage.setItem("messNewCnt",sysNewCnt.toString());
            }else
            swal("标记失败",res.message,"error");

        }
    )
 }
} 
}