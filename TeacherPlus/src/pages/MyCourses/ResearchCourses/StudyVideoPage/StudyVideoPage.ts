/**
 * Created by hcnucai on 2017/3/9. */
import { Component } from '@angular/core';

import { NavController, LoadingController, Platform, ViewController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { StudyVideoListPage } from "../StudyVideoListPage/StudyVideoListPage";
import { HttpService } from "../../../../services/Commons/HttpService";
import { VgAPI } from 'videogular2/core';
import { VgMedia } from 'videogular2/core';
import { StatusBar } from '@ionic-native/status-bar';
declare var swal;

@Component({
    selector: 'page-StudyVideoPage',
    templateUrl: 'StudyVideoPage.html',
    providers: [HttpService]
})
export class StudyVideoPage {

    public videoSrc: any;
    //整体的状态
    deItem;
    interval;
    api: VgAPI;
    media;
    cnt = 60;
    courseProgress: any = "";

    constructor(public viewController: ViewController,
        public plt: Platform,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public navParams: NavParams,
        private httpService: HttpService, public statusBar: StatusBar,public platform:Platform) {
            statusBar.backgroundColorByHexString("#000000");
        this.deItem = this.navParams.get("item");
        this.courseProgress = this.navParams.get("courseProgress");
        this.videoSrc = this.deItem.metadata.url;
        let textStatus = this.deItem.metadata.textStatus || "";
        //表示从来没有看过
        if (textStatus.length == 0) {
            for (var i = 0; i < this.deItem.metadata.duration; i++)
                textStatus += "0";
        } else if (textStatus.length < this.deItem.metadata.duration) {
            for (let i = 1; i <= (this.deItem.metadata.duration - textStatus.length); i++) {
                textStatus += "0";
            }
        } else if (textStatus.length > this.deItem.metadata.duration) {
            textStatus = textStatus.substring(0, this.deItem.metadata.duration - 1);
        }
        this.deItem.metadata.textStatus = textStatus;
    }
    //视频加载完毕
    onPlayerReady(api: VgAPI) {
        this.api = api;
        this.media = this.api.getDefaultMedia;
        if (this.deItem.isRequiredFinish
            && this.deItem.metadata.isTiming
            && !this.deItem.isFinish) {
            if (this.deItem.metadata.endPos > 0) {
                this.api.currentTime = this.deItem.metadata.endPos;
            }
            //var out = this;
            this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(() => {
                var pos = Math.round(this.api.currentTime);
                if (!isNaN(pos))
                    this.deItem.metadata.endPos = pos;

                //根据状态进行划分
                if (this.deItem.metadata.endPos > 0
                    && this.deItem.metadata.endPos < this.deItem.metadata.textStatus.length) {
                    var beforePosStr = this.deItem.metadata.textStatus.substr(0, this.deItem.metadata.endPos - 1);
                    var afterPosStr = this.deItem.metadata.textStatus.substr(this.deItem.metadata.endPos);
                    this.deItem.metadata.textStatus = beforePosStr + "1" + afterPosStr;
                }
            });
            this.api.getDefaultMedia().subscriptions.pause.subscribe(() => {
                if (this.interval != null) {
                    window.clearInterval(this.interval);
                    this.interval = null;
                }
            });
            this.api.getDefaultMedia().subscriptions.play.subscribe(() => {
                if (this.interval == null) {
                    var out = this;
                    this.interval = setInterval(function () {
                        out.signtime();
                    }, out.cnt * 1000);
                }
            });
            this.api.getDefaultMedia().subscriptions.ended.subscribe(() => {
                if (this.interval != null) {
                    window.clearInterval(this.interval);
                    this.interval = null;
                }
            });
        }
        this.api.play();
    }
    ionViewWillEnter() { }
    ionViewWillLeave() { }
    //拉动进度条的时候
    signtime(callback?: Function) {
        if (this.deItem.isRequiredFinish
            && this.deItem.metadata.isTiming
            && !this.deItem.isFinish) {
            var param = {
                resid: this.deItem.id,
                endpos: this.deItem.metadata.endPos,
                status: this.deItem.metadata.textStatus,
            };
            this.httpService.request("api/courses/signtime", param, false).then(res => {
                if (res.code == 0) {
                    this.deItem.isFinish = res.data.isFinish;
                    this.deItem.status = res.data.status;
                  
                    this.courseProgress = res.data.nCourseProgress;
                } else {

                }
                if (callback) {
                    callback.apply(this);
                }
            });
        } else {
            if (callback) {
                callback.apply(this);
            }
        }
    }

    cancel() {
        if (this.platform.is("ios")) {
            this.statusBar.overlaysWebView(false);
            this.statusBar.backgroundColorByHexString("#25A24D");
          }
        //this.signtime(() => {
            this.viewController.dismiss({ item: this.deItem, courseProgress: this.courseProgress });
        //});
    }
}