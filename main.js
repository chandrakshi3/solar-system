// Planet Textures
const textureLoader = new THREE.TextureLoader();
const textures = {
  Mercury: textureLoader.load('https://threejs.org/examples/textures/planets/mercury.jpg'),
  Venus: textureLoader.load('https://threejs.org/examples/textures/planets/venus.jpg'),
  Earth: textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'),
  Mars: textureLoader.load('https://threejs.org/examples/textures/planets/mars_1k_color.jpg'),
  Jupiter: textureLoader.load('https://threejs.org/examples/textures/planets/jupiter.jpg'),
  Saturn: textureLoader.load('https://threejs.org/examples/textures/planets/saturn.jpg'),
  Uranus: textureLoader.load('https://threejs.org/examples/textures/planets/uranus.jpg'),
  Neptune: textureLoader.load('https://threejs.org/examples/textures/planets/neptune.jpg')
};

// Setup Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111133); // light blue-black


const camera = new THREE.PerspectiveCamera(60, window.innerWidth / (window.innerHeight * 0.8), 0.1, 1000);
// higher and further
camera.lookAt(0, 0, 0);
camera.position.set(0, 100, window.innerWidth < 768 ? 220 : 300);



const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
document.getElementById("scene-container").appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0x333333));

const sunLight = new THREE.PointLight(0xffffff, 2, 1000);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1.5);
topLight.position.set(50, 100, 100);
scene.add(topLight);

// Glowing Sun
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(15, 64, 64), // was 10
  new THREE.MeshBasicMaterial({ color: 0xffff00 })
);
scene.add(sun);


// Planet Data
const planetData = [
  { name: "Mercury", color: 0xaaaaaa, size: 3, distance: 40, speed: 0.03 },
  { name: "Venus", color: 0xffcc99, size: 4.5, distance: 55, speed: 0.025 },
  { name: "Earth", color: 0x3399ff, size: 5, distance: 70, speed: 0.02 },
  { name: "Mars", color: 0xff3300, size: 4.2, distance: 85, speed: 0.017 },
  { name: "Jupiter", color: 0xff9966, size: 9, distance: 110, speed: 0.015 },
  { name: "Saturn", color: 0xffff99, size: 8, distance: 135, speed: 0.012 },
  { name: "Uranus", color: 0x66ffff, size: 6.5, distance: 160, speed: 0.01 },
  { name: "Neptune", color: 0x3333ff, size: 6, distance: 180, speed: 0.008 }
];



const planets = [];

function createLabel(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#00ffff';
  ctx.font = 'bold 24px Arial';
  ctx.fillText(text, 10, 40);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(16, 8, 1);
  return sprite;
}


planetData.forEach(data => {
  const geometry = new THREE.SphereGeometry(data.size * 2, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    color: data.color, // use direct color instead of textures
    roughness: 0.5,
    metalness: 0.2
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = { ...data, angle: Math.random() * Math.PI * 2 };
  planets.push(mesh);
  scene.add(mesh);

  // Create and attach a label
  const label = createLabel(data.name);
label.position.set(0, data.size * 1.5, 0); // Adjust for enlarged planet
mesh.add(label);


  // Orbit ring
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  });
  const ringGeometry = new THREE.RingGeometry(data.distance - 0.5, data.distance + 0.5, 64);
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  // Sliders
  const labelEl = document.createElement("label");
  labelEl.innerHTML = `${data.name}<input type="range" min="0.001" max="0.05" step="0.001" value="${data.speed}" data-name="${data.name}">`;
  document.getElementById("controls").appendChild(labelEl);
});


// Animation Toggle
let animateOn = true;
document.getElementById("toggleAnimation").addEventListener("click", () => {
  animateOn = !animateOn;
  document.getElementById("toggleAnimation").textContent = animateOn ? "Pause" : "Resume";
});

// Animate
function animate() {
  requestAnimationFrame(animate);

  if (animateOn) {
    planets.forEach(planet => {
      const { distance, speed } = planet.userData;
      scene.rotation.y += 0.0008;

      planet.userData.angle += speed;
      planet.position.x = Math.cos(planet.userData.angle) * distance;
      planet.position.z = Math.sin(planet.userData.angle) * distance;
    });
  }

  renderer.render(scene, camera);
}
animate();

// Slider Events
document.querySelectorAll('#controls input').forEach(input => {
  input.addEventListener('input', e => {
    const planet = planets.find(p => p.userData.name === e.target.dataset.name);
    if (planet) planet.userData.speed = parseFloat(e.target.value);
  });
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / (window.innerHeight * 0.8);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
});
