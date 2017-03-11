import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {StudyListPage } from "../../MyCourses/StudyListPage/StudyListPage";
@Component({
  selector: 'page-home',
  templateUrl: 'MyCourse.html'
})
export class MyCoursePage {

  constructor(public navCtrl: NavController) {

  }
  //进入立即学习界面
  goToStudy() {
   this.navCtrl.push(StudyListPage);
  }
}
