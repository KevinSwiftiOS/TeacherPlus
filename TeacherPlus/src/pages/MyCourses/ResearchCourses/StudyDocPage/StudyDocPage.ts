import { Component } from '@angular/core';

import { NavController, NavParams} from 'ionic-angular';
declare var swal;
@Component({
  selector: 'page-StudyDocPage',
  templateUrl: 'StudyDocPage.html'
})
export class StudyDocPage {
  item;
  constructor(public navCtrl: NavController,public navParams:NavParams) {
      this.item = this.navParams.get("item").metadata;
}
}