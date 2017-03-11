/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController,ActionSheetController } from 'ionic-angular';

@Component({
  selector: 'page-BasicInfPage',
  templateUrl: 'BasicInfPage.html'
})
export class BasicInfPage {

  constructor(public navCtrl: NavController,public ActionSheetCtrl:ActionSheetController) {
 
 }
 //选择性别
 selectSex() {
     let actionSheet = this.ActionSheetCtrl.create({
          title: '请选择性别',
          buttons:[
              {
                  text:"男",
                  role: 'destructive',
           handler: () => {
           console.log('选择了男');
                }
              },
                  {
                  text:"女",
                  role: 'destructive',
           handler: () => {
           console.log('选择了女');
                }
              },
                  {
                  text:"取消",
                  role: 'cancel',
           handler: () => {
           console.log('取消');
                }
              },
          ]
     });
actionSheet.present(); 
}
 
}
