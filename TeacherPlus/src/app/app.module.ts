import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MyCoursePage } from '../pages/TabsPages/MyCourse/MyCourse';
import { InformationPage } from '../pages/TabsPages/Infor/Information';
import { PersonalPage } from '../pages/TabsPages/Personal/Personal';
import { TabsPage } from '../pages/TabsPages/tabs/tabs';
//个人中心模板
import {StationLettersPage} from '../pages/PersonalPages/StationLetters/StationLettersPage';
import {SecuritySettingsPage} from '../pages/PersonalPages/SecuritySettingsPage/SecuritySettingsPage';
import {BasicInfPage} from "../pages/PersonalPages/BasicInfPage/BasicInfPage";
//登录与重置密码模块
import {LoginPage} from "../pages/LoginAndResetPages/LoginPage/LoginPage";
//我的课程模块
import {StudyListPage} from "../pages/MyCourses/StudyListPage/StudyListPage";
import {ComprehensiveCoursePage} from "../pages/MyCourses/ComprehensiveCoursePage/ComprehensiveCoursePage";
//服务的注入
import {HttpService} from '../services/HttpService'
@NgModule({
  declarations: [
    MyApp,
   MyCoursePage,
    InformationPage,
    PersonalPage,
    TabsPage,
    //个人中心模块
    StationLettersPage,
    SecuritySettingsPage,
    BasicInfPage,
    //登录与重置密码模块
    LoginPage,
    //我的课程模块
    StudyListPage,
    ComprehensiveCoursePage,
  ],
  imports: [
     IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
      backButtonText: '返回'
    }, {}
  )],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MyCoursePage,
    InformationPage,
    PersonalPage,
    TabsPage,
    //个人中心模块
    StationLettersPage,
    SecuritySettingsPage,
    BasicInfPage,
    //登录与重置密码模块
    LoginPage,
    //我的课程模块
    StudyListPage,
    ComprehensiveCoursePage,
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},HttpService]
})
export class AppModule {}
