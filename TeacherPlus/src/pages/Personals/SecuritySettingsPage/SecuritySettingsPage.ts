/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';
import {HttpService} from "../../../services/Commons/HttpService";
import { NavController } from 'ionic-angular';
declare var swal;
@Component({
  selector: 'page-SecuritySettingsPage',
  templateUrl: 'SecuritySettingsPage.html',
  providers:[HttpService],
})
export class SecuritySettingsPage {
  pw = {
    oldPw:"",
    repNewPw:"",
    newPw:""
  }
  constructor(public navCtrl: NavController,private httpService:HttpService) {
 
 }
 save() {
  var PW = this.pw;
     if(this.pw.newPw != this.pw.repNewPw) 
     swal("提醒","新密码填写不相同","warning");
     else{
       var param = {
        oldPassword:this.pw.oldPw,
        newPassword:this.pw.newPw
       };
       this.httpService.request("api/account/changepassword",param,true).then(
         res => {
           var nav = this.navCtrl;
           if(res.code == 0) {
            swal({
              title: "恭喜您",
              text: "修改成功",
              type: "success",
              height: 10000,
              width: 100,
          },
          function () {
            //重置密码
             localStorage.setItem("password",PW.newPw);
             nav.pop();
              return true;
          });
           }else
            swal("修改失败",res.message,"error");
         }
       )
     }
 }
}
