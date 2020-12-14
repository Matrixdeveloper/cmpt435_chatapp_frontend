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
  selector: 'app-chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.css']
})
export class ChatRoomsComponent implements OnInit {

  public chatRoomsData=[];
  public username;
  public socket;

  public choosedRoom;
  public talkInRoom;

  constructor(
    private _commService:CommunicationService,
    private _dataService: DataService,) { }

  ngOnInit(): void {
    this._dataService.currentMessage.subscribe(message=>{
      this.username=message
    })

    this.socket = this._commService.getSocket();


    this.choosedRoom = false
    this.socket.subscribe(
      msg=>{
        try{
          let request:SocketMessage = <SocketMessage>msg;
          if(request.requestType==="RoomListReport"){
            this.displayRoomList(request);
          }else if(request.requestType==="RoomMessageReport"){
            this.displayRoomMessage(request);
          }else if(request.requestType==="RoomHistoryReport"){
            this.displayHistoryMessage(request);
          }else{
            console.log(request)
          }
        } catch(error){
          console.log(error)
        }
      },
      err => console.log(err),
      () => console.log('complete')
    )

    this.updateRoomList()
  }


  updateRoomList(){
    let message = {
      "requestType": "GetRoomList", 
      "sender": "", 
      "receiver":"", 
      "result":false,
      "notification": "",
      "content":[]
    }
    this.socket.next(message)
  }

  displayRoomList(msg:SocketMessage){
    let view = document.getElementById("roomListView");
    while(view.hasChildNodes()){
      view.removeChild(view.lastChild);
    }
    let rawList:Array<Message> = msg.content;
    var self = this;

    rawList.forEach(element=>{
      var r =element.receiver;
      let newElement = document.createElement("button");
      newElement.className="btn btn-primary"
      newElement.innerHTML = r;
      newElement.onclick=function(){
        self.choosedRoom =true;
        self.talkInRoom= r;
        self.initChatHistory();
      }
      let newline = document.createElement("br");
      view.appendChild(newElement);
      view.appendChild(newline);
    });

    let roomNotification = document.getElementById("roomWarning")
    let success = msg.result;
    if(success){
      roomNotification.className = "text-success";
    }else{
      roomNotification.className = "text-danger";
    }
    roomNotification.innerHTML = msg.notification;
  }

  initChatHistory(){
    let message = {
      "requestType": "GetRoomHistory",
      "sender" : this.username,
      "receiver" : this.talkInRoom,
      "result": false,
      "notification": "",
      "content":[]
    }
    this.socket.next(message);
  }

  createRoom(){
    // get friend name
    let newRoom =(<HTMLInputElement>document.getElementById("newRoomName")).value;
    let message = {
      "requestType": "CreateRoom", 
      "sender": this.username, 
      "receiver":newRoom, 
      "result":false,
      "notification": "",
      "content":[]
    }
    // send request to server
    this.socket.next(message)
  }

  displayRoomMessage(msg:SocketMessage){
    let messageView = document.getElementById("roomMessageView");

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
    let messageView = document.getElementById("roomMessageView");

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


  sendMessage(){
    let messageText =
    (<HTMLInputElement> document.getElementById("roomMessage")).value;
    
    let message = {
      "requestType": "SendMsgRoom",
      "sender" : this.username,
      "receiver" : this.talkInRoom,
      "result": false,
      "notification": "",
      "content": [{
        "sender": this.username, 
        "receiver":this.talkInRoom,
        "text":messageText}]
    }
    this.socket.next(message);
    (<HTMLInputElement> document.getElementById("roomMessage")).value = "";

  }


}
