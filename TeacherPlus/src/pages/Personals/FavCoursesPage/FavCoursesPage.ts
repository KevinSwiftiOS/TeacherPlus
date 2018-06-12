/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { HttpService } from '../../../services/Commons/HttpService';
import {FavStudyListPage} from "../FavCourses/FavStudyListPage/FavStudyListPage";
declare var swal;
@Component({
  selector: 'page-FavCoursesPage',
  templateUrl: 'FavCoursesPage.html'
})
export class FavCoursesPage {
 //  static modules:any;
 items = [];
  constructor(public navCtrl: NavController,private httpService:HttpService) {
this.httpService.request("api/favorites",{},true).then(
    res => {
        if(res.code == 0)  {
        this.items = res.data;
      
        }
    else{
        swal("请求失败",res.message,"error");
    }
    }
)

 }

//去学习
goToStudy(item){
 this.navCtrl.push(FavStudyListPage,{isFav:true,item:item});
}
remove(item,index){
    //删除收藏课程
    this.httpService.request("api/favorites/remove/" + item.id,{},true).then(
        res => {
            if(res.code == 0)
            this.items.splice(index,1);
            else
            swal("删除失败",res.message,"error");
        }
    )
}
//刷新课程
refresh(refresher) {

    this.httpService.request("api/favorites",{},false).then(
        res => {
            refresher.complete();
            if(res.code == 0)  {
            this.items = res.data;
        
            }
        else{
            swal("请求失败",res.message,"error");
        }
        }
    )
  }
}

