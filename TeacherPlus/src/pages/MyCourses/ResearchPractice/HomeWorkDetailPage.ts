/**
 * Created by hcnucai on 2017/3/9.
 */
import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular'
import { LoadingController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Camera, ImagePicker, CameraOptions} from 'ionic-native';
import { Platform } from 'ionic-angular';
import {HttpService} from "../../../services/Commons/HttpService";
import { SlideImagesPage } from "../../Commons/SlideImagesPage/SlideImagesPage";
import { isTrueProperty } from 'ionic-angular/util/util';
import { Keyboard } from '@ionic-native/keyboard';
declare var VideoEditor,VideoEditorOptions;
declare var swal;
@Component({
  selector: 'page-HomeWorkDetailPage',
  templateUrl: 'HomeWorkDetailPage.html'
})
export class HomeWorkDetailPage {
 data;
 //文本回答内容
 myTextAnswer = ""; 
//是否显示有文本答题和附件上传答题
//回答的上传附件
ansAttachs = new Array();
//是否是文本答案上传或者附件答案上传
 hasText;
 hasAttach;
 //附件
 attachs = new Array();;
 item;
 loader;
 //是否已经上传过文件或者是文本
 hasAnsText = false;
 hasAnsAttach = false;
 saveToReset = false;
 hasAns = false;
 isPractice = false;
 desc;
 maxFileUploadCount = 1;
 hasComment = false;
 btnTitle;
 canWork = false;
 //要展现的图片
 showImages = new Array();
 imgs = new Array();
 constructor(public keyboard:Keyboard, public modalCtrl:ModalController, public plt: Platform, public actionSheetCtrl:ActionSheetController, public loadingCtrl:LoadingController,public navParams:NavParams,private httpService:HttpService, public navCtrl: NavController) {
  let 
  appEl = <HTMLElement>(document.getElementsByTagName('ION-APP')[0]),
  appElHeight = appEl.clientHeight;

this.keyboard.disableScroll(true);

window.addEventListener('native.keyboardshow', (e) => {
  appEl.style.height = (appElHeight - (<any>e).keyboardHeight) + 'px';
});

window.addEventListener('native.keyboardhide', () => {
  appEl.style.height = '100%';
});
  this.keyboard.onKeyboardShow().subscribe((value: any)=>{
 
    this.keyboard.disableScroll(true);
    
  });

  this.item = this.navParams.get("item");

  this.isPractice = this.navParams.get("isPractice");
  //是否是从练习模块 或者是从研修课程中的作业实践跳转过来的
  if(this.isPractice)
  this.desc = this.item.desc;
  else
  this.desc = this.item.metadata.taskDetails;
 
}
 //页面加载进后
 ionViewWillEnter() {
  var out = this;
    if(this.isPractice) {
    this.httpService.request("api/homeworks/" + this.navParams.get("item").id,{},true).then(
       res => {
         if(res.code == 0){
          out.data = res.data;
          out.data.desc = out.navParams.get("item").desc;
           out.maxFileUploadCount = out.data.maxFileUploadCount;
        
     out.viewInit();
       
     
        }else
         swal("请求失败",res.message,"error");
      }
      ) 
    }else{
     this.data = this.item.metadata; 
     out.data.desc = this.item.metadata.taskDetails;
    
   out.viewInit();
    }

  
  }
viewInit() {
  var out = this;
  //判断是否有评论
  if(this.data.judgeTime != null && this.data.judgeTime != ""){
     this.hasComment = true;
  }
   //是否已经有文本上传答案
  if(out.data.myTextAnswer != null){ 
    out.hasAnsText = true;
  }

  if(!this.isPractice) {
    if(out.data.myFileIdAnswer != null)
out.data.attachs = [out.data.attach];
  
}
//是否已经有附件上传答案
  if(out.data.attachs != null) {
  out.hasAnsAttach = true;
  var Attachs = new Array();
 
  Attachs = out.data.attachs;

  for(var i = 0; i < Attachs.length;i++)  {

   Attachs[i].FLength = (Attachs[i].fileLength / 1048576).toFixed(2);
  
 }
  out.data.attachs = Attachs;

}

  if(this.hasAnsAttach || this.hasAnsText)
  this.hasAns = true;
  else
  this.hasAns = false;
  //都没有上传过。表示原先没有答案
  if(!out.hasAnsText && ! out.hasAnsAttach) {
   switch (out.data.answerType){
     case "文本编辑":
     out.hasText = true;
     out.hasAttach = false;
     break;
     case "上传附件":
     out.hasText = false;
     out.hasAttach = true;
     break;
     case "文本编辑,上传附件":
     out.hasText = true;
     out.hasAttach = true;
     break;
     default:
     break;

   }
 }else{
   out.hasAttach = false;
   out.hasText = false;
 }

  if((this.hasAnsAttach || this.hasAnsText) && this.data.canWork)
     this.btnTitle = "重做";
     else
     this.btnTitle = "提交";
     this.canWork = this.data.canWork;

}
//添加图片
addImg() {
  if(this.ansAttachs.length < this.maxFileUploadCount) {
  var out = this;
  if(this.data.canWork) {
  let actionSheet = this.actionSheetCtrl.create({
    title: '请选择图片来源',
    buttons: [
      {
        text: "从相册中选取图片",
        role: 'destructive',
        handler: () => {

          ImagePicker.getPictures({
            maximumImagesCount: out.maxFileUploadCount
          }).then(images => {
            out.loader = out.loadingCtrl.create(
              {
                content:"正在上传中"
              }
            );
            out.loader.present();
            var cnt = 0;
         for(var i = 0 ; i < images.length;i++){
          this.httpService.uploadImage(images[i], "type=3").then(
            res => {
              cnt++;
             
            if(cnt == images.length) {
              out.loader.dismiss();
            }
              if (res.code == 0) {
               
               var uploadedFile = res.data;
               uploadedFile.FLength =  ((uploadedFile.fileLength) / 1048576).toFixed(2);
             out.ansAttachs.push(uploadedFile);
             out.imgs.push(uploadedFile);
        
             }else{
              out.loader.dismiss();
          swal("上传失败",res.message,"error");
            }
          })
         }
          
          })
        }
      },
      {
        text: "拍摄照片",
        role: 'destructive',
        handler: () => {
          var options = {
            // Some common settings are 20, 50, and 100
            quality: 50,
            destinationType: 1,
            sourceType: 1,
            allowEdit: true,
            targetWidth: 50,
            targetHeight: 50,
            saveToPhotoAlbum: true,
          };

          Camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            out.loader = out.loadingCtrl.create(
              {
                content:"正在上传中"
              }
            );
            out.loader.present();
         

           //上传图片
          
            this.httpService.uploadImage(imageData, "type=3").then(
              res => {
                out.loader.dismiss();
                if (res.code == 0) {
               
                 var uploadedFile = res.data;
                 uploadedFile.FLength =  ((uploadedFile.fileLength) / 1048576).toFixed(2);
               out.ansAttachs.push(uploadedFile);
                  out.imgs.push(uploadedFile);  
                 
     
                  
                
              }else{
            swal("上传失败",res.message,"error");
              }
            })
          
          }, (err) => {
            // Handle error
            out.loader.dismiss();

          });

        }
      },
      {
        text: "取消",
        role: 'cancel',
        handler: () => {


        }
      },
    ]
  });
  actionSheet.present();
}else{
  swal("提醒","已关闭作业编辑","warning");
}
  }else{
    swal("提醒","已达到上限","warning");
  }
}

//添加附件
addAttach() {
if(this.ansAttachs.length < this.maxFileUploadCount) {
  var out = this;
  var options:CameraOptions = {
    quality: 50,
  destinationType: Camera.DestinationType.FILE_URI,
   sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
    mediaType:Camera.MediaType.VIDEO
  };
 
  Camera.getPicture(options).then((imageData) => {
    // imageData is either a base64 encoded string or a file URI
    // If it's base64:
//       if (this.plt.is('ios')) {
  out.loader = out.loadingCtrl.create(
    {
      content:"正在上传中"
    }
  );
  out.loader.present();
  var beforeEditor =  imageData.substr(imageData.lastIndexOf('/') + 1);
  var afterEditror = beforeEditor.substr(0,beforeEditor.lastIndexOf('.')) + ".mp4";
  if(this.plt.is('ios')) {

   
      VideoEditor.transcodeVideo(
        videoTranscodeSuccess, // success cb
        videoTranscodeError, // error cb
        {
            fileUri: imageData, // the path to the video on the device
            outputFileName:afterEditror, // the file name for the transcoded video
            outputFileType: VideoEditorOptions.OutputFileType.MPEG4, // android is always mp4
            optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.YES, // ios only
            saveToLibrary: true, // optional, defaults to true
            deleteInputFile: false, // optional (android only), defaults to false
            maintainAspectRatio: true, // optional (ios only), defaults to true
            width: 640, // optional, see note below on width and height
            height: 640, // optional, see notes below on width and height
            videoBitrate: 1000000, // optional, bitrate in bits, defaults to 1 megabit (1000000)
            fps: 24, // optional (android only), defaults to 24
            audioChannels: 2, // optional (ios only), number of audio channels, defaults to 2
            audioSampleRate: 44100, // optional (ios only), sample rate for the audio, defaults to 44100
            audioBitrate: 128000, // optional (ios only), audio bitrate for the video in bits, defaults to 128 kilobits (128000)
            progress: function(info) {} // info will be a number from 0 to 100
        }
    );
  }else{
  
    this.uploadVideo(imageData,afterEditror);
  }
  
  }, (err) => {

    // Handle error
  //swal("选取视频失败","请尝试再次选取","error");
  out.loader.dismiss();
  });




    
  }else{
    swal("已达到上限","最多选取" + this.maxFileUploadCount + "个视频","warning");
  }
 function  videoTranscodeSuccess(result) {
  var beforeEditor =  result.substr(result.lastIndexOf('/') + 1);
  var afterEditror = beforeEditor.substr(0,beforeEditor.lastIndexOf('.'));
  
    // result is the path to the transcoded video on the device
    out.uploadVideo(result,afterEditror);
  }
  
 function  videoTranscodeError(err) {
 //  swal("上传失败","请尝试再次选取","warning");
   out.loader.dismiss();
  
     };
    }
//添加附件后上传视频
uploadVideo(result,name) {

  var out = this;
    this.httpService.uploadVideo(result,"type=3",name).then(
    res => {
      out.loader.dismiss();
      if(res.code == 0) {
        swal("恭喜您","上传视频成功","success");
   
        var uploadedFile = res.data;
        uploadedFile.FLength =  ((uploadedFile.fileLength) / 1048576).toFixed(2);
      out.ansAttachs.push(uploadedFile);
 
      }
      else {
    
   swal("上传视频失败",res.message,"error");
    }
    }
  )
}
//删除附件
removeAnsAttach(attach,index){
  this.ansAttachs.splice(index,1);
  if(attach.fileType == '图片'){
    //进行遍历
    for(var i = 0; i < this.imgs.length;i++)
    if(attach.fileId == this.imgs[i].fileId) {
      this.imgs.splice(i,1);
      break;
    }
  }

}





 //最终的保存
 finalSave() {
    if(this.btnTitle == "重做") {
    this.btnTitle = "提交";
    if(this.data.canWork) {
      this.hasAnsAttach = false;
      this.hasAnsText = false;
      switch (this.data.answerType){
        case "文本编辑":
        this.hasText = true;
        this.hasAttach = false;
        break;
        case "上传附件":
        this.hasText = false;
        this.hasAttach = true;
        break;
        case "文本编辑,上传附件":
        this.hasText = true;
        this.hasAttach = true;
        break;
        default:
        break;
  
      }
  
    this.saveToReset = true;
   
  }else{
    swal("提醒","无法进行答题","warning");
  }  
  }else{
    var out = this;

    out.loader = out.loadingCtrl.create(
      {
        content:"正在上传中"
      }
    );
    out.loader.present();




  var out = this;
 
  if(this.isPractice){
  var params = {
    textAnswer:this.myTextAnswer,
    attachs:this.ansAttachs,
  };



  this.httpService.request("/api/homeworks/" + this.item.id + "/save",params,true).then(
    res => {
      out.loader.dismiss();
      if(res.code == 0) {
      swal({
        title: "恭喜您",
        text: "提交成功",
        type: "success",
        height: 10000,
        width: 100,
    },
    function () {
      //重置密码
   
       out.navCtrl.pop();
        return true;
    });
  }    
      else 
      swal("提交失败",res.message,"error");
    }
  )
}else{
var param = {
  textAnswer:this.myTextAnswer,
  attachs:this.ansAttachs
};
this.httpService.request("/api/courses/" + this.item.id + "/saveHomework",param,true).then(
  res => {
    out.loader.dismiss();
    if(res.code == 0) {
    swal({
      title: "恭喜您",
      text: "提交成功",
      type: "success",
      height: 10000,
      width: 100,
  },
  function () {
    //重置密码
 
     out.navCtrl.pop();
      return true;
  });
}    
    else 
    swal("提交失败",res.message,"error");
  }
)
}
    }
}



// //不重置返回原始已答题状态  
// back() {
//   this.saveToReset = false;
//   this.hasAttach = false;
//   this.hasText = false;
//   if(this.data.myTextAnswer != null) 
//   this.hasAnsText = true;
//   if(this.data.attachs != null) {
//   this.hasAnsAttach = true;
//   //进行文件大小转换

// }
  //有无评语

//}

//上传附件详情
detailAnsAttach(attach) {





if(attach.fileType == '图片') {
 //进行遍历

 var ansImages = new Array();
 var showImages = new Array();
 for(var j = 0; j < this.data.attachs.length;j++){
   if(this.data.attachs[j].fileType == '图片') {
 ansImages.push(this.data.attachs[j]);
 showImages.push(this.data.attachs[j].fileUrl);
   }
 }

 var index = 0;
 for (; index < ansImages.length; index++) {
   if (ansImages[index].fileId == attach.fileId)
     break;
 }


 let profileModal = this.modalCtrl.create(SlideImagesPage, { imgs: showImages, index: index });




 profileModal.onDidDismiss(data => {
   //这里写相关操作

 });
 profileModal.present();

}
else
this.httpService.openBrowser(attach.fileUrl);
 //显示评语

}
//未提交前的附件详情
detailAttachBeforeSubmit(attach,i){
  //进行遍历

if(attach.fileType == '图片') {
 var showImages = new Array();

 var index = 0;

 for (; index < this.imgs.length; index++) {
 
   if (this.imgs[index].fileName == attach.fileName)
     break;
 }
 for(var j = 0; j < this.imgs.length; j++) {
 showImages.push(this.imgs[j].fileUrl);
}
 let profileModal = this.modalCtrl.create(SlideImagesPage, { imgs: showImages, index: index });




 profileModal.onDidDismiss(data => {
   //这里写相关操作

 });
 profileModal.present();
}
else
this.httpService.openBrowser(attach.fileUrl);
}
keyboardCheck() {

this.keyboard.disableScroll(true);
}
}

