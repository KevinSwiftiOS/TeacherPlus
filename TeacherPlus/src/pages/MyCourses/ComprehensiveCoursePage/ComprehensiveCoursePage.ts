/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {StudyVedioPage} from "../StudyVedioPage/StudyVedioPage";
@Component({
  selector: 'page-ComprehensiveCoursePage',
  templateUrl: 'ComprehensiveCoursePage.html'
})
export class ComprehensiveCoursePage {

  constructor(public navCtrl: NavController) {
 
 }
 //推入视频
 studyVedio() {
   this.navCtrl.push(StudyVedioPage);
 }
}
