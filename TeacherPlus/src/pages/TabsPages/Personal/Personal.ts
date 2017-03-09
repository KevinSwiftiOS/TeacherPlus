import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {StationLettersPage} from '../../PersonalPages/StationLetters/StationLetters'
@Component({
  selector: 'page-contact',
  templateUrl: 'Personal.html'
})
export class PersonalPage {

  constructor(public navCtrl: NavController) {
  }
  pushMyMessage() {
    this.navCtrl.push(StationLettersPage);
  }
}
