import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../../../services/Commons/HttpService";
declare var swal;
@Component({
  selector: 'page-StudyDownLoadPage',
  templateUrl: 'StudyDownLoadPage.html'
})
export class StudyDownLoadPage {
  item;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService) {
    this.item = this.navParams.get("item").metadata;

  }
  open() {

    this.httpService.openBrowser(this.item.url);
  }
}