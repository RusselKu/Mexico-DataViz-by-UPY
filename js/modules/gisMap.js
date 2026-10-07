/**
 * Módulo de Cartografía Interactiva GIS Multiescalar (Leaflet & Vector GIS)
 * Vistas 1 (INEGI DENUE Cobertura Estatal) y 4 (GeoPortal Mérida Isócronas y Comisarías)
 * Plataforma Data Storytelling • UPY
 */
window.DataStoryApp = window.DataStoryApp || {};

window.DataStoryApp.gisMap = (function() {
  let leafletMap = null;
  let mapLayerGroup = null;
  let isochroneRingsGroup = null;
  let currentMapMode = 1; // 1 = Territorial DENUE, 4 = Urban Isochrones

  function renderCustomGisMap(chapterNum = 1) {
    currentMapMode = chapterNum || 1;
    const container = document.getElementById('interactiveCustomSurface');
    if (!container) return;

    // Limpiar mapa anterior si existía
    destroyMap();

    container.innerHTML = `
      <div class="gis-map-canvas" id="gisMapHost" style="width: 100%; height: 100%; position: relative;">
        <!-- Leaflet Map Container -->
        <div id="leafletContainer" class="leaflet-map-host"></div>

        <!-- Floating Map Legend -->
        <div class="map-floating-legend" id="mapLegend">
          ${getLegendHTML(currentMapMode)}
        </div>

        <!-- Dynamic Floating Inspector -->
        <div class="canvas-inspector-card" id="mapInspector">
          <div class="inspector-header" id="inspectorTitle">
            <i class="fa-solid fa-location-dot"></i> ${currentMapMode === 4 ? 'Macrocentro Siglo XXI (Norte)' : 'Zona Metropolitana de Mérida'}
          </div>
          <div class="inspector-body" id="inspectorContent">
            ${currentMapMode === 4 
              ? '<strong>Capacidad: 8,000 dosis/día</strong> • Isócrona peatonal de 15 min cubre más de 45,000 habitantes en Chuburná, Cordeleros y Francisco de Montejo.' 
              : '<strong>2,150 Unidades Médicas DENUE</strong> • Cobertura de alta especialidad con 2,420 camas hospitalarias y red de consultorios barriales.'}
          </div>
          <div id="inspectorTag" class="inspector-tag-pill">
            ${currentMapMode === 4 ? 'Macro-Sede de Alta Capacidad' : 'Núcleo Metropolitano de Salud'}
          </div>
        </div>
      </div>
    `;

    // Intentar inicializar Leaflet
    if (typeof L !== 'undefined') {
      try {
        initLeafletMap(currentMapMode);
      } catch (err) {
        console.warn("Error inicializando Leaflet, usando fallback vectorial SVG:", err);
        renderFallbackVectorMap(currentMapMode);
      }
    } else {
      renderFallbackVectorMap(currentMapMode);
    }
  }

  function getLegendHTML(mode) {
    if (mode === 4) {
      return `
        <div style="font-weight: 700; color: var(--accent-cyan); margin-bottom: 2px;">Capas de Movilidad:</div>
        <div class="legend-item"><span class="legend-color-dot" style="background: #00f2fe;"></span> Macro-Sedes de Vacunación</div>
        <div class="legend-item"><span class="legend-color-dot" style="background: #10b981;"></span> Comisarías y Módulos</div>
        <div class="legend-item"><span class="legend-color-dot" style="background: rgba(0, 242, 254, 0.25); border: 1px dashed #00f2fe;"></span> Isócrona Peatonal (15 min)</div>
      `;
    }
    return `
      <div style="font-weight: 700; color: var(--accent-cyan); margin-bottom: 2px;">Capas Territoriales DENUE:</div>
      <div class="legend-item"><span class="legend-color-dot" style="background: #00f2fe;"></span> Núcleo Metropolitano Mérida</div>
      <div class="legend-item"><span class="legend-color-dot" style="background: #ff7e5f;"></span> Hubs Regionales (Oriente/Sur)</div>
      <div class="legend-item"><span class="legend-color-dot" style="background: #10b981;"></span> Consultorios & Clínicas Locales</div>
      <div class="legend-item"><span class="legend-color-dot" style="background: rgba(0, 242, 254, 0.15); border: 1px dashed #00f2fe;"></span> Radio de Influencia Médica</div>
    `;
  }

  function initLeafletMap(mode) {
    const mapDiv = document.getElementById('leafletContainer');
    if (!mapDiv) return;

    const viewsData = window.DataStoryApp.viewsData || {};
    const center = mode === 4 ? [20.985, -89.635] : [20.85, -89.40];
    const zoom = mode === 4 ? 12 : 8.5;

    leafletMap = L.map('leafletContainer', {
      zoomControl: false,
      attributionControl: false,
      minZoom: 7,
      maxZoom: 16
    }).setView(center, zoom);

    // Tiles oscuros de alta estética (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(leafletMap);

    // Reposicionar control de zoom a esquina inferior derecha
    L.control.zoom({ position: 'bottomright' }).addTo(leafletMap);

    mapLayerGroup = L.layerGroup().addTo(leafletMap);
    isochroneRingsGroup = L.layerGroup().addTo(leafletMap);

    if (mode === 4) {
      renderChapter4Layers();
    } else {
      renderChapter1Layers();
    }
  }

  function renderChapter1Layers(filterCategory = 'all') {
    if (!mapLayerGroup) return;
    mapLayerGroup.clearLayers();
    isochroneRingsGroup.clearLayers();

    const data = window.DataStoryApp.viewsData ? window.DataStoryApp.viewsData[1] : null;
    if (!data) return;

    // 1. Radios de Cobertura e Isócronas Territoriales
    const rings = [
      { center: [20.9674, -89.5926], radius: 25000, color: '#00f2fe', opacity: 0.12, label: 'Radio Primario Mérida (25 km)' },
      { center: [20.9674, -89.5926], radius: 45000, color: '#00f2fe', opacity: 0.06, label: 'Radio Metropolitano (45 km)' },
      { center: [20.6897, -88.2014], radius: 20000, color: '#ff7e5f', opacity: 0.10, label: 'Radio Hub Valladolid (20 km)' },
      { center: [21.1422, -88.1492], radius: 18000, color: '#10b981', opacity: 0.10, label: 'Radio Hub Tizimín (18 km)' }
    ];

    rings.forEach(r => {
      L.circle(r.center, {
        radius: r.radius,
        color: r.color,
        weight: 1.5,
        dashArray: '5, 5',
        fillColor: r.color,
        fillOpacity: r.opacity
      }).addTo(isochroneRingsGroup);
    });

    // 2. Líneas de Conectividad Carretera entre Hubs
    const hubs = data.territorialNodes || [];
    const merida = hubs.find(h => h.id === 'merida');
    if (merida) {
      hubs.filter(h => h.id !== 'merida').forEach(h => {
        L.polyline([[merida.lat, merida.lng], [h.lat, h.lng]], {
          color: 'rgba(0, 242, 254, 0.4)',
          weight: 1.5,
          dashArray: '4, 6'
        }).addTo(mapLayerGroup);
      });
    }

    // 3. Nodos Territoriales Principales
    hubs.forEach(node => {
      const marker = L.circleMarker([node.lat, node.lng], {
        radius: node.id === 'merida' ? 14 : (node.units > 150 ? 10 : 8),
        fillColor: node.color,
        color: '#ffffff',
        weight: 2,
        opacity: 0.95,
        fillOpacity: 0.85
      });

      marker.bindPopup(`
        <h4><i class="fa-solid fa-hospital"></i> ${node.name}</h4>
        <div><strong>Tipo:</strong> ${node.type}</div>
        <div><strong>Unidades DENUE:</strong> ${node.units.toLocaleString()}</div>
        <div><strong>Camas de Hospital:</strong> ${node.beds}</div>
        <p style="margin-top: 6px; font-size: 0.76rem; color: #94a3b8;">${node.desc}</p>
      `);

      marker.on('click', () => {
        setInspectorInfo(
          node.name,
          `<strong>${node.units.toLocaleString()} Unidades DENUE</strong> • ${node.beds} camas censables.<br>${node.desc}`,
          node.type
        );
      });

      marker.addTo(mapLayerGroup);
    });

    // 4. Instalaciones Médicas de Alta Especialidad
    const facilities = data.medicalFacilities || [];
    facilities.forEach(fac => {
      if (filterCategory !== 'all' && fac.category !== filterCategory) return;

      const isHospital = fac.category === 'hospital';
      const fMarker = L.circleMarker([fac.lat, fac.lng], {
        radius: isHospital ? 7 : 5,
        fillColor: isHospital ? '#ff4757' : (fac.category === 'clinica' ? '#00f2fe' : '#eab308'),
        color: '#ffffff',
        weight: 1.5,
        fillOpacity: 0.9
      });

      fMarker.bindPopup(`
        <h4><i class="fa-solid fa-plus-circle"></i> ${fac.name}</h4>
        <div><strong>Categoría:</strong> ${fac.type}</div>
        <div><strong>Capacidad Estimada:</strong> ${fac.units} camas/consultorios</div>
      `);

      fMarker.on('click', () => {
        setInspectorInfo(
          fac.name,
          `<strong>${fac.type}</strong><br>Capacidad operativa estimada de ${fac.units} unidades/camas de atención activa.`,
          fac.category.toUpperCase()
        );
      });

      fMarker.addTo(mapLayerGroup);
    });
  }

  function renderChapter4Layers(maxWalkMin = 15) {
    if (!mapLayerGroup) return;
    mapLayerGroup.clearLayers();
    isochroneRingsGroup.clearLayers();

    const data = window.DataStoryApp.viewsData ? window.DataStoryApp.viewsData[4] : null;
    if (!data) return;

    // 1. Macro-Sedes de Vacunación con Isócronas Peatonales
    const macroSedes = data.macroSedes || [];
    macroSedes.forEach(sede => {
      // Isócronas peatonales concéntricas (5 min = 400m, 10 min = 800m, 15 min = 1200m)
      const isochrones = [
        { radius: 400, opacity: 0.35, color: sede.color, label: '5 min' },
        { radius: 800, opacity: 0.20, color: sede.color, label: '10 min' },
        { radius: 1200, opacity: 0.10, color: sede.color, label: '15 min' }
      ].filter(iso => (iso.radius / 80) <= maxWalkMin);

      isochrones.forEach(iso => {
        L.circle([sede.lat, sede.lng], {
          radius: iso.radius,
          color: iso.color,
          weight: 1.5,
          dashArray: '4, 4',
          fillColor: iso.color,
          fillOpacity: iso.opacity
        }).addTo(isochroneRingsGroup);
      });

      const marker = L.circleMarker([sede.lat, sede.lng], {
        radius: 12,
        fillColor: sede.color,
        color: '#ffffff',
        weight: 2.5,
        fillOpacity: 0.95
      });

      marker.bindPopup(`
        <h4><i class="fa-solid fa-syringe"></i> ${sede.name}</h4>
        <div><strong>Capacidad Diaria:</strong> ${sede.dailyDoses.toLocaleString()} dosis/día</div>
        <div><strong>Isócrona 15 min:</strong> Cobertura directa de más de 40,000 habitantes.</div>
      `);

      marker.on('click', () => {
        setInspectorInfo(
          sede.name,
          `<strong>Capacidad: ${sede.dailyDoses.toLocaleString()} dosis diarias</strong>.<br>Módulo estratégico de alta capacidad con carriles peatonales y vehiculares continuos.`,
          "Macro-Sede Metropolitana"
        );
      });

      marker.addTo(mapLayerGroup);
    });

    // 2. Comisarías y Módulos de Proximidad
    const comisarias = data.isochroneComisarias || [];
    comisarias.forEach(com => {
      // Polígono / Buffer de proximidad de la comisaría
      L.circle([com.lat, com.lng], {
        radius: 700,
        color: '#10b981',
        weight: 1,
        dashArray: '3, 5',
        fillColor: '#10b981',
        fillOpacity: 0.12
      }).addTo(isochroneRingsGroup);

      const marker = L.circleMarker([com.lat, com.lng], {
        radius: 8,
        fillColor: '#10b981',
        color: '#ffffff',
        weight: 1.5,
        fillOpacity: 0.9
      });

      marker.bindPopup(`
        <h4><i class="fa-solid fa-house-medical"></i> Comisaría ${com.name}</h4>
        <div><strong>Población:</strong> ${com.pop.toLocaleString()} hab.</div>
        <div><strong>Tiempo Caminata a Salud:</strong> ${com.walkMin} min</div>
        <div><strong>Calidad de Banquetas:</strong> ${com.sidewalkPct}%</div>
        <p style="font-size: 0.76rem; color: #94a3b8; margin-top: 4px;">Equipamiento: ${com.facility}</p>
      `);

      marker.on('click', () => {
        setInspectorInfo(
          `Comisaría ${com.name}`,
          `<strong>Población: ${com.pop.toLocaleString()} hab.</strong> • Banquetas: ${com.sidewalkPct}%<br>Tiempo medio de caminata a centro de salud: <strong>${com.walkMin} minutos</strong>.<br>Equipamiento: ${com.facility}`,
          "Comisaría de Mérida"
        );
      });

      marker.addTo(mapLayerGroup);
    });
  }

  function setInspectorInfo(title, text, tag = "Punto de Interés") {
    const titleEl = document.getElementById('inspectorTitle');
    const contentEl = document.getElementById('inspectorContent');
    const tagEl = document.getElementById('inspectorTag');

    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${title}`;
    if (contentEl) contentEl.innerHTML = text;
    if (tagEl) tagEl.innerText = tag;

    const showToast = window.DataStoryApp.storytelling?.showToast;
    if (showToast) showToast(`Seleccionado: ${title}`);
  }

  function highlightNode(nodeKey) {
    if (!leafletMap) return;

    if (currentMapMode === 1) {
      if (nodeKey === 'merida') {
        leafletMap.flyTo([20.9674, -89.5926], 11.5, { duration: 1.2 });
        setInspectorInfo('Zona Metropolitana de Mérida', 'Concentra 2,150 unidades médicas DENUE y el 68% de las camas hospitalarias.', 'Núcleo Central');
      } else if (nodeKey === 'interior') {
        leafletMap.flyTo([20.9, -88.3], 9, { duration: 1.2 });
        setInspectorInfo('Hubs Regionales de Yucatán', 'Valladolid y Tizimín articulan la atención médica de 350,000 habitantes en el oriente y costa.', 'Red Regional');
      } else {
        leafletMap.flyTo([20.85, -89.40], 8.5, { duration: 1.2 });
        setInspectorInfo('Estado de Yucatán (106 Municipios)', '3,842 unidades DENUE integradas entre consultorios barriales, clínicas y macro-hospitales.', 'Cobertura Total');
      }
    } else {
      if (nodeKey === 'merida' || nodeKey === 'all') {
        leafletMap.flyTo([20.985, -89.635], 12, { duration: 1.2 });
      }
    }
  }

  function filterGisLayer(category) {
    if (currentMapMode === 1) {
      renderChapter1Layers(category);
    } else {
      renderChapter4Layers(15);
    }
  }

  function setIsochroneTime(minutes) {
    if (currentMapMode === 4) {
      renderChapter4Layers(minutes);
      const showToast = window.DataStoryApp.storytelling?.showToast;
      if (showToast) showToast(`Isócronas peatonales ajustadas a ${minutes} minutos`);
    }
  }

  function destroyMap() {
    if (leafletMap) {
      leafletMap.remove();
      leafletMap = null;
      mapLayerGroup = null;
      isochroneRingsGroup = null;
    }
  }

  // Fallback SVG detallado si no hay conexión a internet para los tiles
  function renderFallbackVectorMap(mode) {
    const host = document.getElementById('leafletContainer');
    if (!host) return;

    host.innerHTML = `
      <svg viewBox="0 0 800 460" style="width: 100%; height: 100%; background: #060914;">
        <defs>
          <linearGradient id="yucatanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0e1b33" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#050914" stop-opacity="0.98"/>
          </linearGradient>
        </defs>
        <path d="M 100 400 Q 200 320 280 260 Q 320 200 380 130 Q 440 80 560 70 Q 680 70 730 160 Q 750 260 680 360 Q 540 400 400 390 Z" 
              fill="url(#yucatanGrad)" stroke="rgba(0, 242, 254, 0.4)" stroke-width="2"/>
        <circle cx="340" cy="180" r="14" fill="#00f2fe" opacity="0.9"/>
        <text x="360" y="185" fill="#fff" font-family="Outfit" font-size="13" font-weight="700">Mérida Metro (2,150 un.)</text>
        <circle cx="560" cy="200" r="10" fill="#ff7e5f"/>
        <text x="575" y="205" fill="#cbd5e1" font-family="Outfit" font-size="11">Valladolid (185 un.)</text>
        <circle cx="540" cy="120" r="9" fill="#10b981"/>
        <text x="555" y="125" fill="#cbd5e1" font-family="Outfit" font-size="11">Tizimín (140 un.)</text>
      </svg>
    `;
  }

  return {
    renderCustomGisMap,
    highlightNode,
    filterGisLayer,
    setIsochroneTime,
    setInspectorInfo,
    destroyMap
  };
})();
