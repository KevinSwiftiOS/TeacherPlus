import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { ZoomAreaModule } from 'ionic2-zoom-area';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JPush } from '@jiguang-ionic/jpush';
import { MyApp } from './app.component';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
import { IonicImageViewerModule } from 'ionic-img-viewer';
//import { MediaCapture } from '@ionic-native/media-capture';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { Device } from '@ionic-native/device';
import { ImagePicker } from 'ionic-native';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';



import { MyCourseTabPage } from '../pages/Tabs/MyCourseTabPage/MyCourseTabPage';
import { InfoTabPage } from '../pages/Tabs/InfoTabPage/InfoTabPage';
import { PersonalTabPage } from '../pages/Tabs/PersonalTabPage/PersonalTabPage';
import { PaymentTabPage } from '../pages/Tabs/PaymentTabPage/PaymentTabPage';
import { TabsPage } from '../pages/Tabs/TabsPage/TabsPage';
//个人中心模板
//站内信模块
import { LettersNotisPage } from "../pages/Personals/LettersNotisPage/LettersNotisPage";


import { LetterDetailsPage } from "../pages/Personals/StationLetters/LetterDetailsPage/LetterDetailsPage";
import { WriteLettersPage } from "../pages/Personals/StationLetters/WriteLettersPage/WriteLettersPage";
import { ContactPersonPage } from "../pages/Personals/StationLetters/ContactPersonPage/ContactPersonPage";
//个人中心模块中的基本信息和安全设置模块
import { SecuritySettingsPage } from "../pages/Personals/SecuritySettingsPage/SecuritySettingsPage";
import { BasicInfPage } from "../pages/Personals/BasicInfPage/BasicInfPage";
//个人中心模块中的通知模块
import { NotiDetialsPage } from "../pages/Personals/Notis/NotiDetailsPage/NotiDetailsPage";
//个人中心模块中的收藏课程模块
import {FavCoursesPage} from "../pages/Personals/FavCoursesPage/FavCoursesPage";
import {FavStudyDiscussPage} from "../pages/Personals/FavCourses/FavStudyDiscussPage/FavStudyDiscussPage";
import {FavStudyDocPage} from "../pages/Personals/FavCourses/FavStudyDocPage/FavStudyDocPage";
import {FavStudyDownAndHrefPage} from "../pages/Personals/FavCourses/FavStudyDownAndHrefPage/FavStudyDownAndHrefPage";
import {FavStudyListPage} from "../pages/Personals/FavCourses/FavStudyListPage/FavStudyListPage";
import {FavStudyVideoPage} from "../pages/Personals/FavCourses/FavStudyVideoPage/FavStudyVideoPage";
import {FavStudyWorkPage} from "../pages/Personals/FavCourses/FavStudyWorkPage/FavStudyWorkPage";
//登录模块
import { LoginPage } from "../pages/LoginAndReset/LoginPage/LoginPage";
//我的课程模块
import { DiscussPage } from "../pages/MyCourses/DiscussPage/DiscussPage";
import { OverViewPage } from '../pages/MyCourses/OverViewPage/OverViewPage';
import { ResearchCoursePage } from '../pages/MyCourses/ResearchCoursePage/ResearchCoursePage';
import { ResearchExperPage } from "../pages/MyCourses/ResearchExperPage/ResearchExperPage";
import { ResearchPracticePage } from "../pages/MyCourses/ResearchPracticePage/ResearchPracticePage";
//课程模块中的研修课程模块
import { StudyVideoPage } from "../pages/MyCourses/ResearchCourses/StudyVideoPage/StudyVideoPage";
import { StudyDocPage } from "../pages/MyCourses/ResearchCourses/StudyDocPage/StudyDocPage";

import { StudyDownLoadPage } from "../pages/MyCourses/ResearchCourses/StudyDownLoadPage/StudyDownLoadPage";
import { StudyDiscussPage } from "../pages/MyCourses/ResearchCourses/StudyDiscussPage/StudyDiscussPage";
import { StudyHrefPage } from "../pages/MyCourses/ResearchCourses/StudyHrefPage/StudyHrefPage";
import { StudyDiscussReplyPage } from '../pages/MyCourses/ResearchCourses/StudyDiscussReplyPage/StudyDiscussReplyPage';
//课程模块中的讨论区模块

import { DiscussDetailsPage } from "../pages/MyCourses/Discuss/DiscussDetailPage/DiscussDetailsPage";

import { WriteDiscussPage } from "../pages/MyCourses/Discuss/WriteDiscussPage/WriteDiscussPage";
import { ReplyTopicPage } from "../pages/MyCourses/Discuss/ReplyTopicPage/ReplyTopicPage";
//课程模块中的研修心得模块
import { WriteExpersPage } from "../pages/MyCourses/ResearchExper/WriteExpersPage/WriteExpersPage";
import { ExperDetailsPage } from "../pages/MyCourses/ResearchExper/ExperDetailsPage/ExperDetailsPage";
import { ReplyExpersPage } from "../pages/MyCourses/ResearchExper/ReplyExpersPage/ReplyExpersPage";

import { StudyVideoListPage } from "../pages/MyCourses/ResearchCourses/StudyVideoListPage/StudyVideoListPage";
//课程模块中的作业实践模块
import { HomeWorkDetailPage } from "../pages/MyCourses/ResearchPractice/HomeWorkDetailPage";

//公告模块
import { InfoDetailsPage } from "../pages/Infos/InfoDetailsPage/InfoDetailsPage";
//缴费模块
import { PaymentDetailPage } from "../pages/Payments/PaymentDetailPage/PaymentDetailPage";
import { InvoiceApplyPage } from "../pages/Payments/InvoiceApplyPage/InvoiceApplyPage";


//服务的注入
import { HttpService } from '../services/Commons/HttpService';
//公共的页面
import { EmptyListPage } from "../pages/Commons/EmptyListPage/EmptyListPage";
import { SlideImagesPage } from "../pages/Commons/SlideImagesPage/SlideImagesPage";

@NgModule({
  declarations: [
    MyApp,
    ProgressBarComponent,
    PersonalTabPage,
    InfoTabPage,
    MyCourseTabPage,
    PaymentTabPage,
    TabsPage,
    //个人中心模块
    //站内信模块
    LettersNotisPage,
    LetterDetailsPage,
  
    WriteLettersPage,
    ContactPersonPage,
   //安全设置和个人基本信息
    SecuritySettingsPage,
    BasicInfPage,

    //个人中心模块
    //通知模块

    NotiDetialsPage,
  //个人中心模块 收藏课程模块
  FavCoursesPage,
  FavStudyDiscussPage,
FavStudyDocPage,
FavStudyDownAndHrefPage,
FavStudyListPage,
FavStudyVideoPage,
FavStudyWorkPage,
    //登录模块
    LoginPage,
    //我的课程模块

    ResearchCoursePage,
    OverViewPage,
    ResearchExperPage,
    ResearchPracticePage,
    DiscussPage,
    StudyVideoPage,
    StudyDocPage,

    StudyDiscussPage,
    StudyDiscussReplyPage,
    StudyDownLoadPage,
    StudyHrefPage,

    StudyVideoListPage,
    //我的课程模块中的讨论区模块

    DiscussDetailsPage,
    WriteDiscussPage,
    ReplyTopicPage,
    //我的课程模块中的研修心得模块
    WriteExpersPage,
    ReplyExpersPage,
    ExperDetailsPage,

    //我的课程模块中的研修实践模块
    HomeWorkDetailPage,
    //公告模块
    InfoDetailsPage,
    //缴费模块
    PaymentDetailPage,
    InvoiceApplyPage,
    //空白列表页面
    EmptyListPage,
    SlideImagesPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicImageViewerModule,
    BrowserAnimationsModule,
    ZoomAreaModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
      backButtonText: '返回'
    },
      
    ),

    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PersonalTabPage,
    InfoTabPage,
    MyCourseTabPage,
    PaymentTabPage,
    TabsPage,
    //个人中心模块
    LettersNotisPage,
    //站内信模块
    LetterDetailsPage,

    WriteLettersPage,
    ContactPersonPage,
  //安全设置和个人主页模块
    SecuritySettingsPage,
    BasicInfPage,

    //个人中心模块
    //通知模块
    NotiDetialsPage,
  //个人中心模块 收藏课程模块
  FavCoursesPage,
FavStudyDiscussPage,
FavStudyDocPage,
FavStudyDownAndHrefPage,
FavStudyListPage,
FavStudyVideoPage,
FavStudyWorkPage,


    //登录与重置密码模块
    LoginPage,
    //我的课程模块
    ResearchCoursePage,
    OverViewPage,
    ResearchExperPage,
    ResearchPracticePage,
    DiscussPage,
    StudyVideoPage,
    StudyDocPage,

    StudyDiscussPage,
    StudyDiscussReplyPage,
    StudyDownLoadPage,
    StudyHrefPage,
    StudyVideoListPage,

    //我的课程模块中的讨论区模块

    DiscussDetailsPage,
    WriteDiscussPage,
    ReplyTopicPage,
    //我的课程模块中的研修心得模块
    WriteExpersPage,
    ReplyExpersPage,
    ExperDetailsPage,

    //我的课程模块中的研修实践模块
    HomeWorkDetailPage,
    //公告模块,
    InfoDetailsPage,
    //缴费模块
    PaymentDetailPage,
    InvoiceApplyPage,
    //空白列表页面
    EmptyListPage,
    SlideImagesPage,

  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, HttpService,
    File,
    FileTransfer,
    Camera,
    FilePath,
    ThemeableBrowser,
    ImagePicker,
    //MediaCapture, 
    Device,
    StatusBar,
    Keyboard,
    JPush,
  ]
})
export class AppModule { }