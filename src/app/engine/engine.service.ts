import * as THREE from 'three';
import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { FileLoader, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader';


@Injectable({providedIn: 'root'})
export class EngineService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private clock: THREE.Clock;
  private controls: OrbitControls;

  private frameId: number = null;

  public get Scene() {
    return this.scene;
  }

  public get Renderer() {
    return this.renderer;
  }

  public constructor(private ngZone: NgZone) {
  }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.renderer != null) {
      this.renderer.dispose();
      this.renderer = null;
      this.canvas = null;
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>) {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });

    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene
    this.scene = new THREE.Scene();

    this.clock = new THREE.Clock();

    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.set(0, 2, 5);

    this.scene.add(this.camera);

    this.controls = new OrbitControls( this.camera, this.canvas );
    // soft white light
    this.light = new THREE.AmbientLight(0x404040);
    this.light.position.z = 10;
    this.scene.add(this.light);
  }

  public animate(fn): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render(fn);
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render(fn);
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public render(fn): void {
    this.frameId = requestAnimationFrame(() => {
      this.render(fn);
    });
    const delta = this.clock.getDelta();
    fn(delta)

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  public loadJson (url) {
    return new Promise((res, rej) => {
      new FileLoader().load(url, (data) => {
        try {
          const jsonData = JSON.parse(data as string);
          return res(jsonData)
        } catch (err) {
          return rej(err);
        }
      }, null, rej);
    });
  }

  public loadGlb (url) {
    return new Promise((res, rej) => {
      new GLTFLoader().load(url, (gltf) => {
        return res(gltf.scene);
      }, undefined, rej);
    });
  }

  public loadTexture (url) {
    return this.withLoader(url, new TextureLoader());
  }

  public loadTga(url) {
    return this.withLoader(url, new TGALoader());
  }

  private withLoader(url, loader, fn = (data: any): any => data) {
    return new Promise((res, rej) => {
      loader.load(url, (data) => {
        return res(fn(data));
      }, undefined, rej);
    });
  }

  public DEBUG_Sphere () {
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const cube = new THREE.Mesh( geometry, material );
    this.renderer.setClearColor(0xEEEEEE);
    this.scene.add( cube );
  }
}
