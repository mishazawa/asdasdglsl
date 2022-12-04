import { Component, Input, OnInit } from '@angular/core';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  @Input() name: string;
  @Input() index: number;
  constructor(private ctlServ: ControlsService) { }

  ngOnInit(): void {
  }

  public setSpeedValue({target}) {
    const val = target.value;
    this.ctlServ.setRotationSpeed(this.index, parseInt(val));
  }

}
