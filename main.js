import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import TWEEN from '@tweenjs/tween.js';

// Scene, Camera, and Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 60);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);
const sunLight = new THREE.PointLight(0xffffaa, 2, 250);
scene.add(sunLight);

// Sun with increased size and brightness
const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xf0f000 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);
sunLight.position.copy(sun.position);

// Stars in Background
const starGeometry = new THREE.BufferGeometry();
const starCount = 3000;
const starVertices = [];
for (let i = 0; i < starCount; i++) {
    const x = THREE.MathUtils.randFloatSpread(1000);
    const y = THREE.MathUtils.randFloatSpread(1000);
    const z = THREE.MathUtils.randFloatSpread(1000);
    starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0x888888 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Planets with more varied sizes and brighter materials
const planets = [
    { name: 'Mercury', radius: 0.5, distance: 8, color: 0xaaaaaa, speed: 0.02, info: 'Small rocky planet close to the Sun', image: 'mercury.png' },
    { name: 'Venus', radius: 0.9, distance: 12, color: 0xffcc99, speed: 0.015, info: 'Venus has a thick atmosphere', image: 'venus.png' },
    { name: 'Earth', radius: 1.0, distance: 16, color: 0x3399ff, speed: 0.01, info: 'Our home planet', image: 'earth.png' },
    { name: 'Mars', radius: 0.8, distance: 20, color: 0xff5733, speed: 0.008, info: 'Red planet with a thin atmosphere', image: 'mars.png' },
    { name: 'Jupiter', radius: 2.5, distance: 28, color: 0xd2691e, speed: 0.006, info: 'Gas giant with a strong magnetic field', image: 'jupiter.png' },
    { name: 'Saturn', radius: 2.0, distance: 34, color: 0xffcc33, speed: 0.005, info: 'Known for its prominent ring system', image: 'saturn.png' },
    { name: 'Uranus', radius: 1.7, distance: 40, color: 0x66b3ff, speed: 0.004, info: 'An ice giant with a unique tilt', image: 'uranus.png' },
    { name: 'Neptune', radius: 1.6, distance: 46, color: 0x0000ff, speed: 0.003, info: 'Distant ice giant', image: 'neptune.png' }
];

const planetMeshes = planets.map((planet) => {
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: planet.color, emissive: planet.color, emissiveIntensity: 0.5 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Draw orbit path
    const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.1, planet.distance + 0.1, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);

    return { mesh, ...planet, angle: Math.random() * Math.PI * 2 };
});

// Raycaster, Tooltip, and Frozen State
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.getElementById('tooltip');
let isFrozen = false;  // Freeze state variable

// Zoom and Tooltip Functions
function zoomToPlanet(planet) {
    controls.target.copy(planet.position);
    new TWEEN.Tween(camera.position)
        .to({ x: planet.position.x, y: planet.position.y, z: planet.position.z + 10 }, 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
}

function resetZoom() {
    new TWEEN.Tween(camera.position)
        .to({ x: 0, y: 30, z: 60 }, 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
    controls.target.set(0, 0, 0);
}

// Mouse Events
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(planetMeshes.map(p => p.mesh));
    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
    }
});

// Click Event to Display Tooltip with Planet Info and Freeze Animation
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(planetMeshes.map(p => p.mesh));
    if (intersects.length > 0) {
        const clickedPlanet = intersects[0].object;
        const planetData = planetMeshes.find(p => p.mesh === clickedPlanet);

        // Display tooltip with planet information and image on click
        tooltip.style.display = 'block';
        tooltip.innerHTML = `<strong>${planetData.name}</strong><br>${planetData.info}<br><img src="${planetData.image}" alt="${planetData.name} image">`;

        zoomToPlanet(clickedPlanet);
        isFrozen = true;  // Freeze the scene
    } else {
        tooltip.style.display = 'none';
        resetZoom();
        isFrozen = false;  // Unfreeze the scene
    }
});

// Animation Loop
function animate() {
    if (!isFrozen) {
        planetMeshes.forEach((planet) => {
            planet.angle += planet.speed;
            planet.mesh.position.x = planet.distance * Math.cos(planet.angle);
            planet.mesh.position.z = planet.distance * Math.sin(planet.angle);
        });
    }

    controls.update();
    TWEEN.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// Resize Handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
