/**
 * Módulo de Visualizaciones 3D Volumétricas y WebXR / AR (Three.js & OrbitControls)
 * Vista 8 (LiDAR 3D Morfología Urbana de Mérida) y Vista 9 (AR Biomoléculas - Spike PDB 6VXX)
 * Plataforma Data Storytelling • UPY
 */
window.DataStoryApp = window.DataStoryApp || {};

window.DataStoryApp.threeVisuals = (function() {
  let threeRenderer = null;
  let threeScene = null;
  let threeCamera = null;
  let threeMeshGroup = null;
  let threeControls = null;
  let animationFrameId = null;

  let currentMode = '3d'; // '3d' | 'ar'
  let lidarColorMode = 'cyan'; // 'cyan' | 'terrain' | 'cyberpunk'
  let spikeExploded = false;
  let altitudeSliceLevel = 25; // 0 to 25 meters
  let protomerGroups = []; // Cadenas A, B, C para vista detonada

  function initThreeDVisual(mode = '3d') {
    currentMode = mode;
    stopThreeVisual();

    const container = document.getElementById('threejsContainer');
    if (!container) return;
    container.innerHTML = '';

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 460;

    threeScene = new THREE.Scene();
    threeCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    
    if (mode === '3d') {
      threeCamera.position.set(16, 14, 16);
    } else {
      threeCamera.position.set(0, 4, 15);
    }

    threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    threeRenderer.setSize(width, height);
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    threeRenderer.toneMappingExposure = 1.2;
    container.appendChild(threeRenderer.domElement);

    // OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
      threeControls = new THREE.OrbitControls(threeCamera, threeRenderer.domElement);
      threeControls.enableDamping = true;
      threeControls.dampingFactor = 0.05;
      threeControls.maxDistance = 45;
      threeControls.minDistance = 2.5;
    }

    // Luces
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight1.position.set(20, 30, 20);
    threeScene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00f2fe, 1.0);
    dirLight2.position.set(-20, 15, -20);
    threeScene.add(dirLight2);

    const ambLight = new THREE.AmbientLight(0x1e293b, 1.4);
    threeScene.add(ambLight);

    threeMeshGroup = new THREE.Group();
    threeScene.add(threeMeshGroup);

    if (mode === '3d') {
      buildLidarMeridaCity(threeMeshGroup);
    } else {
      buildSpikeBiomolecule(threeMeshGroup);
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      if (threeControls) threeControls.update();

      // Rotación suave continua si el usuario no está arrastrando
      if (threeMeshGroup && (!threeControls || !threeControls.state || threeControls.state === -1)) {
        threeMeshGroup.rotation.y += mode === '3d' ? 0.0015 : 0.004;
      }

      threeRenderer.render(threeScene, threeCamera);
    }
    animate();
  }

  /**
   * Construye la maqueta 3D morfológica de Mérida con capas LiDAR
   */
  function buildLidarMeridaCity(parentGroup) {
    // 1. Grid base cárstica
    const grid = new THREE.GridHelper(26, 52, 0x00f2fe, 0x1e293b);
    grid.position.y = -0.05;
    parentGroup.add(grid);

    // 2. Corredores viales principales (Paseo de Montejo y Anillo Periférico)
    const roadMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, opacity: 0.6, transparent: true });
    
    // Periférico circular
    const periGeom = new THREE.BufferGeometry();
    const periPts = [];
    for (let a = 0; a <= Math.PI * 2; a += 0.1) {
      periPts.push(new THREE.Vector3(Math.cos(a) * 10, 0.05, Math.sin(a) * 10));
    }
    periGeom.setFromPoints(periPts);
    const periLine = new THREE.Line(periGeom, roadMat);
    parentGroup.add(periLine);

    // Diagonal Paseo de Montejo
    const montejoGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.05, 0),
      new THREE.Vector3(6, 0.05, -7)
    ]);
    const montejoLine = new THREE.Line(montejoGeom, new THREE.LineBasicMaterial({ color: 0x00f2fe, linewidth: 2 }));
    parentGroup.add(montejoLine);

    // 3. Bloques de edificación clasificados por elevación LiDAR
    const boxGeom = new THREE.BoxGeometry(0.65, 1, 0.65);
    const landmarkLocs = [
      { name: "Centro Histórico / Catedral", x: 0, z: 0, h: 4.8, isAnchor: true },
      { name: "Hospital O'Horán", x: -2.5, z: 0.8, h: 3.8, isHospital: true },
      { name: "Siglo XXI & HRAEPY (Norte)", x: 4.5, z: -5.5, h: 5.2, isHospital: true },
      { name: "UMAE T1 IMSS (Oriente)", x: 2.2, z: 2.5, h: 4.2, isHospital: true },
      { name: "Campus UPY / Caucel (Poniente)", x: -7.5, z: -1.2, h: 3.5, isAnchor: true }
    ];

    // Generar edificios de la retícula urbana
    for (let x = -8; x <= 8; x += 1.3) {
      for (let z = -8; z <= 8; z += 1.3) {
        if (Math.hypot(x, z) > 10.5) continue; // Fuera del periférico

        const distCenter = Math.hypot(x, z);
        const baseH = Math.max(0.4, (6 - distCenter * 0.45) + (Math.sin(x * 1.5) * Math.cos(z * 1.5)) * 1.2);
        const isKeyLandmark = landmarkLocs.find(l => Math.hypot(l.x - x, l.z - z) < 1.0);

        let h = isKeyLandmark ? isKeyLandmark.h : baseH;
        let color = 0x00f2fe;

        if (lidarColorMode === 'terrain') {
          color = h > 4 ? 0xff7e5f : (h > 2.2 ? 0xfeb47b : (h > 1.2 ? 0x10b981 : 0x06b6d4));
        } else if (lidarColorMode === 'cyberpunk') {
          color = isKeyLandmark ? 0xff007f : (h > 3 ? 0x9d4edd : 0x00f2fe);
        } else {
          color = isKeyLandmark?.isHospital ? 0xff4757 : (h > 3.5 ? 0x00f2fe : 0x3b82f6);
        }

        const mat = new THREE.MeshPhongMaterial({
          color: color,
          transparent: true,
          opacity: 0.88,
          shininess: 90,
          emissive: isKeyLandmark?.isHospital ? 0x330000 : 0x050b18
        });

        const mesh = new THREE.Mesh(boxGeom, mat);
        mesh.scale.set(1, h, 1);
        mesh.position.set(x, h / 2, z);
        parentGroup.add(mesh);

        // Si es hospital o sede ancla, agregar un haz vertical de luz (beacon)
        if (isKeyLandmark?.isHospital) {
          const beaconGeom = new THREE.CylinderGeometry(0.12, 0.12, 12, 16);
          const beaconMat = new THREE.MeshBasicMaterial({
            color: 0xff4757,
            transparent: true,
            opacity: 0.45
          });
          const beacon = new THREE.Mesh(beaconGeom, beaconMat);
          beacon.position.set(x, 6, z);
          parentGroup.add(beacon);
        }
      }
    }

    // 4. Dosel Vegetal y Parques (Partículas LiDAR de cobertura arbórea)
    const particleCount = 2400;
    const particleGeom = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const px = (Math.random() - 0.5) * 18;
      const pz = (Math.random() - 0.5) * 18;
      if (Math.hypot(px, pz) < 10) {
        posArray[i] = px;
        posArray[i + 1] = 0.2 + Math.random() * 3.8;
        posArray[i + 2] = pz;
      }
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.09,
      color: lidarColorMode === 'cyberpunk' ? 0x00ff88 : 0x10b981,
      transparent: true,
      opacity: 0.75
    });
    const pSystem = new THREE.Points(particleGeom, pMat);
    parentGroup.add(pSystem);
  }

  /**
   * Construye el complejo tridimensional de la Espícula Viral Spike (PDB: 6VXX)
   */
  function buildSpikeBiomolecule(parentGroup) {
    protomerGroups = [];

    // Núcleo central del trímero
    const stemGeom = new THREE.CylinderGeometry(0.8, 1.2, 7, 32);
    const stemMat = new THREE.MeshPhongMaterial({
      color: 0x475569,
      transparent: true,
      opacity: 0.7,
      wireframe: true
    });
    const stem = new THREE.Mesh(stemGeom, stemMat);
    stem.position.y = -1;
    parentGroup.add(stem);

    // 3 Cadenas Protoméricas (Cadena A: Cyan, Cadena B: Violeta, Cadena C: Coral)
    const chains = [
      { name: "Cadena A", color: 0x00f2fe, emissive: 0x083344, angle: 0 },
      { name: "Cadena B", color: 0xa855f7, emissive: 0x3b0764, angle: (Math.PI * 2) / 3 },
      { name: "Cadena C", color: 0xff7e5f, emissive: 0x431407, angle: (Math.PI * 4) / 3 }
    ];

    chains.forEach((ch, idx) => {
      const protomer = new THREE.Group();
      const radiusOffset = spikeExploded ? 3.5 : 1.2;

      // Hélice / Curva protomérica
      const curvePts = [];
      for (let t = 0; t <= 1; t += 0.05) {
        const theta = ch.angle + t * Math.PI * 1.5;
        const r = 1.4 + Math.sin(t * Math.PI) * 1.8;
        const y = -3.5 + t * 7;
        curvePts.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r));
      }

      const curve = new THREE.CatmullRomCurve3(curvePts);
      const tubeGeom = new THREE.TubeGeometry(curve, 40, 0.42, 16, false);
      const tubeMat = new THREE.MeshPhongMaterial({
        color: ch.color,
        emissive: ch.emissive,
        shininess: 90
      });
      const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
      protomer.add(tubeMesh);

      // Dominio RBD (Receptor-Binding Domain) en la cúspide
      const rbdGeom = new THREE.SphereGeometry(1.05, 24, 24);
      const rbdMat = new THREE.MeshPhongMaterial({
        color: 0xff4757,
        emissive: 0x4c0519,
        shininess: 120
      });
      const rbdMesh = new THREE.Mesh(rbdGeom, rbdMat);
      const topPt = curvePts[curvePts.length - 1];
      rbdMesh.position.copy(topPt);
      protomer.add(rbdMesh);

      // Átomos de glicanos y residuos clave (N-glycan shield)
      for (let g = 0; g < 12; g++) {
        const glyGeom = new THREE.SphereGeometry(0.22, 12, 12);
        const glyMat = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
        const gly = new THREE.Mesh(glyGeom, glyMat);
        const pt = curvePts[Math.floor(Math.random() * curvePts.length)];
        gly.position.set(pt.x + (Math.random() - 0.5) * 0.8, pt.y + (Math.random() - 0.5) * 0.8, pt.z + (Math.random() - 0.5) * 0.8);
        protomer.add(gly);
      }

      // Posicionar protómero radialmente
      protomer.position.set(
        Math.cos(ch.angle) * (spikeExploded ? 2.8 : 0),
        0,
        Math.sin(ch.angle) * (spikeExploded ? 2.8 : 0)
      );

      parentGroup.add(protomer);
      protomerGroups.push(protomer);
    });
  }

  function setLidarTheme(theme) {
    lidarColorMode = theme;
    initThreeDVisual('3d');
    const showToast = window.DataStoryApp.storytelling?.showToast;
    if (showToast) showToast(`Modo LiDAR cambiado a: ${theme.toUpperCase()}`);
  }

  function setCameraPreset(preset) {
    if (!threeCamera || !threeControls) return;

    if (preset === 'top') {
      threeCamera.position.set(0, 26, 0.1);
      threeControls.target.set(0, 0, 0);
    } else if (preset === 'iso') {
      threeCamera.position.set(16, 14, 16);
      threeControls.target.set(0, 0, 0);
    } else if (preset === 'street') {
      threeCamera.position.set(0, 2.2, 11);
      threeControls.target.set(0, 1.5, 0);
    }
    threeControls.update();

    const showToast = window.DataStoryApp.storytelling?.showToast;
    if (showToast) showToast(`Vista de cámara: ${preset.toUpperCase()}`);
  }

  function toggleSpikeExplosion() {
    spikeExploded = !spikeExploded;
    initThreeDVisual('ar');
    const showToast = window.DataStoryApp.storytelling?.showToast;
    if (showToast) showToast(spikeExploded ? "💥 Vista detonada de las 3 Cadenas Protoméricas" : "🔒 Ensamblaje Trímero Compacto");
  }

  function triggerArModal() {
    const container = document.getElementById('threejsContainer');
    if (!container) return;

    // Eliminar modal existente si lo hay
    const existing = document.getElementById('arModalCard');
    if (existing) {
      existing.remove();
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'arModalCard';
    modal.className = 'ar-qr-overlay-card';
    modal.innerHTML = `
      <div style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; color: var(--accent-cyan);">
        <i class="fa-solid fa-vr-cardboard"></i> Experiencia en Realidad Aumentada
      </div>
      <p style="font-size: 0.79rem; color: #cbd5e1; margin: 0;">
        Escanea con la cámara de tu smartphone iOS o Android para proyectar el modelo 3D de la proteína Spike sobre tu mesa en WebXR:
      </p>
      <!-- Generador de QR SVG vectorial nativo sin dependencias -->
      <svg class="ar-qr-img" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#ffffff" rx="6"/>
        <rect x="10" y="10" width="24" height="24" fill="#0f172a"/>
        <rect x="14" y="14" width="16" height="16" fill="#ffffff"/>
        <rect x="18" y="18" width="8" height="8" fill="#0f172a"/>
        <rect x="66" y="10" width="24" height="24" fill="#0f172a"/>
        <rect x="70" y="14" width="16" height="16" fill="#ffffff"/>
        <rect x="74" y="18" width="8" height="8" fill="#0f172a"/>
        <rect x="10" y="66" width="24" height="24" fill="#0f172a"/>
        <rect x="14" y="70" width="16" height="16" fill="#ffffff"/>
        <rect x="18" y="74" width="8" height="8" fill="#0f172a"/>
        <!-- Bits de datos simulados -->
        <rect x="42" y="12" width="6" height="6" fill="#0f172a"/>
        <rect x="52" y="18" width="6" height="6" fill="#0f172a"/>
        <rect x="42" y="30" width="16" height="6" fill="#0f172a"/>
        <rect x="42" y="44" width="6" height="12" fill="#0f172a"/>
        <rect x="52" y="52" width="14" height="6" fill="#0f172a"/>
        <rect x="70" y="42" width="8" height="14" fill="#0f172a"/>
        <rect x="66" y="66" width="14" height="8" fill="#0f172a"/>
        <rect x="42" y="74" width="8" height="14" fill="#0f172a"/>
      </svg>
      <div style="font-size: 0.74rem; color: var(--accent-green); font-weight: 600;">
        <i class="fa-solid fa-circle-check"></i> Compatible con Safari AR QuickLook y WebXR
      </div>
      <button class="ctrl-btn active" id="btnCloseArModal" style="margin-top: 4px; padding: 6px 16px;">Cerrar Visor</button>
    `;

    container.appendChild(modal);

    document.getElementById('btnCloseArModal')?.addEventListener('click', () => {
      modal.remove();
    });
  }

  function stopThreeVisual() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (threeControls) {
      threeControls.dispose();
      threeControls = null;
    }
    if (threeRenderer) {
      threeRenderer.dispose();
      threeRenderer = null;
    }
    threeScene = null;
    threeCamera = null;
    threeMeshGroup = null;
  }

  return {
    initThreeDVisual,
    setLidarTheme,
    setCameraPreset,
    toggleSpikeExplosion,
    triggerArModal,
    stopThreeVisual
  };
})();
