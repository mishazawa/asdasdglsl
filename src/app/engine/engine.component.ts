import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EngineService} from './engine.service';
import {ControlsService} from '../controls/controls.service';


import {
  Points,
  BoxGeometry,
  MathUtils,
  Mesh,
  Object3D,
  PlaneGeometry,
  ShaderMaterial,
  Uniform,
  DoubleSide,
  UniformsLib,
  UniformsUtils,
  Color,
  TextureLoader,
  Vector2,
  DataTexture,
  MeshLambertMaterial,
  AmbientLight,
  MeshBasicMaterial,
  Box3,
  BufferAttribute,
  Vector3,
  RGBAFormat,
  FloatType,
  BufferGeometry,
  Float32BufferAttribute,
  PointsMaterial
} from 'three';

import fragmentShader from 'raw-loader!./shaders/sine.frag';
import vertexShader from 'raw-loader!./shaders/sine.vert';

const textureUrl = '../../assets/voronoi_bw_256.png';
const sphereUrl  = '/assets/sphere.json';
const cubeUrl  = '/assets/cubev.json';
const pigheadUrl  = '/assets/pighead.json';

interface IHouVector3 {
  X: number,
  Y: number,
  Z: number,
}

interface HouSphere {
  P: IHouVector3,
  v: IHouVector3,
  Cd: IHouVector3,
}

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html'
})
export class EngineComponent implements OnInit {

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  private cube: Object3D;

  public constructor(private engServ: EngineService, private ctlServ: ControlsService) {
  }

  public async ngOnInit() {
    this.engServ.createScene(this.rendererCanvas);

    const data = await this.engServ.loadJson(pigheadUrl) as HouSphere[];
    const geometry = new BufferGeometry();

    const resolution = new Vector2(data.length, 1);

    const len = resolution.x * resolution.y;

    const pos   = new Float32Array(4*len);
    const vel   = new Float32Array(4*len);
    const cd      = new Float32Array(4*len);

    const points = [];
    const ptnums = [];
    data.forEach((item, i) => {
      ptnums.push(i);
      points.push(0, 0, 0);
      const stride = i*4;

      pos[stride]   = item.P.X;
      pos[stride+1] = item.P.Y;
      pos[stride+2] = item.P.Z;
      pos[stride+3] = 0;

      vel[stride]   = item.v.X;
      vel[stride+1] = item.v.Y;
      vel[stride+2] = item.v.Z;
      vel[stride+3] = 0;


      cd[stride]    = item.Cd.X;
      cd[stride+1]  = item.Cd.Y;
      cd[stride+2]  = item.Cd.Z;
      cd[stride+3]  = 1;
    });

    const vertices = new Float32Array(points);
    const ptnum    = new Int32Array(ptnums);

    geometry.setAttribute('position', new BufferAttribute(vertices, 3));
    geometry.setAttribute('ptnum',    new BufferAttribute(ptnum, 1));

    const posTexture = new DataTexture(pos, resolution.x, resolution.y, RGBAFormat, FloatType);
    const velTexture = new DataTexture(vel, resolution.x, resolution.y, RGBAFormat, FloatType);
    const CdTexture  = new DataTexture(cd, resolution.x, resolution.y, RGBAFormat, FloatType);

    posTexture.needsUpdate = true;
    velTexture.needsUpdate = true;
    CdTexture.needsUpdate  = true;


    const material = new ShaderMaterial({
      // wireframe: true,
      side: DoubleSide,
      fragmentShader,
      vertexShader,
      uniforms: {
        width: new Uniform(resolution.x),
        P:  new Uniform(posTexture),
        color: new Uniform(CdTexture),
      }
    });

    const _material = new PointsMaterial({ size: 0.1, color: 0xff0000 });
    const geo = new Points(geometry, material);

    this.engServ.Scene.add(geo);

    this.engServ.animate(this.animateFn.bind(this));
  }

  public animateFn (dt) {
    // const [x, y, z] = this.ctlServ.rotationSpeed;
    //   this.cube.rotation.x += x * dt;
    //   this.cube.rotation.y += y * dt;
    //   this.cube.rotation.z += z * dt;

      // ((this.cube as Mesh).material as ShaderMaterial).uniforms['time'].value += dt;
  }
}


