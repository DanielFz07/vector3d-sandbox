import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { scene, camera, renderer } from './scene'

var primarySelect: THREE.Object3D;

function setPrimarySelect(object: any)
{
  primarySelect = object;
}
function getPrimarySelect() : THREE.Object3D
{
  return primarySelect;
}

var secundarySelect: THREE.Object3D;

function setSecundarySelect(object: any)
{
  secundarySelect = object;
}
function getSecundarySelect()
{
  return secundarySelect;
}

new OrbitControls( camera, renderer.domElement );

camera.position.set( 0, 0, 25 );
camera.lookAt(0,0,0);

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );


const gridHelper = new THREE.GridHelper( 10, 100 );
scene.add( gridHelper );

//Vector
/*const dir = new THREE.Vector3( 1, 2, 0 );

//normalize the direction vector (convert to vector of length 1)
dir.normalize();

const origin = new THREE.Vector3( 0, 0, 0 );
const length = 10;
const hex = 0xffff00;

const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
scene.add( arrowHelper );*/

const animate = function() 
{
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();

window.addEventListener( 'resize', () => 
{

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    
});

window.addEventListener('beforeunload', () => 
{
  renderer.renderLists.dispose();
});

export { getPrimarySelect, setPrimarySelect, getSecundarySelect, setSecundarySelect}