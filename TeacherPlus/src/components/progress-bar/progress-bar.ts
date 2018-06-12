import { Component, Input } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

  @Input()
  progress;

  @Input()
  labelStyle: string;

  constructor() {
    this.labelStyle = 'inner';
  }

}