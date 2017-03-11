/**
 * Created by hcnucai on 2017/3/9.
 */
import {Injectable} from '@angular/core';
import {Http,JsonpModule} from  '@angular/http';
import 'rxjs/add/operator/toPromise';
//记下本服务的元数据
@Injectable()
export class HttpService {
  constructor(private http:Http) {
    console.log("Post Service init");
  }
  //发起请求的方法
  getPost():Promise<any[]> {
    var param = {
      authtoken: "0B849459E30161BE5A5E302F257022FA1FCF5D09E7BD2A2D",
      count: 100,
      page: 1        }
    return this.http.post("http://dodo.hznu.edu.cn/apiteach/courselist",param,{})
      .toPromise()
      .then( response => {

        let res =  response.json();

        if(res.retcode != 0){
          return Promise.reject(res.message);
        }else
          return Promise.resolve(JSON.stringify(response.json().items));
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

}
