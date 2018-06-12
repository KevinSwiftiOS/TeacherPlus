import { Component } from '@angular/core';

import { NavController,PopoverController, NavParams} from 'ionic-angular';
declare var swal;
@Component({
  selector: 'page-FavStudyWorkPage',
  templateUrl: 'FavStudyWorkPage.html'
})
export class FavStudyWorkPage {
  item;
  constructor(public navCtrl: NavController,private navParams:NavParams) {
    this.item = this.navParams.get("item").metadata;
}
}