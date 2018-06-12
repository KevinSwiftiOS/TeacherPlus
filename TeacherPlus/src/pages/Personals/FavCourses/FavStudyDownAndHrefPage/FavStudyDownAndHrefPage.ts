import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../../../services/Commons/HttpService";
declare var swal;
@Component({
  selector: 'page-FavStudyDownAndHrefPage',
  templateUrl: 'FavStudyDownAndHrefPage.html'
})
export class FavStudyDownAndHrefPage {
  item;
  type; //1表示下载资源 2表示超链接
  title;
  content;
 
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService) {

    this.item = this.navParams.get("item").metadata;

 
     this.type = this.navParams.get("item").type;

     if(this.type == "下载资源"){
       this.title = "下载资源";
       this.content = this.item.fileName;
     }else{
       this.title = "超链接";
       this.content = this.item.text;
     }
  }
  open() {

    this.httpService.openBrowser(this.item.url);
  }
}