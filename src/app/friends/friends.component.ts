import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../communication.service';
import { DataService } from '../data.service';
import { SocketMessage } from '../socket-message';
import { Message } from '../message';

/**
 * 2020 FALL CMPT435 Project
 * Name: Yue Weng
 * NSID: yuw857
 * Student number: 1121 9127
 */


@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  public username;
  public socket;

  public talkToFriend;
  public choosedFriend;

  constructor(
    private _commService:CommunicationService,
    private _dataService: DataService,
    ) { }

  ngOnInit(): void {
    this._dataService.currentMessage.subscribe(message=>{
      this.username=message
    })

    this.choosedFriend=false;
  
    this.socket = this._commService.getSocket();
    this.socket.subscribe(
      msg => {
        console.log(msg);
        try {
          let request:SocketMessage = <SocketMessage>msg;
          if(request.requestType==="AddFriendReport"){
            this.displayFriendResult(request);
          }
          else if(request.requestType==="FriendListReport"){
            this.displayFriendList(request);
          }
          else if(request.requestType ==="SingleHistoryReport"){
            this.displayHistoryMessage(request) 
          }
          else if(request.requestType==="SingleMsgReport"){
            if(request.sender == this.talkToFriend ||
               request.receiver == this.talkToFriend){
              this.displaySingleMessage(request)
            }
            // otherwise, ignore the pushing msg
          }

        } catch (error) {
          console.log(error)
        }
      },
      err => console.log(err),
      () => console.log('complete')
    );
    this.updateFriendList();
  }


  addFriend(){
    // get friend name
    let friendname =(<HTMLInputElement>document.getElementById("addNewFriend")).value;
    let message = {
      "requestType": "AddFriend", 
      "sender": this.username, 
      "receiver":friendname, 
      "result":false,
      "notification": "",
      "content":[]
    }
    // send request to server
    this.socket.next(message)
    this.updateFriendList();
  }

  displayFriendResult(data:SocketMessage){
    // console.log(data)
    let friendNotification = document.getElementById("friendWarning")
    let success = data.result;
    if(success){
      friendNotification.className = "text-success";
      this.updateFriendList();
    }else{
      friendNotification.className = "text-danger";
    }
    friendNotification.innerHTML = data.notification;
  }

  updateFriendList(){
    let message = {
      "requestType": "GetFriendList", 
      "sender": this.username, 
      "receiver":"", 
      "result":false,
      "notification": "",
      "content":[]
    }
    this.socket.next(message)
  }

  displayFriendList(data:SocketMessage){
    let view = document.getElementById("friendView");
    while(view.hasChildNodes()){
      view.removeChild(view.lastChild);
    }
    let rawList:Array<Message> = data.content;
    var self = this;

    rawList.forEach(element=>{
      var r =element.receiver;
      let newElement = document.createElement("button");
      newElement.className="btn btn-primary"
      newElement.innerHTML = r;
      // newElement.addEventListener("click", this.clickFriend.bind(r),)
      newElement.onclick=function(){
        self.choosedFriend =true;
        self.talkToFriend = r;
        self.initChatHistory();
      }
      let newline = document.createElement("br");
      view.appendChild(newElement);
      view.appendChild(newline);
    })
  }


  sendMessage(){
    let messageText =(<HTMLInputElement> document.getElementById("userMessage")).value;
    
    let message = {
      "requestType": "SendMsgSingle",
      "sender" : this.username,
      "receiver" : this.talkToFriend,
      "result": false,
      "notification": "",
      "content": [{
        "sender": this.username, 
        "receiver":this.talkToFriend,
        "text":messageText}]
    }
    this.socket.next(message);
  }


  initChatHistory(){
    let message = {
      "requestType": "GetSingleHistory",
      "sender" : this.username,
      "receiver" : this.talkToFriend,
      "result": false,
      "notification": "",
      "content":[]
    }
    this.socket.next(message);
    (<HTMLInputElement> document.getElementById("userMessage")).value="";
  }



  displaySingleMessage(msg:SocketMessage){
    let messageView = document.getElementById("messageView");

    let message:Message = msg.content[0];
    let newElement = document.createElement("div");

    if(message.sender===this.username){
      newElement.innerHTML = "Me: "+message.text;
      newElement.style.backgroundColor = "green";
      newElement.style.color = "white";
      newElement.style.float = "right";
      let newline = document.createElement("br");
      newElement.className = "myMessage";
      messageView.appendChild(newline);
      messageView.appendChild(newElement);
      messageView.appendChild(newline);
    }else{
      newElement.innerHTML = message.sender+": "+message.text;
      messageView.appendChild(newElement);
    }
  }

  displayHistoryMessage(msg:SocketMessage){
    let messageView = document.getElementById("messageView");

    while(messageView.hasChildNodes()){
        messageView.removeChild(messageView.lastChild);
    }
    
    let messages:Array<Message> = msg.content;
    messages.forEach(element =>{
      let newElement = document.createElement("div");
      if(element.sender === this.username){
        newElement.innerHTML = "Me: "+element.text;
        newElement.style.backgroundColor = "green";
        newElement.style.color = "white";
        newElement.style.float = "right";
        let newline = document.createElement("br");
        newElement.className = "myMessage";
        messageView.appendChild(newline);
        messageView.appendChild(newElement);
        messageView.appendChild(newline);
      }else{
        newElement.innerHTML = element.sender+": "+element.text;
        messageView.appendChild(newElement);
      }
    })
  }


}
