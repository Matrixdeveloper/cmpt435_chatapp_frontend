import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private subject = new BehaviorSubject("default message");
  currentMessage = this.subject.asObservable();

  // sendData(message: String){
  //   this.subject.next(message);
  // }

  // clearData(){
  //   this.subject.next();
  // }

  // getData(): Observable<any>{
  //   return this.subject.asObservable();
  // }
  changeMessage(message: string){
    this.subject.next(message);
  }

  // constructor() { }
}
