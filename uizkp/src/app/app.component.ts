import { Component, OnInit } from '@angular/core';
import { ZkpService } from './zkp.service';
import { Http } from '@angular/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'uizkp';
  car='';
  data ='';
  constructor(private service: ZkpService){

  }
  onRegister(){
    this.service.onRegister(this.car).subscribe((data:any)=>{
      console.log(data);
      this.data = data._body;
    })
    // console.log("clicked");
}
}
