/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { TabsPage } from "../../TabsPages/tabs/tabs"
@Component({
  selector: 'page-LoginPage',
  templateUrl: 'LoginPage.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController) {
 
 }
 //登录
 login() {
  this.navCtrl.push(TabsPage);
  localStorage.setItem("authtoken","123");
 }
}
