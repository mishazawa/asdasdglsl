import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EngineService } from '../engine/engine.service';
import { AmbientLight, BoxGeometry, DirectionalLight, DoubleSide, Euler, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, Object3D, PlaneGeometry, ShaderMaterial, SphereGeometry, Texture, Uniform, UniformsLib, UniformsUtils, Vector3 } from 'three';
import { degToRad } from 'three/src/math/MathUtils';

const MODEL_PATH = '../assets/rubber_toy.glb';
const TEXTURE_ALBEDO = '../assets/albedo.tga';
const TEXTURE_NORMAL = '../assets/normal.tga';
const TEXTURE_ROUGHNESS = '../assets/roughness.tga';

@Component({
  selector: 'app-baking',
  templateUrl: './baking.component.html',
  styleUrls: ['./baking.component.scss']
})
export class BakingComponent implements OnInit {

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  public constructor(private engServ: EngineService) {}

  public async ngOnInit() {
    this.engServ.createScene(this.rendererCanvas);

    const sc = await this.engServ.loadGlb(MODEL_PATH) as Object3D<Event>;

    const ambientLight     = new AmbientLight(0xAAAAAA); // soft white light
    const directionalLight = new DirectionalLight( 0xffffff, 1.2 );

    const lightTarget = new Object3D();
    lightTarget.translateOnAxis(new Vector3(1, 0, 0), 5);
    directionalLight.target = lightTarget;
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.top = 2;
    directionalLight.shadow.camera.bottom = - 2;
    directionalLight.shadow.camera.left = - 2;
    directionalLight.shadow.camera.right = 2;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 10;

    const plane = new PlaneGeometry(10, 10, 100, 100);

    const customUniforms = {
      timeBasedColor: new Uniform(new Vector3(0, 0, 0)),
    }

    const albedo = await this.engServ.loadTga(TEXTURE_ALBEDO) as Texture;
    const normal = await this.engServ.loadTga(TEXTURE_NORMAL) as Texture;
    const roughness = await this.engServ.loadTga(TEXTURE_ROUGHNESS) as Texture;

    albedo.flipY = false;
    normal.flipY = false;
    roughness.flipY = false;

    const phong = new MeshPhongMaterial({
      color: 0xFFFFFF,
      map: albedo,
      normalMap: normal,
      specularMap: roughness,
    });

    const vase = sc.children[0] as Mesh;
    vase.material = phong;
    vase.castShadow = true;

    this.add(vase);

    this.add(lightTarget);
    this.add(ambientLight);
    // this.add(directionalLight);

    let timeElapsed = 0.;
    this.engServ.animate((dt) => {});
  }

  add (obj) {
    this.engServ.Scene.add(obj);
  }
}
