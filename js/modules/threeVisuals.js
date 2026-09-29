/**
 * Módulo de Visualizaciones 3D y WebXR / AR (Three.js & OrbitControls)
 * Vistas 8 (LiDAR 3D) y 9 (Realidad Aumentada - Molecular Spike PDB: 6VXX)
 */
window.DataStoryApp = window.DataStoryApp || {};

window.DataStoryApp.threeVisuals = (function() {
  let threeRenderer = null;
  let threeScene = null;
  let threeCamera = null;
  let threeMesh = null;
  let threeControls = null;
  let animationFrameId = null;

  let lidarColorMode = 'cyan';
  let spikeExploded = false;

  function initThreeDVisual(mode) {
    stopThreeVisual();

    const container = document.getElementById('threejsContainer');
    if (!container) return;
    container.innerHTML = '';

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 460;

    threeScene = new THREE.Scene();
    threeCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    threeCamera.position.set(0, 8, 16);

    threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    threeRenderer.setSize(width, height);
    threeRenderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(threeRenderer.domElement);

    // OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
      threeControls = new THREE.OrbitControls(threeCamera, threeRenderer.domElement);
      threeControls.enableDamping = true;
      threeControls.dampingFactor = 0.05;
      threeControls.maxDistance = 35;
      threeControls.minDistance = 3;
    }

    // Iluminación
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(15, 25, 15);
    threeScene.add(dirLight);

    const ambLight = new THREE.AmbientLight(0x384252, 1.2);
    threeScene.add(ambLight);

    const group = new THREE.Group();

    if (mode === '3d') {
      // Terreno y Edificios LiDAR Mérida
      const grid = new THREE.GridHelper(20, 40, 0x00f2fe, 0x1e293b);
      grid.position.y = -0.1;
      threeScene.add(grid);

      const cubeGeom = new THREE.BoxGeometry(0.75, 1, 0.75);
      for (let i = 0; i < 65; i++) {
        const h = 0.6 + Math.random() * 4.2;
        const isKeyCenter = Math.random() > 0.88;
        
        let color = 0x00f2fe;
        if (lidarColorMode === 'terrain') {
          color = h > 3 ? 0xff7e5f : (h > 1.5 ? 0xfeb47b : 0x10b981);
        } else {
          color = isKeyCenter ? 0xff7e5f : (Math.random() > 0.5 ? 0x00f2fe : 0x4facfe);
        }

        const mat = new THREE.MeshPhongMaterial({
          color: color,
          transparent: true,
          opacity: 0.85,
          shininess: 90
        });

        const mesh = new THREE.Mesh(cubeGeom, mat);
        mesh.scale.set(1, h, 1);
        mesh.position.set(
          (Math.random() - 0.5) * 14,
          h / 2,
          (Math.random() - 0.5) * 14
        );
        group.add(mesh);
      }

      // Partículas LiDAR de dosel vegetal
      const particleGeom = new THREE.BufferGeometry();
      const particleCount = 1200;
      const posArray = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 16;
        posArray[i + 1] = Math.random() * 4.5;
        posArray[i + 2] = (Math.random() - 0.5) * 16;
      }
      particleGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const pMat = new THREE.PointsMaterial({ size: 0.08, color: 0x10b981, transparent: true, opacity: 0.7 });
      const pSystem = new THREE.Points(particleGeom, pMat);
      group.add(pSystem);

    } else {
      // Complejo Molecular AR (Spike PDB: 6VXX)
      const icoGeom = new THREE.IcosahedronGeometry(2.8, 2);
      const icoMat = new THREE.MeshPhongMaterial({
        color: 0xa855f7,
        wireframe: true,
        emissive: 0x3b0764,
        shininess: 100
      });
      const spikeCore = new THREE.Mesh(icoGeom, icoMat);
      group.add(spikeCore);

      // Nodos atómicos (RBD y dominios)
      for (let i = 0; i < 36; i++) {
        const sGeom = new THREE.SphereGeometry(0.24, 16, 16);
        const isRbd = i < 8;
        const sMat = new THREE.MeshPhongMaterial({
          color: isRbd ? 0xff7e5f : (i % 2 === 0 ? 0x00f2fe : 0xec4899),
          emissive: isRbd ? 0x7c2d12 : 0x000000
        });
        const sphere = new THREE.Mesh(sGeom, sMat);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = spikeExploded ? 5.2 : 3.6;
        sphere.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
        group.add(sphere);
      }
    }

    threeScene.add(group);
    threeMesh = group;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      if (threeControls) threeControls.update();
      if (threeMesh && !threeControls?.state) {
        threeMesh.rotation.y += 0.004;
      }
      threeRenderer.render(threeScene, threeCamera);
    }
    animate();
  }

  function setLidarTheme(theme) {
    lidarColorMode = theme;
    initThreeDVisual('3d');
    const showToast = window.DataStoryApp.storytelling?.showToast || console.log;
    showToast(`Paleta LiDAR cambiada a: ${theme}`);
  }

  function toggleSpikeExplosion() {
    spikeExploded = !spikeExploded;
    initThreeDVisual('ar');
    const showToast = window.DataStoryApp.storytelling?.showToast || console.log;
    showToast(spikeExploded ? "Vista detonada de dominios atómicos" : "Ensamblaje cuaternario compacto");
  }

  function resetThreeCamera() {
    if (threeCamera && threeControls) {
      threeCamera.position.set(0, 8, 16);
      threeControls.target.set(0, 0, 0);
      const showToast = window.DataStoryApp.storytelling?.showToast || console.log;
      showToast("Cámara restablecida");
    }
  }

  function stopThreeVisual() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (threeRenderer) {
      threeRenderer.dispose();
      threeRenderer = null;
    }
  }

  return {
    initThreeDVisual,
    setLidarTheme,
    toggleSpikeExplosion,
    resetThreeCamera,
    stopThreeVisual
  };
})();
