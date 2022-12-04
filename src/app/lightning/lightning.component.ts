import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EngineService } from '../engine/engine.service';
import { AmbientLight, BoxGeometry, DirectionalLight, DoubleSide, Euler, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, Object3D, PlaneGeometry, ShaderMaterial, SphereGeometry, Uniform, UniformsLib, UniformsUtils, Vector3 } from 'three';


import fragmentShader from 'raw-loader!./shaders/vase.frag';
import vertexShader from 'raw-loader!./shaders/vase.vert';
import { degToRad } from 'three/src/math/MathUtils';

const MODEL_PATH = '../assets/figure.glb';

@Component({
  selector: 'app-lightning',
  templateUrl: './lightning.component.html',
  styleUrls: ['./lightning.component.scss']
})
export class LightningComponent implements OnInit {

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  public constructor(private engServ: EngineService) {}

  public async ngOnInit() {
    this.engServ.createScene(this.rendererCanvas);

    const sc = await this.engServ.loadGlb(MODEL_PATH) as Object3D<Event>;

    const ambientLight     = new AmbientLight(0xAAAAAA); // soft white light
    const directionalLight = new DirectionalLight( 0xffffff, .1 );

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

    const phong = new MeshPhongMaterial({color: 0xAAAAAA});
    const plane = new PlaneGeometry(10, 10, 100, 100);

    plane.rotateX(degToRad(-90));

    const planeMesh = new Mesh(plane, phong);
    planeMesh.receiveShadow = true;

    const customUniforms = {
      timeBasedColor: new Uniform(new Vector3(0, 0, 0)),
    };

    const shader = new ShaderMaterial({
      // wireframe: true,
      lights: true,
      // side: DoubleSide,
      fragmentShader,
      vertexShader,
      uniforms: UniformsUtils.merge([
        UniformsLib.lights,
        customUniforms,
      ]),
      defines: {
        AMBIENT_INTENSITY: .035,
      }
    });


    const vase = sc.children[0] as Mesh;
    vase.material = shader;
    vase.castShadow = true;

    const sphereGeometry = new SphereGeometry(.5, 32, 32);
    const sphere = new Mesh(sphereGeometry, phong);
    sphere.castShadow = true; //default is false
    sphere.receiveShadow = true; //default
    sphere.translateY(.5);
    sphere.translateX(1);

    this.add(sphere);
    this.add(planeMesh);
    this.add(vase);

    this.add(lightTarget);
    this.add(ambientLight);
    this.add(directionalLight);

    let timeElapsed = 0.;
    this.engServ.animate((dt) => {
      timeElapsed += dt;
      shader.uniforms['timeBasedColor'].value = new Vector3(
        0.6 + Math.sin(timeElapsed),
        0.6 + Math.cos(timeElapsed),
        0.6 + Math.sin(timeElapsed*10),
      )

      lightTarget.translateOnAxis(new Vector3(Math.sin(timeElapsed), 0, Math.cos(timeElapsed)), 5);

    });
  }

  add (obj) {
    this.engServ.Scene.add(obj);
  }
}
