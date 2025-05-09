import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 12, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setAnimationLoop( animate );
renderer.setPixelRatio( window.devicePixelRatio );

document.getElementById('canvas').appendChild( renderer.domElement );
const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( 0, 15, 5 ).normalize();
scene.add( light );

const target = new THREE.Object3D();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane( );
const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

window.addEventListener( 'mousemove', (event) => {
    mousePosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mousePosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    planeNormal.copy( camera.position ).normalize();
    plane.setFromNormalAndCoplanarPoint( planeNormal, scene.position );
    raycaster.setFromCamera( mousePosition, camera );
    raycaster.ray.intersectPlane( plane, intersectionPoint );
    target.position.set( intersectionPoint.x, intersectionPoint.y, 1);
});

let dragon;
camera.position.z = 5;
camera.position.y = 0.1;
renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );
renderer.setClearColor( 0x000000, 0.0 );
const loader = new GLTFLoader();
loader.load( './models/asd.glb', function ( gltf ) {
    scene.add( gltf.scene );
    dragon = gltf.scene;
}, undefined, function ( error ) {
  console.error( error );
} );


function animate() {
    if (dragon) {
        dragon.lookAt(target.position);
    }
	renderer.render( scene, camera );
}