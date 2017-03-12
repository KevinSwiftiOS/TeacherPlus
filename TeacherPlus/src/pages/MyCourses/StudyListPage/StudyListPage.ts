/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController, MenuController } from 'ionic-angular';
import { ComprehensiveCoursePage } from '../ComprehensiveCoursePage/ComprehensiveCoursePage';
import {BeforeTestPage} from '../BeforeTestPage/BeforeTestPage';
import {SemiarCoursePage} from '../SemiarCoursePage/SemiarCoursePage';
import {SupportCoursePage} from "../SupportCoursePage/SupportCoursePage";
import {LearningSitutationPage} from "../LearningSitutationPage/LearningSitutationPage";
@Component({
  selector: 'page-StudyListPage',
  templateUrl: 'StudyListPage.html'
})
export class StudyListPage {
  divHtml = "<page-ComprehensiveCoursePage></page-ComprehensiveCoursePage>";
  pages: Array<{ title: string, isShow: boolean }>;
  constructor(public navCtrl: NavController, public menu: MenuController) {
    this.pages = [
      { title: "综合课程", isShow: true },
      { title: "前测", isShow: false },
      { title: "专题课程", isShow: false },
      { title: "支持性课程", isShow: false },
      { title: "学情", isShow: false },
    ];

  }
  ionViewDidEnter() {


  }
  ionViewWillLeave() {

  }
  pageSelected(index) {
    //建立一个循环
    for(var i = 0; i < 5;i++) {
             if(i == index)
             this.pages[index].isShow = true;
             else
             this.pages[i].isShow = false;
    };
  }
}
