import { Component, Input, OnInit } from '@angular/core';
import { CommunicationService } from '../communication.service';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { DataService } from '../data.service';
import { Subscription} from 'rxjs';


@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  public parentData:String;
  public socket;

  public username:String;


  constructor(
    private _commService: CommunicationService,
    private _dataService: DataService) { }

  ngOnInit(): void {
    this._dataService.currentMessage.subscribe(message =>{ 
      this.username=message;
    });
    
    
    console.log("here!");
    

    this.socket = this._commService.getSocket();
    // let message = {'account': "start!"};
    this.socket.subscribe(
      msg => {
       // console.log(msg)
      },
      err => console.log(err),
      () => console.log('complete')
    );
    // this.socket.next(message)
  }

}
