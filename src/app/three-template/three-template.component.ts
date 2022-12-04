import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EngineService } from '../engine/engine.service';

@Component({
  selector: 'app-three-template',
  templateUrl: './three-template.component.html',
  styleUrls: ['./three-template.component.scss']
})
export class ThreeTemplateComponent implements OnInit {
  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  public constructor(private engServ: EngineService) {}

  ngOnInit(): void {
    this.engServ.createScene(this.rendererCanvas);
    this.engServ.DEBUG_Sphere();
    console.log('three template')
    this.engServ.animate((dt) => {});
  }

}
