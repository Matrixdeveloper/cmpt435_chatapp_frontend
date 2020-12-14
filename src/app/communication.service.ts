import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AkkaMessage } from './AkkaString';
import { Message } from './message';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { OperationResult } from './operation-result';


@Injectable({
  providedIn: 'root'
})
export class CommunicationService{

  public serverURL="http://localhost:8080/";

  private subject = webSocket("ws://localhost:8081/socket");
  


  constructor(private http: HttpClient) { }

  getAkkaString(): Observable<AkkaMessage>{
    return this.http.get<AkkaMessage>(this.serverURL);
  }

  // userLogin(loginData): {logInfo:String, success:boolean}
  // {

  //   return {logInfo:"testLogin", success:true};
  // }

  userLogin(loginData):Observable<OperationResult>{
    return this.http.post<any>(this.serverURL+"login", loginData);
  }

  userRegist(signUpdata): Observable<OperationResult>{
    return this.http.post<any>(this.serverURL+"registry", signUpdata);
  }

  getUserInfo(userData): Observable<AkkaMessage>{
    return this.http.post<any>(this.serverURL+"user", userData);
  }

  getChatHistory(userData,friendData):Message[]{
    let container:Message[] = [];
    // let msg:Message = {'senderName':"local", 'timeStamp':'today', 'content':'hello chat app'};

    // container.push(msg);
    // container.push(msg);

    return container;
  }

  getSocket(){
    // this.subject.subscribe(
    //   msg => {console.log(msg)},
    //   err => console.log(err),
    //   () => console.log('complete')
    // );
    return this.subject

    // this.subject.next({message: "some message"});
  }


  // tomorrow
  getGroupHistory(userData, groupData):Message[]{
    let container:Message[] = [];
    // let msg:Message = {'senderName':"JackMa", 'timeStamp':'today', 'content':'hello chat app'};

    // let msg2:Message = {'senderName': "KakunLi", 'timeStamp':'yesterday', 'content': 'love hot pot'};

    // container.push(msg);
    // container.push(msg2);

    return container;
  }



}
