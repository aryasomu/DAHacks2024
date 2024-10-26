import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import TWEEN from '@tweenjs/tween.js';

// Scene, Camera, and Renderer setup
const scene = new THREE.Scene();
const initialFOV = 30;
const camera = new THREE.PerspectiveCamera(initialFOV, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.fov = initialFOV;
camera.updateProjectionMatrix();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;
controls.enablePan = false;
controls.minPolarAngle = 0.3;
controls.maxPolarAngle = Math.PI - 0.3;
controls.minDistance = 30;
controls.maxDistance = 50;

let isPaused = false;

// Pause orbits when user rotates, resume when done
controls.addEventListener('start', () => { isPaused = true; });
controls.addEventListener('end', () => { isPaused = false; });

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Define planets with distances and random initial angles
const planets = [
    { radius: 0.3, distance: 4, color: 0xaaaaaa, speed: 0.001, moons: 1 },
    { radius: 0.3, distance: 5, color: 0xffcc99, speed: 0.0012, moons: 1 },
    { radius: 0.4, distance: 6, color: 0x3399ff, speed: 0.0015, moons: 2 },
    { radius: 0.3, distance: 7.5, color: 0xff5733, speed: 0.0011, moons: 1 },
    { radius: 0.7, distance: 9, color: 0xd2691e, speed: 0.0009, moons: 1 },
    { radius: 0.6, distance: 10.5, color: 0xffcc33, speed: 0.0013, moons: 2 },
    { radius: 0.6, distance: 12, color: 0x66b3ff, speed: 0.0014, moons: 1 },
    { radius: 0.5, distance: 13.5, color: 0x0000ff, speed: 0.001, moons: 1 }
];

// Position planets with varied initial angles
const planetMeshes = planets.map((planet) => {
    planet.angle = Math.random() * Math.PI * 2;

    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: planet.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
        planet.distance * Math.cos(planet.angle),
        0,
        planet.distance * Math.sin(planet.angle)
    );
    scene.add(mesh);

    // Create slower orbiting moons for each planet
    const moons = [];
    const moonBaseSpeed = 0.005;
    for (let i = 0; i < planet.moons; i++) {
        const moonGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const moonMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.set(planet.radius + 0.5 + i * 0.2, 0, 0);
        mesh.add(moon);
        moons.push({ mesh: moon, distance: planet.radius + 0.5 + i * 0.3, angle: i * Math.PI / 2, speed: moonBaseSpeed + i * 0.002 });
    }

    return { mesh, ...planet, moons };
});

// Initial camera position
camera.position.set(0, 20, 40);
camera.lookAt(scene.position);

// Raycaster and mouse for detecting clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isZoomedIn = false;

// Function to zoom in on the selected planet and pause animation
function zoomToPlanet(planet) {
    controls.target.copy(planet.position);
    isPaused = true;
    isZoomedIn = true;

    new TWEEN.Tween(camera.position)
        .to({
            x: planet.position.x,
            y: planet.position.y,
            z: planet.position.z
        }, 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
}

// Function to reset the zoom and resume animation
function resetZoom() {
    new TWEEN.Tween(camera.position)
        .to({ x: 0, y: 20, z: 40 }, 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
    controls.target.set(0, 0, 0);
    isPaused = false;
    isZoomedIn = false;
}

// Click event for zooming in on a planet
window.addEventListener('click', (event) => {
    if (isZoomedIn) {
        resetZoom();
        return;
    }

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planetMeshes.map(p => p.mesh));

    if (intersects.length > 0) {
        const clickedPlanet = intersects[0].object;
        zoomToPlanet(clickedPlanet);
    }
});

// Animation loop for sun, planets, and moons
function animate() {
    if (!isPaused) {
        planetMeshes.forEach((planet) => {
            planet.angle += planet.speed;
            planet.mesh.position.x = planet.distance * Math.cos(planet.angle);
            planet.mesh.position.z = planet.distance * Math.sin(planet.angle);

            planet.moons.forEach((moon) => {
                moon.angle += moon.speed;
                moon.mesh.position.x = moon.distance * Math.cos(moon.angle);
                moon.mesh.position.z = moon.distance * Math.sin(moon.angle);
            });
        });
    }

    controls.update();
    TWEEN.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Start animation
animate();
