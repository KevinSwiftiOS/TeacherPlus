import { Component } from '@angular/core';
import { HttpService } from "../../../services/Commons/HttpService";
import { NavController, Platform, ActionSheetController } from 'ionic-angular';
import { ColumnEntity } from "../../../services/Tabs/Info/ColumnEntity";

import { ExtraEntity } from "../../../services/Tabs/Info/ExtraEntity";
import { InfoDetailsPage } from "../../../pages/Infos/InfoDetailsPage/InfoDetailsPage";
declare var videojs;
declare var swal;
@Component({
  selector: 'page-InfoTabPage',
  templateUrl: 'InfoTabPage.html',
  providers: [HttpService]
})
export class InfoTabPage {
  items = new Array();
  extra: ExtraEntity;
  loadingText: string;
  columns: ColumnEntity[];
  isAndroid = false;
  constructor(public ActionSheetCtrl:ActionSheetController, public platform:Platform, public navCtrl: NavController, private httpService: HttpService) {
    if(!this.platform.is('ios')) 
      this.isAndroid = true;
    this.loadingText = "正在加载中";
    var param = {
      index:1,
      size:10,
      keyword:""
    };
    this.httpService.request("api/infomation",param , true).then(
      res => {
        if (res.code == 0) {
          this.items = res.data.data;
          this.columns = res.data.columns;
          this.extra = res.data.extra;
          
        }
        else
          swal("请求失败", res.message, "error");
      }
    )
  }

  doRefresh(refresher) {

    //上拉刷新，全部重加载一遍
    this.items = [];
    var index = this.extra.index;
    for (var i = 1; i <= index; i++) {
      this.httpService.request("api/infomation", { index: i }, false).then(
        res => {
          if (res.code == 0) {
            var resdata = res.data.data;
            for (var j = 0; j < resdata.length; j++)
              this.items.push(resdata[j]);
            this.columns = res.data.columns;
            this.extra = res.data.extra;
          }
          else {
            swal("请求失败", res.message, "error");
            refresher.complete();
          }
        }
      )
      refresher.complete();
    }
  }
  doInfinite(scroll) {
 
    if (this.extra.hasNextPage) {
      //再次发起请求;
      this.httpService.request("api/infomation", { index: ++this.extra.index }, false).then(
        res => {
          scroll.complete();
          if (res.code == 0) {
            var resdata = res.data.data;
            for (var j = 0; j < resdata.length; j++)
              this.items.push(resdata[j]);
            this.columns = res.data.columns;
            this.extra = res.data.extra;
          }
          else
            swal("请求失败", res.message, "error");
        }
      )
    } else {
     
      scroll.complete();
    }

  }
  detail(event, data) {
    this.navCtrl.push(InfoDetailsPage, { item:data});
  }
 
}
