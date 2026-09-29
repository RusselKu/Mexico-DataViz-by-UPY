/**
 * Módulo de Cartografía Interactiva GIS (Vista 1 - INEGI DENUE)
 */
window.DataStoryApp = window.DataStoryApp || {};

window.DataStoryApp.gisMap = (function() {
  function renderCustomGisMap() {
    const container = document.getElementById('interactiveCustomSurface');
    if (!container) return;

    container.innerHTML = `
      <div class="gis-map-canvas">
        <svg class="map-svg-layer" viewBox="0 0 800 440" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="peninsulaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0e1b33" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#050914" stop-opacity="0.95"/>
            </linearGradient>
            <filter id="glowFilter">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <!-- Silueta de la Península -->
          <path d="M 120 380 Q 220 310 280 260 Q 320 210 380 140 Q 420 90 540 80 Q 660 70 720 160 Q 740 250 680 340 Q 560 380 440 370 Z" 
                fill="url(#peninsulaGrad)" stroke="rgba(0, 242, 254, 0.35)" stroke-width="2"/>
          
          <!-- Anillos de Cobertura de Mérida -->
          <circle id="ringOuter" cx="340" cy="180" r="110" fill="rgba(0, 242, 254, 0.04)" stroke="rgba(0, 242, 254, 0.2)" stroke-dasharray="4,4" />
          <circle id="ringInner" cx="340" cy="180" r="60" fill="rgba(0, 242, 254, 0.08)" stroke="rgba(0, 242, 254, 0.4)" />
          
          <!-- Nodos Urbanos y Clusters -->
          <!-- Mérida Principal -->
          <g id="nodeMerida" class="gis-map-node" transform="translate(340, 180)" cursor="pointer">
            <circle r="15" fill="#00f2fe" filter="url(#glowFilter)" opacity="0.9"/>
            <circle r="6" fill="#050811"/>
            <text x="20" y="5" fill="#fff" font-family="Outfit" font-size="13" font-weight="700">Mérida (2,150 un.)</text>
          </g>

          <!-- Valladolid -->
          <g id="nodeValladolid" class="gis-map-node" transform="translate(560, 200)" cursor="pointer">
            <circle r="10" fill="#ff7e5f" filter="url(#glowFilter)"/>
            <text x="14" y="4" fill="#cbd5e1" font-family="Outfit" font-size="11" font-weight="600">Valladolid (185 un.)</text>
          </g>

          <!-- Tizimín -->
          <g id="nodeTizimin" class="gis-map-node" transform="translate(540, 120)" cursor="pointer">
            <circle r="9" fill="#10b981"/>
            <text x="12" y="4" fill="#cbd5e1" font-family="Outfit" font-size="11" font-weight="600">Tizimín (140 un.)</text>
          </g>

          <!-- Progreso -->
          <g id="nodeProgreso" class="gis-map-node" transform="translate(330, 130)" cursor="pointer">
            <circle r="8" fill="#4facfe"/>
            <text x="12" y="4" fill="#cbd5e1" font-family="Outfit" font-size="11" font-weight="600">Progreso (110 un.)</text>
          </g>

          <!-- Ticul -->
          <g id="nodeTicul" class="gis-map-node" transform="translate(330, 250)" cursor="pointer">
            <circle r="8" fill="#a855f7"/>
            <text x="12" y="4" fill="#cbd5e1" font-family="Outfit" font-size="11" font-weight="600">Ticul (95 un.)</text>
          </g>

          <!-- Kanasín -->
          <g id="nodeKanasin" class="gis-map-node" transform="translate(370, 195)" cursor="pointer">
            <circle r="7" fill="#feb47b"/>
            <text x="10" y="4" fill="#94a3b8" font-family="Outfit" font-size="10">Kanasín (320 un.)</text>
          </g>

          <!-- Líneas de Interconexión Logística -->
          <line x1="340" y1="180" x2="560" y2="200" stroke="rgba(0, 242, 254, 0.45)" stroke-width="1.5" stroke-dasharray="3,3"/>
          <line x1="340" y1="180" x2="330" y2="130" stroke="rgba(0, 242, 254, 0.45)" stroke-width="1.5" stroke-dasharray="3,3"/>
          <line x1="340" y1="180" x2="330" y2="250" stroke="rgba(0, 242, 254, 0.45)" stroke-width="1.5" stroke-dasharray="3,3"/>
          <line x1="560" y1="200" x2="540" y2="120" stroke="rgba(0, 242, 254, 0.35)" stroke-width="1.5" stroke-dasharray="3,3"/>
        </svg>

        <!-- Dynamic Floating Inspector -->
        <div class="canvas-inspector-card" id="mapInspector">
          <div class="inspector-header" id="inspectorTitle">
            <i class="fa-solid fa-location-dot"></i> Zona Metropolitana de Mérida
          </div>
          <div class="inspector-body" id="inspectorContent">
            <strong>2,150 Unidades DENUE</strong> • Cobertura del 98% con hospitales de tercer nivel y red barrial.
          </div>
        </div>
      </div>
    `;

    // Interactive node clicks & hover inspections
    document.getElementById('nodeMerida')?.addEventListener('click', () => {
      setInspectorInfo('Zona Metropolitana de Mérida', '2,150 Unidades Médicas • Cobertura 98% de especialidad en el estado.');
    });
    document.getElementById('nodeValladolid')?.addEventListener('click', () => {
      setInspectorInfo('Valladolid (Oriente)', '185 Unidades DENUE • Hub regional estratégico que atiende al oriente del estado y cruce con Quintana Roo.');
    });
    document.getElementById('nodeTizimin')?.addEventListener('click', () => {
      setInspectorInfo('Tizimín (Costa & Ganadera)', '140 Unidades DENUE • Enlace clave para la cuenca ganadera y poblaciones costeras.');
    });
    document.getElementById('nodeProgreso')?.addEventListener('click', () => {
      setInspectorInfo('Progreso (Puerto)', '110 Unidades DENUE • Módulos de atención portuaria y enlace costero a 25 min de Mérida.');
    });
    document.getElementById('nodeTicul')?.addEventListener('click', () => {
      setInspectorInfo('Ticul (Región Sur)', '95 Unidades DENUE • Centro de referencia médica de la Jurisdicción Sanitaria 3.');
    });
    document.getElementById('nodeKanasin')?.addEventListener('click', () => {
      setInspectorInfo('Kanasín (Periferia)', '320 Consultorios DENUE • Alta concentración de atención primaria en zona conurbada.');
    });
  }

  function setInspectorInfo(title, text) {
    const titleEl = document.getElementById('inspectorTitle');
    const contentEl = document.getElementById('inspectorContent');
    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${title}`;
    if (contentEl) contentEl.innerHTML = text;

    const showToast = window.DataStoryApp.storytelling?.showToast;
    if (showToast) showToast(`Seleccionado: ${title}`);
  }

  function highlightNode(nodeKey) {
    if (nodeKey === 'merida') {
      setInspectorInfo('Zona Metropolitana de Mérida', 'Concentra 2,150 unidades médicas y el 68% de las camas de hospitalización de alta especialidad.');
    } else if (nodeKey === 'interior') {
      setInspectorInfo('Hubs Regionales del Interior', 'Valladolid y Tizimín descentralizan la atención médica para más de 350,000 habitantes en el oriente.');
    } else {
      setInspectorInfo('Red Territorial Completa', '3,842 unidades DENUE integradas entre los 106 municipios de Yucatán.');
    }
  }

  return {
    renderCustomGisMap,
    setInspectorInfo,
    highlightNode
  };
})();
