/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { TabsPage } from "../../Tabs/TabsPage/TabsPage";
import { HttpService } from "../../../services/Commons/HttpService";
import { Device } from '@ionic-native/device';
declare var swal;
@Component({
    selector: 'page-LoginPage',
    templateUrl: 'LoginPage.html',
    providers: [HttpService],
})

export class LoginPage {
    user = {
        "username": "",
        "password": "",
    };
    constructor(public platform: Platform, public navCtrl: NavController, private service: HttpService, private device: Device) {
        
    }

    //登录
    login() {

        var deviceInfo = {

            platform: this.device.platform,
            uuid: this.device.uuid,
            manufacturer: this.device.manufacturer,
            appversion: this.device.version,
        };
        //制定参数
        var param = {
            "username": this.user.username,
            "password": this.user.password,
            "deviceInfo": deviceInfo
        };


        this.service.request("api/account/login", param, true).then(
            res => {
                if (res.code == 0) {
                    //设置参数
                    var data = res.data;
                    var ls = localStorage;
                    ls.setItem("username", this.user.username);
                    ls.setItem("password", this.user.password);
                    ls.setItem("authtoken", data.authtoken);
                    ls.setItem("name", data.name);
                    ls.setItem("isDemo",data.isDemo);
                
                    if (data.avator == null)
                        ls.setItem("avator", './img/head.png');
                    else
                        ls.setItem("avator", data.avator);
                    this.navCtrl.push(TabsPage);

                }
                else
                    swal("请求失败", res.message, "error");
            });
    }
};
