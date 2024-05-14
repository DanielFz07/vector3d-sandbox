import * as THREE from 'three';

export const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000.0);
 
scene.add( new THREE.AmbientLight( 0xaaaaaa, 0.6 ) );

const light = new THREE.DirectionalLight( 0xddffdd, 2 );
light.position.set( 10, 10, 10 );

const d = 10;

light.shadow.camera.left = - d;
light.shadow.camera.right = d;
light.shadow.camera.top = d;
light.shadow.camera.bottom = - d;
light.shadow.camera.far = 1000;

scene.add( light );


export const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementsByClassName("canvas-container")[0].appendChild(renderer.domElement);