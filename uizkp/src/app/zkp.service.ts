import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class ZkpService {

  constructor(private _http:Http) { }

  onRegister(info){
    console.log("info",info);
    return this._http.get("http://localhost:8080/api/query?carname="+info)
  //   .subscribe(result => {
  //     console.log(result);
  // })
  }

}
