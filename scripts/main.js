import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(15, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('dragonCanvas'),
    alpha: true,
    antialias: true
});

renderer.setAnimationLoop(animate);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0.0);

// Lighting for better visibility
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight1.position.set(5, 10, 5);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight2.position.set(-5, -5, 5);
scene.add(directionalLight2);

// Mouse tracking
const target = new THREE.Object3D();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

let currentRotation = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };
let isPageFocused = true;
let autoRotationAngle = 0;

window.addEventListener('mousemove', (event) => {
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;

    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mousePosition, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    target.position.set(intersectionPoint.x, intersectionPoint.y, 1);

    // Smooth rotation targets
    targetRotation.x = mousePosition.y * 0.2;
    targetRotation.y = mousePosition.x * 0.2;
});

// Focus/blur detection for auto-rotation
window.addEventListener('blur', () => {
    isPageFocused = false;
});

window.addEventListener('focus', () => {
    isPageFocused = true;
});

// Dragon model
let dragon;
camera.position.z = 5;
camera.position.y = 0;

// Canvas sizing
function updateCanvasSize() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.5;
    renderer.setSize(size, size);
}

updateCanvasSize();
window.addEventListener('resize', updateCanvasSize);

// Load dragon model
const loader = new GLTFLoader();
loader.load('./models/asd.glb', function (gltf) {
    scene.add(gltf.scene);
    dragon = gltf.scene;

    // Scale and position
    dragon.scale.set(1.0, 1.0, 1.0);
    dragon.position.y = 0;

    // Enhance materials
    dragon.traverse((child) => {
        if (child.isMesh) {
            child.material.metalness = 0.3;
            child.material.roughness = 0.7;
        }
    });
}, undefined, function (error) {
    console.error('Error loading dragon model:', error);
});

// Animation loop
let time = 0;

function animate() {
    time += 0.01;

    if (dragon) {
        if (!isPageFocused) {
            // Auto-rotate horizontally when focus is lost
            autoRotationAngle += 0.02;
            dragon.rotation.y = autoRotationAngle;
            dragon.rotation.x = 0;
            dragon.rotation.z = 0;
        } else {
            // Dragon follows mouse when focused
            // Smooth interpolation
            currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
            currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;
            dragon.lookAt(target.position);
        }
    }

    renderer.render(scene, camera);
}