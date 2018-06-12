/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController, ViewController } from 'ionic-angular';
import { HttpService } from "../../../../services/Commons/HttpService";
import { ActionSheetController } from 'ionic-angular'
import { LoadingController } from 'ionic-angular';
import { GroupEntity } from "../../../../services/Personals/StationLetters/ContactPersonService/GroupEntity";
import { PersonEntity } from "../../../../services/Personals/StationLetters/ContactPersonService/PersonEntity";
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { WriteLettersPage } from "../WriteLettersPage/WriteLettersPage";
import { ViewContainer } from '@angular/compiler/src/private_import_core';
declare var swal;
@Component({
    selector: 'page-ContactPersonPage',
    templateUrl: 'ContactPersonPage.html'
})
export class ContactPersonPage {
    loader;
    items = new Array();


    //联系人
    contactPers = new Array();
    constructor(public viewCtrl:ViewController, public navCtrl: NavController, public navParams: NavParams, public loadCtrl: LoadingController, public httpService: HttpService) {
        this.loader = this.loadCtrl.create({
            content: "请稍等"
        });
        //回复某人会有senderId 传进来
        var senderId = this.navParams.get("receives");
        this.loader.present();
        this.httpService.request("api/privateMessage/contact", "", true).then(
            res => {
                this.loader.dismiss();
                if (res.code == 0) {
                    //遍历icon

                    var data = new Array();
                    data = res.data;
                    for (var i = 0; i < data.length; i++) {
                        var group = new GroupEntity();
                        group.items = new Array();
                        for (var j = 0; j < data[i].items.length; j++) {
                            var person = new PersonEntity();
                            person.avator = data[i].items[j].avator;
                            if (person.avator == null)
                                person.avator =  "assets/img/default-avatar.jpg";

                            person.id = data[i].items[j].id;
                            person.comp = data[i].items[j].comp;
                            person.name = data[i].items[j].name;
                            person.icon = "radio-button-off";

                            if (person.id == senderId) {
                                person.icon = "checkmark-circle";
                                this.contactPers.push(person);
                            }

                            group.items.push(person);
                        }
                        group.arrawIcon = "arrow-forward";
                        group.isShow = false;
                        group.icon = "radio-button-off";
                        group.name = data[i].name;
                        this.items.push(group);

                    }

                } else
                    swal("请求失败", res.message, "error");
            }

        )
    }
    //添加联系人
    addPerson(deItem, i, j) {
        if (deItem.icon == "radio-button-off") {
            this.items[i].items[j].icon = "checkmark-circle";
            this.contactPers.push(deItem);
            //遍历该组 看是否全部选上 若是全部选上的话 则item上变成勾
            for (var k = 0; k < this.items[i].items.length; k++) {
                if (this.items[i].items[k].icon != "checkmark-circle")
                    break;
            }
            if (k == this.items[i].items.length)
                this.items[i].icon = "checkmark-circle";
        }
        else {
            this.items[i].items[j].icon = "radio-button-off";
            //遍历删除
            for (var k = 0; k < this.contactPers.length; k++) {
                if (this.contactPers[k].id == deItem.id)
                    this.contactPers.splice(k, 1);
            }
            var k = 0;
            for ( k = 0; k < this.items[i].items.length; k++) {
                if (this.items[i].items[k].icon != "radio-button-off")
                    break;
            }
            if(k == this.items[i].items.length){
                this.items[i].icon = "radio-button-off";
            }
        }

    }
    //打开或关闭该组
    openGroup(i) {
        this.items[i].isShow = !this.items[i].isShow;
        if(this.items[i].isShow)
        this.items[i].arrawIcon = "arrow-down";
        else
        this.items[i].arrawIcon = "arrow-forward";
    }
    //添加整个组
    addGroup(i) {
        if (this.items[i].icon == "radio-button-off") {
            this.items[i].icon = "checkmark-circle";
            for (var j = 0; j < this.items[i].items.length; j++) {
                this.items[i].items[j].icon = "checkmark-circle";
                var k = 0;
                for (k = 0; k < this.contactPers.length; k++) {
                    if (this.contactPers[k].id == this.items[i].items[j].id)
                        break;
                }
                if (k == this.contactPers.length)
                    this.contactPers.push(this.items[i].items[j]);
                this.items[i].isShow = false;
             
            }
        } else {
            //整组进行删除
            this.items[i].icon = "radio-button-off";
            for (var j = 0; j < this.items[i].items.length; j++) {
                this.items[i].items[j].icon = "radio-button-off";
                var k = 0;
                for (k = 0; k < this.contactPers.length; k++) {
                    if (this.contactPers[k].id == this.items[i].items[j].id)
                        this.contactPers.splice(k, 1);
                }
            }
        }
        if(this.items[i].isShow)
        this.items[i].arrawIcon = "arrow-down";
        else
        this.items[i].arrawIcon = "arrow-forward";
    }
    //保存联系人
    saveContacts() {
        WriteLettersPage.receives = this.contactPers;
        this.viewCtrl.dismiss();
    }
    //消失
    cancel() {
        this.viewCtrl.dismiss();
    }
}