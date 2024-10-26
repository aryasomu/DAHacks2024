import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, and Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Add Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Define Planets with radius, distance from the sun, color, and orbit speed
const planets = [
    { radius: 0.2, distance: 2, color: 0xaaaaaa, orbitSpeed: 0.02 },
    { radius: 0.3, distance: 3, color: 0xffcc99, orbitSpeed: 0.018 },
    { radius: 0.4, distance: 4, color: 0x3399ff, orbitSpeed: 0.016 },
    { radius: 0.3, distance: 5, color: 0xff5733, orbitSpeed: 0.014 },
    { radius: 0.7, distance: 6, color: 0xd2691e, orbitSpeed: 0.012 },
    { radius: 0.6, distance: 7, color: 0xffcc33, orbitSpeed: 0.01 },
    { radius: 0.5, distance: 8, color: 0x66b3ff, orbitSpeed: 0.008 },
    { radius: 0.5, distance: 9, color: 0x0000ff, orbitSpeed: 0.006 }
];

// Create planets and add to the scene
const planetMeshes = planets.map((planet) => {
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: planet.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = planet.distance;
    scene.add(mesh);
    return { mesh, distance: planet.distance, orbitSpeed: planet.orbitSpeed, angle: 0 };
});

// Set initial camera position
camera.position.z = 15;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update each planet's position based on its orbit speed
    planetMeshes.forEach((planet) => {
        planet.angle += planet.orbitSpeed; // Increment the angle by orbit speed
        planet.mesh.position.x = planet.distance * Math.cos(planet.angle);
        planet.mesh.position.z = planet.distance * Math.sin(planet.angle);
    });

    controls.update();
    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();

