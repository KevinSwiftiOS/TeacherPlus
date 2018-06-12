/**
 * Created by hcnucai on 2017/3/9.
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ThemeableBrowser, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
import { LoadingController, ActionSheetController } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';


import { Transfer } from 'ionic-native';
declare var swal;
//QQ和微信分享
declare var QQSDK;
declare var Wechat;
//记下本服务的元数据
@Injectable()
export class HttpService {
  hostip = "http://api.teacherplus.cn/";
  loader: any;
  private options = {
    //这里我仅仅定义了状态栏颜色（ios下有效）和关闭按妞，以及工具条的颜色和标题颜色
    statusbar: {
      color: '#008B8B'
    },
    toolbar: {
      height: 44,
      color: '#008B8B'
    },
    title: {
      color: '#ffffff',
      showPageTitle: true
    },
    closeButton: {
      image: 'close',
      imagePressed: 'close_pressed',
      align: 'left',
      event: 'closePressed'
    },
    backButtonCanClose: true
  };
  constructor(public ActionSheetCtrl:ActionSheetController, public themeableBrowser: ThemeableBrowser, private http: Http, private LoadingCtrl: LoadingController) {
    //  console.log("Post Service init");
  }

  //发起请求的方法

  request(subsul: string, params: any, needLoading: boolean = false): any {
    if (needLoading) {
      this.loader = this.LoadingCtrl.create({
        content: "请稍等"
      });
      this.loader.present();
    }
    var out = this;
    // let urlSearchParams = new URLSearchParams();
    //  //设置参数
    // for(var key in params){

    //     urlSearchParams.set(key, params[key]);
    // };

    var headers = new Headers({ 'Content-Type': 'application/json' });
    //查看localStorage中是否有authtoken 若有 设置到header中
    if (localStorage.getItem("authtoken") != null) {
      headers.append("authtoken", localStorage.getItem("authtoken"));
    };
    let options = new RequestOptions({ headers: headers });
    var url = this.hostip + subsul;
    return this.http.post(url, params, options)
      .toPromise()
      .then(

        res => {
          if (needLoading)
            out.loader.dismiss();
          // console.log(res.json().retcode);

          return res.json();
        }
      )
      .catch(res => {
        if (needLoading)
          out.loader.dismiss();
        return res.json();
      });
  }
  uploadImage(image: any, suburl: any): any {
    let ft = new Transfer();
    let filename = image.substr(image.lastIndexOf('/') + 1);
    let options = {
      fileKey: 'file',
      fileName: filename,
      mimeType: 'image/jpeg',
      chunkedMode: false,
      headers: {
        'Content-Type': undefined,
        "authtoken": localStorage.getItem("authtoken")
      },
    };

    return ft.upload(image, this.hostip + "api/common/uploadFile?" + suburl, options)
      .then((result: any) => {
        //  var res   =  JSON.stringify(result).replace("\\\"","\"").replace("\"{", "{").replace("}\"", "}");
        // console.log(res);
        var res = result.response;


        return JSON.parse(res);


      }).catch((error: any) => {

        swal("上传失败", error, "error");

      });
  }
  //上传视频
  uploadVideo(video: any, suburl: any, name: string): any {

    let ft = new Transfer();
    //  let filename = video.substr(video.lastIndexOf('/') + 1);
    let options = {
      fileKey: 'file',

      fileName: name,
      mimeType: 'application/octet-stream',
      chunkedMode: false,
      headers: {
        'Content-Type': undefined,
        "authtoken": localStorage.getItem("authtoken")
      },
    };
    return ft.upload(video, this.hostip + "api/common/uploadFile?" + suburl, options)
      .then((result: any) => {
        //  var res   =  JSON.stringify(result).replace("\\\"","\"").replace("\"{", "{").replace("}\"", "}");
        // console.log(res);
        var res = result.response;

        return JSON.parse(res);


      }).catch((error: any) => {

        swal("上传失败", error, "error");

      });
  }
  //打开浏览器
  openBrowser(url: any) {
    let browser: ThemeableBrowserObject = this.themeableBrowser.create(url, '_self',
      this.options);
  }
  //分享
  shareService(data){
    let actionSheet = this.ActionSheetCtrl.create({
      title: '请选择分享平台',
      buttons: [
        {
          text: "QQ好友",
          role: 'destructive',
          icon:"appname-QQ",
          handler: () => {
       
         //  loader.present();
         var args:any = {};
         args.client = QQSDK.ClientType.QQ;//QQSDK.ClientType.QQ,QQSDK.ClientType.TIM;
         QQSDK.checkClientInstalled(function () {
          var args: any = {};  
  
          args.index = QQSDK.Scene.QQ;  
        
        args.url = data.url;  
        args.title = data.title;  
        args.image = data.cover;  
        args.description = data.desc;
        QQSDK.shareNews(function () {  
         // alert('分享成功')  
        }, function (reason) {  
       //   alert('失败：'+reason)  
        }, args);  
         }, function () {
           // if installed QQ Client version is not supported sso,also will get this error
        swal("提醒","您未安装QQ或QQ版本过低","warning");
         }, args);

  
        }
        },
        {
          text: "微信好友",
          role: 'destructive',
          icon:"appname-wechat",
          handler: () => {
             //查看是否安装
             Wechat.isInstalled(function (installed) {
              if(installed == false)
              swal("提醒","您未安装微信或微信版本过低","warning");
              else{
                Wechat.share({
                  message: {
                      title: data.title,
                      description: data.desc,
                      thumb: data.cover,
                      mediaTagName: "TEST-TAG-001",
                      messageExt: "",  // 这是第三方带的测试字段
                      messageAction: "", // <action>dotalist</action>
                      media: {
                          type: Wechat.Type.WEBPAGE,
                          webpageUrl:data.url
                      }
                  },
                  scene:  Wechat.Scene.SESSION// share to Timeline
              }, function () {
                   //alert("分享成功！111");
              }, function (reason) {
                  // alert("Failed: " + reason);
              });
              }
             
          }, function (reason) {
            //  alert("Failed: " + reason);
          });

   

        }
      },
        {
          text: "微信朋友圈",
          role: 'destructive',
          icon:"appname-momment",
          handler: () => {
            //查看是否安装
            Wechat.isInstalled(function (installed) {
              if(installed == false)
              swal("提醒","您未安装微信或微信版本过低","warning");
              else{
                Wechat.share({
                  message: {
                      title: data.title,
                      description: data.desc,
                      thumb: data.cover,
                      mediaTagName: "TEST-TAG-001",
                      messageExt: "",  // 这是第三方带的测试字段
                      messageAction: "", // <action>dotalist</action>
                      media: {
                          type: Wechat.Type.WEBPAGE,
                          webpageUrl: data.url
                      }
                  },
                  scene:  Wechat.Scene.TIMELINE// share to Timeline
              }, function () {
                 
              }, function (reason) {
                  
              });
              }
             
          }, function (reason) {
            //  alert("Failed: " + reason);
          });

   
      

        }
        },
        {
          text: "取消",
          role: 'cancel',
          icon:"appname-shareCancel",
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
  }
}