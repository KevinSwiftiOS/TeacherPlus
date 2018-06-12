import { Component, NgZone } from '@angular/core';
import { InfoTabPage } from "../InfoTabPage/InfoTabPage";
import { PaymentTabPage } from '../PaymentTabPage/PaymentTabPage';
import { PersonalTabPage } from '../PersonalTabPage/PersonalTabPage';

import { MyCourseTabPage } from '../MyCourseTabPage/MyCourseTabPage';
import { HttpService } from "../../../services/Commons/HttpService";
import { NavController } from 'ionic-angular/navigation/nav-controller';







@Component({
  templateUrl: 'TabsPage.html'
})
export class TabsPage {
  //全部未读的个数
  totalNewCnt;
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = MyCourseTabPage;
  tab2Root: any = InfoTabPage;
  tab3Root: any = PaymentTabPage;
  tab4Root: any = PersonalTabPage;
  tabBarElement: any;
  //是否是测试账号 将缴费模块拿掉
  isDemo = false;

static nav;
  constructor(private zone: NgZone, private httpService: HttpService, public navCtrl: NavController) {
    TabsPage.nav = this.navCtrl;

    if(localStorage.getItem("isDemo") == "true")
    this.isDemo = true;
    else
    this.isDemo = false;
    // this.zone = new NgZone({ enableLongStackTrace: false });
    // if(this.tab1BadgeCount == 0)
    // this.hasCnt = fal
    //发送请求 查看唯独的站内信和通知个数
    this.httpService.request("api/privateMessage/newCount", "", false).then(
      res => {
        if (res.code == 0) {
          localStorage.setItem("messNewCnt", res.data);
        }
      }
    );
    this.httpService.request("api/sysMessage/newCount", "", false).then(
      res => {
        if (res.code == 0) {
          localStorage.setItem("sysNewCnt", res.data);
        }
      }
    )




  }
  ngDoCheck() {
    this.totalNewCnt = parseInt(localStorage.getItem("sysNewCnt")) + parseInt(localStorage.getItem("messNewCnt"));
    if (this.totalNewCnt <= 0)
      this.totalNewCnt = "";
  }


}