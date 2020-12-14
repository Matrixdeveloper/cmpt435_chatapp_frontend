import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ExperimentComponent } from './experiment/experiment.component';

// for communication with backend
import { HttpClientModule} from '@angular/common/http';
import { CommunicationService } from './communication.service';

// for change html content
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule, routingComponents } from './app-routing.module';



@NgModule({
  declarations: [
    AppComponent,
    routingComponents
  ],
  imports: [
    BrowserModule,
    // imports for all components
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [CommunicationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
