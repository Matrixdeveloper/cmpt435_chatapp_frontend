import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { CommunicationService } from './communication.service';
import { DataService } from './data.service';
import { passwordValidator } from './password.validator';
import { Subscription} from 'rxjs';

/**
 * 2020 FALL CMPT435 Project
 * Name: Yue Weng
 * NSID: yuw857
 * Student number: 1121 9127
 */


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'web';

  // login formgrop;
  public loginForm:FormGroup;
  public signUpForm:FormGroup;

  // mark 
  public loginDisplay;
  public signUpDisplay;
  

  // user data, after login put data here;
  public userData;
  public socket;
  public maintainID;


  
  constructor(
    private _comService: CommunicationService,
    private fb: FormBuilder,
    private _dataService: DataService
    ){}

  
  ngOnInit(){
    // set intial login status
    this.loginDisplay = true;

    // ------
    this._dataService.currentMessage.subscribe(message => this.userData = message)

    // ------
    // intialize form group
    this.loginForm = this.fb.group({
      userName:["", [ 
        Validators.required,
        Validators.minLength(5)]
      ],
      password:["",
      Validators.required]
    })

    this.signUpDisplay = false;
    this.signUpForm = this.fb.group({
      userName:["", [ 
        Validators.required,
        Validators.minLength(5)]
      ],
      password:[""],
      confirm:[""]},
      {validators: passwordValidator})
  }


  // getter function for validator
  get userName_S(){
    return this.signUpForm.get('userName');
  }

  get userName_L(){
    return this.loginForm.get('userName');
  }

  get password_L(){
    return this.loginForm.get('password');
  }

  get password_S(){
    return this.signUpForm.get('password');
  }


  // Entry functions
  onLogin(){
    let l_name = this.userName_L.value;
    let l_password = this.password_L.value;
    let message = {'username':l_name, 'password':l_password};

    this._comService.userLogin(message).subscribe(
      response => {
        console.log(response);
        if(response.result === true){
          this.loginDisplay = false;
          this.signUpDisplay = false;
          this._dataService.changeMessage(l_name);
          console.log(this.userData);
          this.socket =this._comService.getSocket();
          this.socket.next({
            "requestType":"InitSocket",
            "sender":l_name,
            "receiver":"",
            "result":false,
            "notification":"",
            "content":[]
          })
          this.maintainID = setInterval(this.maintainSocket, 1000*30, this.socket);
        }
      },
      error => {}
    )
  }

  maintainSocket(theSocket){
    theSocket.next({"method":"keepAlive"})
  }

  toSignUp(){
    this.loginDisplay = false;
    this.signUpDisplay = true; 
  }

  onSignUp(){
    // get form values
    let s_name = this.userName_S.value;
    let s_password = this.password_S.value;

    // convert to registration messge

    // call communication service
    let message = {'username':s_name, 'password':s_password}
    this._comService.userRegist(message).subscribe(
      response =>{console.log(response)},
      error => {console.log(error)}
    )
    
    
    // dynamically display result
    // console.log(s_name);
    this.backToLogin()

  }


  backToLogin(){
    this.loginDisplay = true;
    this.signUpDisplay = false;
    this.signUpForm.setValue({
      userName:"",
      password:"",
      confirm:""
    })
  }


  onSignOut(){
    this.loginDisplay = true;
    // release socket;
    // remove form value;
    // clean login user data;
  }
}
