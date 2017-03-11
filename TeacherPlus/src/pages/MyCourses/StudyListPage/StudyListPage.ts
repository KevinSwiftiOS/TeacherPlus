/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController,MenuController} from 'ionic-angular';
import {ComprehensiveCoursePage} from '../ComprehensiveCoursePage/ComprehensiveCoursePage'
@Component({
  selector: 'page-StudyListPage',
  templateUrl: 'StudyListPage.html'
})
export class StudyListPage {
  rootPages:any = ComprehensiveCoursePage;
  pages:Array<{title:string,component:any}>;
  constructor(public navCtrl: NavController,  public menu: MenuController) {
  this.pages = [
    {title:"综合课程",component:ComprehensiveCoursePage}
  ];
  
 }
 ionViewDidEnter() {
  
   
 }
  ionViewWillLeave() {
   
 }
 openPage(p) {

 }
}
