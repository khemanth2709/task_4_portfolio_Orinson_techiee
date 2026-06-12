// --- 1. THREE.JS 3D BACKGROUND SETUP ---
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// Renderer setup
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// --- 2. PARTICLE SYSTEM CREATION ---
const geometry = new THREE.BufferGeometry();
const particlesCount = 2000; // Optimal count for performance & visuals
const posArray = new Float32Array(particlesCount * 3);

// Generate random positions for particles in 3D space
for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 120;
}

geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Glowing Material
const material = new THREE.PointsMaterial({
    size: 0.1,
    color: 0x00ffcc, // Primary cyan color
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(geometry, material);
scene.add(particlesMesh);

// --- 3. MOUSE INTERACTION & PARALLAX ---
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// --- 4. ANIMATION LOOP ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Auto-rotation of the particle field
    particlesMesh.rotation.y = elapsedTime * 0.03;
    particlesMesh.rotation.x = elapsedTime * 0.01;

    // Smooth mouse parallax effect
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

    renderer.render(scene, camera);
}

animate();

// --- 5. RESPONSIVE RESIZING ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 6. INITIALIZE VANILLA TILT ---
// Applies the 3D hover effect to all elements with the 'card' class
VanillaTilt.init(document.querySelectorAll(".card"), {
    max: 12,
    speed: 400,
    glare: true,
    "max-glare": 0.15,
});

// --- 7. SCROLL REVEAL ANIMATIONS ---
// Uses Intersection Observer to fade in elements as they scroll into view
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once visible
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach((element) => {
    observer.observe(element);
});