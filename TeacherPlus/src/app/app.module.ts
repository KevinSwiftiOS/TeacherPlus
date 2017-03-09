import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MyCoursePage } from '../pages/TabsPages/MyCourse/MyCourse';
import { InformationPage } from '../pages/TabsPages/Infor/Information';
import { PersonalPage } from '../pages/TabsPages/Personal/Personal';
import { TabsPage } from '../pages/TabsPages/tabs/tabs';
//个人中心模板
import {StationLettersPage} from '../pages/PersonalPages/StationLetters/StationLetters'
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
    StationLettersPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MyCoursePage,
    InformationPage,
    PersonalPage,
    TabsPage,
    //个人中心模块
    StationLettersPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},HttpService]
})
export class AppModule {}
