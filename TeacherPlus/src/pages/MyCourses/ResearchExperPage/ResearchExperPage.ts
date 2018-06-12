/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import { ExperDetailsPage } from "../ResearchExper/ExperDetailsPage/ExperDetailsPage";
import { WriteExpersPage } from "../ResearchExper/WriteExpersPage/WriteExpersPage";
import { HttpService } from "../../../services/Commons/HttpService";
import { ColumnEntity } from "../../../services/Tabs/Info/ColumnEntity";

import { ExtraEntity } from "../../../services/Tabs/Info/ExtraEntity";
declare var swal;
@Component({
  selector: 'page-ResearchExperPage',
  templateUrl: 'ResearchExperPage.html'
})
export class ResearchExperPage {
  static navCtrl;
  items = new Array();
  extra: ExtraEntity;
  columns: ColumnEntity[];
  isAndroid = false;
  constructor(public navCtrl: NavController, private httpService: HttpService,public platform:Platform) {
    if(!this.platform.is('ios')) 
      this.isAndroid = true;
  }
  //详细信息
  detail(item) {
    this.navCtrl.push(ExperDetailsPage, { item: item });
  }
  //删除研修心得
  remove(item, index) {
    if (item.isMine) {
      this.httpService.request("api/experiences/remove/" + item.id, {}, true).then(
        res => {
          if (res.code == 0) {
            swal("恭喜您", "删除成功", "success");
            this.items.splice(index, 1);
          }
          else
            swal("删除失败", res.message, "error");
        }
      )
    } else
      swal("提醒", "无法删除", "warning");
  }
  //写心得
  writeExpers() {
    this.navCtrl.push(WriteExpersPage);
  }
  //上拉刷新
  doRefresh(refresher) {
    this.httpService.request("api/experiences", { projectid: localStorage.getItem("projectid") }, false).then(
      res => {
        refresher.complete();
        if (res.code == 0) {

          this.items = res.data.data;
          this.extra = res.data.extra;
          this.columns = res.data.columns;
        } else
          swal("请求失败", res.message, "error");
      }
    )
  }
  ionViewWillEnter() {
    var param = {
      projectid: localStorage.getItem("projectid"),
      index:1,
      size:10
    };
    this.httpService.request("api/experiences",  param, true).then(
      res => {
        if (res.code == 0) {

          this.items = res.data.data;
          this.extra = res.data.extra;
       
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
      projectid: localStorage.getItem("projectid"),
      index:++this.extra.index,
      size:10
    };
    this.httpService.request("api/experiences",param, false).then(
      res => {
        scroll.complete();
        if (res.code == 0) {
          var resdata = res.data.data;
          for (var j = 0; j < resdata.length; j++)
            this.items.push(resdata[j]);
         
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
}

