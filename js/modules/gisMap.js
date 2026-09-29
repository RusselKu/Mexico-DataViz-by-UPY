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
              <stop offset="0%" stop-color="#0f1f38" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#070c18" stop-opacity="0.95"/>
            </linearGradient>
            <filter id="glowFilter">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <!-- Silueta de la Península -->
          <path d="M 120 380 Q 220 310 280 260 Q 320 210 380 140 Q 420 90 540 80 Q 660 70 720 160 Q 740 250 680 340 Q 560 380 440 370 Z" 
                fill="url(#peninsulaGrad)" stroke="rgba(0, 242, 254, 0.3)" stroke-width="2"/>
          
          <!-- Anillos de Cobertura de Mérida -->
          <circle cx="340" cy="180" r="110" fill="rgba(0, 242, 254, 0.04)" stroke="rgba(0, 242, 254, 0.2)" stroke-dasharray="4,4" />
          <circle cx="340" cy="180" r="60" fill="rgba(0, 242, 254, 0.08)" stroke="rgba(0, 242, 254, 0.4)" />
          
          <!-- Nodos Urbanos y Clusters -->
          <!-- Mérida Principal -->
          <g id="nodeMerida" transform="translate(340, 180)" cursor="pointer">
            <circle r="14" fill="#00f2fe" filter="url(#glowFilter)" opacity="0.9"/>
            <circle r="6" fill="#050811"/>
            <text x="18" y="5" fill="#fff" font-family="Outfit" font-size="13" font-weight="700">Mérida (2,150 un.)</text>
          </g>

          <!-- Valladolid -->
          <g id="nodeValladolid" transform="translate(560, 200)" cursor="pointer">
            <circle r="9" fill="#ff7e5f" filter="url(#glowFilter)"/>
            <text x="14" y="4" fill="#cbd5e1" font-family="Outfit" font-size="11" font-weight="600">Valladolid</text>
          </g>

          <!-- Tizimín -->
          <g id="nodeTizimin" transform="translate(540, 120)" cursor="pointer">
            <circle r="8" fill="#10b981"/>
            <text x="12" y="4" fill="#cbd5e1" font-family="Outfit" font-size="11" font-weight="600">Tizimín</text>
          </g>

          <!-- Progreso -->
          <g id="nodeProgreso" transform="translate(330, 130)" cursor="pointer">
            <circle r="7" fill="#4facfe"/>
            <text x="12" y="4" fill="#cbd5e1" font-family="Outfit" font-size="11" font-weight="600">Progreso</text>
          </g>

          <!-- Ticul -->
          <g id="nodeTicul" transform="translate(330, 250)" cursor="pointer">
            <circle r="7" fill="#a855f7"/>
            <text x="12" y="4" fill="#cbd5e1" font-family="Outfit" font-size="11" font-weight="600">Ticul</text>
          </g>

          <!-- Kanasín -->
          <g id="nodeKanasin" transform="translate(370, 195)" cursor="pointer">
            <circle r="6" fill="#feb47b"/>
            <text x="10" y="4" fill="#94a3b8" font-family="Outfit" font-size="10">Kanasín</text>
          </g>

          <!-- Líneas de Interconexión Logística -->
          <line x1="340" y1="180" x2="560" y2="200" stroke="rgba(0, 242, 254, 0.4)" stroke-width="1.5" stroke-dasharray="3,3"/>
          <line x1="340" y1="180" x2="330" y2="130" stroke="rgba(0, 242, 254, 0.4)" stroke-width="1.5" stroke-dasharray="3,3"/>
          <line x1="340" y1="180" x2="330" y2="250" stroke="rgba(0, 242, 254, 0.4)" stroke-width="1.5" stroke-dasharray="3,3"/>
          <line x1="560" y1="200" x2="540" y2="120" stroke="rgba(0, 242, 254, 0.3)" stroke-width="1.5" stroke-dasharray="3,3"/>
        </svg>

        <div style="position: absolute; bottom: 15px; left: 15px; background: rgba(15, 23, 42, 0.85); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-card); font-size: 0.75rem; color: #cbd5e1;">
          <i class="fa-solid fa-hand-pointer" style="color: var(--accent-cyan);"></i> Haz clic en cualquier nodo urbano para ver datos de cobertura
        </div>
      </div>
    `;

    const showToast = window.DataStoryApp.storytelling?.showToast || console.log;

    document.getElementById('nodeMerida')?.addEventListener('click', () => {
      showToast('Zona Metropolitana de Mérida: 2,150 Consultorios y Clínicas • Cobertura 98%');
    });
    document.getElementById('nodeValladolid')?.addEventListener('click', () => {
      showToast('Valladolid: 185 Unidades DENUE • Hub Sanitario Oriente');
    });
    document.getElementById('nodeTizimin')?.addEventListener('click', () => {
      showToast('Tizimín: 140 Unidades DENUE • Cobertura Ganadera/Costa');
    });
    document.getElementById('nodeProgreso')?.addEventListener('click', () => {
      showToast('Progreso: 110 Unidades Médicas • Puerto de Entrada');
    });
    document.getElementById('nodeTicul')?.addEventListener('click', () => {
      showToast('Ticul: 95 Unidades Médicas • Nodo Sur');
    });
    document.getElementById('nodeKanasin')?.addEventListener('click', () => {
      showToast('Kanasín: 320 Consultorios DENUE');
    });
  }

  return {
    renderCustomGisMap
  };
})();
