import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MyAccountComponent } from './my-account/my-account.component';
import { FriendsComponent } from './friends/friends.component';
import { ChatRoomsComponent } from './chat-rooms/chat-rooms.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes:Routes = [
 {path:'account', component:MyAccountComponent},
 {path:'friends', component:FriendsComponent},
 {path:'chat-rooms', component:ChatRoomsComponent},
 {path:'**', component:MyAccountComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents=[
  MyAccountComponent,
  FriendsComponent,
  ChatRoomsComponent,
  PageNotFoundComponent
]
