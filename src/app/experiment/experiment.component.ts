import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../communication.service';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.css']
})
export class ExperimentComponent implements OnInit {
  public info;

  // loginForm

  constructor(
    private _comService: CommunicationService,
    ) { }

  ngOnInit(): void {

  }

  public onClick(){
    this._comService.getAkkaString()
    .subscribe(data => {this.info = data;
      console.log(this.info);
    });
  }

}
