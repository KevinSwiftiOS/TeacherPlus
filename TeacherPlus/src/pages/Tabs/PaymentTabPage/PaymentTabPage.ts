import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { HttpService } from "../../../services/Commons/HttpService";
import { PaymentDetailPage } from "../../Payments/PaymentDetailPage/PaymentDetailPage";
import { InvoiceApplyPage } from "../../Payments/InvoiceApplyPage/InvoiceApplyPage";
import { InvoiceInfEntity } from "../../../services/Payments/PaymentDetailService/PaymentDetailService";
declare var swal;
@Component({
  selector: 'page-PaymentTabPage',
  templateUrl: 'PaymentTabPage.html',
  providers: [HttpService],
})
export class PaymentTabPage {
  items = new Array();
  constructor(public navCtrl: NavController, private httpService: HttpService, public loadingCtrl: LoadingController) {
    this.httpService.request("api/orders", {}, true).then(
      res => {
        if (res.code == 0) {

          this.items = res.data;
          //进行遍历
          for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].isPaied) {
              //已经申请过发票
              if (this.items[i].isInvoiceApplied)
                this.items[i].btnTitle = "发票信息";
              else
                this.items[i].btnTitle = "申请发票";
            } else
              //进行缴费
              this.items[i].btnTitle = "缴费";
          }
        } else
          swal("请求失败", res.message, "error");
      }
    )
  }
  doRefresh(refresher) {
    this.httpService.request("api/orders", {}, false).then(
      res => {
        if (res.code == 0) {
          refresher.complete();
          this.items = res.data;
          //进行遍历
          for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].isPaied) {
              //已经申请过发票
              if (this.items[i].isInvoiceApplied)
                this.items[i].btnTitle = "发票信息";
              else
                this.items[i].btnTitle = "申请发票";
            } else
              //进行缴费
              this.items[i].btnTitle = "缴费";
          }
        } else
          swal("请求失败", res.message, "error");
      }
    )
    //上拉刷新，全部重加载一遍
  }
  //查看发票详情或者缴费
  detailOrPay(item) {
    if (item.btnTitle == "缴费") {
      //打开支付链接
      var out = this;
      swal({
        title: "提醒",
        text: "您确认支付已经完成了吗?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnConfirm: true,
        closeOnCancel: true
      },
        function (isConfirm) {
          if (isConfirm) {
            //进行缓存的清理和跳转
            out.httpService.request("api/orders", {}, true).then(
              res => {
                if (res.code == 0) {

                  out.items = res.data;
                  //进行遍历
                  for (var i = 0; i < out.items.length; i++) {
                    if (out.items[i].isPaied) {
                      //已经申请过发票
                      if (out.items[i].isInvoiceApplied)
                        out.items[i].btnTitle = "发票信息";
                      else
                        out.items[i].btnTitle = "申请发票";
                    } else
                      //进行缴费
                      out.items[i].btnTitle = "缴费";
                  }
                } else
                  swal("请求失败", res.message, "error");
              }
            )
            //上拉刷新
          }
          return true;
        });










      this.httpService.openBrowser(item.urltopay);
    }
    else if (item.btnTitle == "发票信息")
      this.navCtrl.push(PaymentDetailPage, { item: item });
    else {
      //申请发票
    
      if (item.canApplyInvoice)
        this.navCtrl.push(InvoiceApplyPage, { item: new InvoiceInfEntity(),projectid:item.projectid,hasInvoice:false });
        else
        swal("提醒","无法申请发票","warning");
    }
  }
}
