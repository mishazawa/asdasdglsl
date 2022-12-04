import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControlsService {
  private sliderSpeedValue: number[] = [0, 0, 0];

  public get rotationSpeed () {
    return this.sliderSpeedValue;
  }

  public setRotationSpeed(axis, value) {
    if (axis < 0 || axis > 2) return;
    this.sliderSpeedValue[axis] = value;
  }

  constructor() { }
}
