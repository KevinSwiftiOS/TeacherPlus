/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ResearchExperPage } from '../ResearchExperPage/ResearchExperPage';
import {ResearchCoursePage} from '../ResearchCoursePage/ResearchCoursePage';
import {DiscussPage} from "../DiscussPage/DiscussPage";
import {ResearchPracticePage} from "../ResearchPracticePage/ResearchPracticePage";
import { HttpService } from '../../../services/Commons/HttpService';
declare var swal;
@Component({
  selector: 'page-OverViewPage',
  templateUrl: 'OverViewPage.html'
})
export class OverViewPage {
 //  static modules:any;
 loadProgress;
 desc;
 alertMessage;
   modules = new Array();
  constructor(public navCtrl: NavController,private httpService:HttpService) {
//       console.log(OverViewPage.modules);
// this.items = OverViewPage.modules;

 }

 ionViewWillEnter() {
  this.httpService.request("api/projects/overview/"  + localStorage.getItem("projectid"),"",true).then(
    res => {
         
    if(res.code == 0)
        {
        
   
        
     
        this.modules = res.data.modules;
        this.loadProgress =  (res.data.progress).substr(0,(res.data.progress.length - 1));
        this.alertMessage = res.data.alertMessage;
     
    
        
    }
      else
      swal("请求失败",res.message,"error");
    
    });
}

//点击进入其他模块
goToStudy(module){
  switch (module.id){
    case "vod":
      this.navCtrl.push(ResearchCoursePage);
    break;
    case "hmw":
    this.navCtrl.push(ResearchPracticePage);
  
    break;
    case "exp":
    this.navCtrl.push(ResearchExperPage);

    break;
    case "dis":
    this.navCtrl.push(DiscussPage);

    default:
    break;
  
}
}
}

