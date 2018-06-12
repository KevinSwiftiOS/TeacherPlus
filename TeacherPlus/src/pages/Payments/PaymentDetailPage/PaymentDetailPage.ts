/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';

import { NavController, NavParams, ModalCmp, ModalController } from 'ionic-angular';
import { HttpService } from "../../../services/Commons/HttpService";
import { InvoiceInfEntity } from "../../../services/Payments/PaymentDetailService/PaymentDetailService";
import { InvoiceApplyPage } from '../InvoiceApplyPage/InvoiceApplyPage';
import {SlideImagesPage} from "../../Commons/SlideImagesPage/SlideImagesPage";
declare var swal;
@Component({
  selector: 'page-PaymentDetailPage',
  templateUrl: 'PaymentDetailPage.html'
})
export class PaymentDetailPage {
  item = new InvoiceInfEntity();
  constructor(public modalCtrl:ModalController, public navCtrl: NavController, public navParams: NavParams, private httpServive: HttpService) {

    this.httpServive.request("/api/orders/invoice/" + this.navParams.get("item").invoiceid, {}, true).then(
      res => {
        if (res.code == 0) {
          this.item = res.data;

        } else
          swal("请求失败", res.message, "error");
      }
    )
  }
  openEinvoicePdfUrl() {
    //打开链接地址
    if (this.item.einvoicePdfUrl == null || this.item.einvoicePdfUrl == "")
      swal("提醒", "链接地址不存在", "warning");
    else
      this.httpServive.openBrowser(this.item.einvoicePdfUrl);
  }
  //编辑发票
  edit() {
    if (this.item.canModify)
      this.navCtrl.push(InvoiceApplyPage, { item: this.item,hasInvoice:true });
    else
      swal("提醒", "无法进行编辑", "warning");
  }
  //预览图片
  preview(index){
   
    let profileModal = this.modalCtrl.create(SlideImagesPage, { imgs: this.item.evidenceImgUrl, index: index });




    profileModal.onDidDismiss(data => {
      //这里写相关操作

    });
    profileModal.present();
  }  
}