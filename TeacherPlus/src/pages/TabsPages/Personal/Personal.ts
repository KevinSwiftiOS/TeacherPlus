import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {StationLettersPage} from '../../PersonalPages/StationLetters/StationLetters'
import {SecuritySettingsPage} from '../../PersonalPages/SecuritySettingsPages/SecuritySettingsPages'
@Component({
  selector: 'page-contact',
  templateUrl: 'Personal.html'
})
export class PersonalPage {
  constructor(public navCtrl: NavController) {

  }
  //编辑基本资料
  editBasicInf() {
    alert("基本资料");
  }
  //安全设置
  securitySettings() {
    this.navCtrl.push(SecuritySettingsPage);
  }
  //退出登录
  exit() {

  }
  pushMyMessage() {
    this.navCtrl.push(StationLettersPage);
  }
}
