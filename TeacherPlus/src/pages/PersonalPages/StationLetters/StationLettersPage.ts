/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {NotiPage} from '../NotiPage/NotiPage';
import {LettersPage} from "../LettersPage/LettersPage";
@Component({
  selector: 'page-statonLetters',
  templateUrl: 'StationLettersPage.html'
})
export class StationLettersPage {
  sel = "letters";
  tab1Root: any = LettersPage;
  tab2Root: any = NotiPage;
  constructor(public navCtrl: NavController) {
 
 }
 
}
