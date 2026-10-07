/**
 * App Coordinator & Main Storytelling Controller
 * Plataforma de Data Storytelling: El Viaje de la Resiliencia (UPY)
 */
window.DataStoryApp = window.DataStoryApp || {};

window.DataStoryApp.app = (function() {
  let currentStep = 1;

  function init() {
    setupAppEvents();
    switchView(1);
    setupKeyboardNavigation();
  }

  function switchView(step) {
    if (document.startViewTransition) {
      document.startViewTransition(() => executeViewChange(step));
    } else {
      executeViewChange(step);
    }
  }

  function executeViewChange(step) {
    const storytelling = window.DataStoryApp.storytelling;
    const viewsData = window.DataStoryApp.viewsData;
    const charts = window.DataStoryApp.charts;
    const gisMap = window.DataStoryApp.gisMap;
    const forceGraph = window.DataStoryApp.forceGraph;
    const threeVisuals = window.DataStoryApp.threeVisuals;

    if (storytelling) storytelling.stopAudioNarration();

    currentStep = step;
    const data = viewsData ? viewsData[step] : null;
    if (!data) return;

    // Actualizar Journey Arc Stepper
    updateJourneyArc(data);

    // Actualizar Tabs Nav
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn, index) => {
      btn.classList.toggle('active', index + 1 === step);
    });

    // Progreso
    const progressBar = document.getElementById('progressBarFill');
    if (progressBar) {
      progressBar.style.width = `${(step / 9) * 100}%`;
    }

    // Banners de Fuentes
    const isTech = step >= 8;
    const primaryBadge = document.getElementById('primarySourceBadge');
    if (primaryBadge) {
      primaryBadge.className = isTech ? "badge-pill badge-ar" : "badge-pill badge-primary";
      primaryBadge.innerHTML = `<i class="${isTech ? 'fa-solid fa-wand-magic-sparkles' : 'fa-solid fa-tag'}"></i> ${isTech ? 'APARTADO ESPECIAL DEDICADO: ' : 'FUENTE PRINCIPAL: '} ${data.primarySource}`;
    }

    const secContainer = document.getElementById('secondarySourceContainer');
    if (secContainer) {
      secContainer.innerHTML = `<span><i class="fa-solid fa-link"></i> ${isTech ? 'Alimentado por:' : 'Fuentes Complementarias:'}</span>` + 
        data.secondarySources.map(s => `<span class="badge-pill badge-secondary">${s}</span>`).join('');
    }

    // Títulos y Storytelling Editorial
    const storyTag = document.getElementById('storyTag');
    const storyTitle = document.getElementById('storyTitle');
    const storyLead = document.getElementById('storyLead');
    const storyDesc = document.getElementById('storyDescription');
    const storyInsight = document.getElementById('storyInsight');
    const stepIndicator = document.getElementById('stepIndicator');
    const vizTitle = document.getElementById('vizTitle');

    if (storyTag) storyTag.innerHTML = `<i class="fa-solid fa-compass"></i> ${data.tag}`;
    if (storyTitle) storyTitle.innerHTML = data.storyTitle;
    if (storyLead) storyLead.innerHTML = data.storyLead || "";
    if (storyDesc) storyDesc.innerHTML = data.storyDesc;
    if (storyInsight) storyInsight.innerHTML = data.insight;
    if (stepIndicator) stepIndicator.innerText = `Capítulo ${step} de 9 • ${data.tabName}`;
    if (vizTitle) vizTitle.innerHTML = `<i class="fa-solid fa-compass-drafting" style="color: var(--accent-cyan);"></i> ${data.vizTitle}`;

    // Renderizar Story Beats Milestones Interactivos
    renderStoryBeats(data.storyBeats);

    // Renderizar KPIs Horizontalmente
    renderKpis(data.kpis);

    // Controles Contextuales
    setupContextualControls(step);

    // Limpiar estados de visualización previos
    if (charts) charts.destroyChart();
    if (forceGraph) forceGraph.stopForceGraph();
    if (threeVisuals) threeVisuals.stopThreeVisual();

    const chartCanvas = document.getElementById('vizChart');
    const threeContainer = document.getElementById('threejsContainer');
    const customSurface = document.getElementById('interactiveCustomSurface');
    const overlayStatus = document.getElementById('overlayStatus');

    if (data.vizType === '3d' || data.vizType === 'ar') {
      if (chartCanvas) chartCanvas.style.display = 'none';
      if (customSurface) customSurface.style.display = 'none';
      if (threeContainer) threeContainer.style.display = 'block';
      if (overlayStatus) overlayStatus.innerText = data.vizType === '3d' ? "LiDAR 3D Mesh • WebGL con Control Orbital" : "Modo Holograma WebXR 3D Activo";
      if (threeVisuals) threeVisuals.initThreeDVisual(data.vizType);
    } else if (data.vizType === 'custom_map') {
      if (chartCanvas) chartCanvas.style.display = 'none';
      if (threeContainer) threeContainer.style.display = 'none';
      if (customSurface) customSurface.style.display = 'flex';
      if (overlayStatus) overlayStatus.innerText = step === 4 ? "GeoPortal Mérida • Isócronas y Comisarías" : "Cartografía Interactiva GIS • Yucatán & Mérida";
      if (gisMap) gisMap.renderCustomGisMap(step);
    } else if (data.vizType === 'custom_force') {
      if (chartCanvas) chartCanvas.style.display = 'none';
      if (threeContainer) threeContainer.style.display = 'none';
      if (customSurface) customSurface.style.display = 'flex';
      if (overlayStatus) overlayStatus.innerText = "Grafo Semántico Dinámico (Fuerzas y Co-ocurrencias)";
      if (forceGraph) forceGraph.renderForceGraph();
    } else {
      if (threeContainer) threeContainer.style.display = 'none';
      if (customSurface) customSurface.style.display = 'none';
      if (chartCanvas) chartCanvas.style.display = 'block';
      if (overlayStatus) overlayStatus.innerText = "Visualización Interactiva Activa";
      if (charts) charts.renderChart(data);
    }

    const activeBtn = tabBtns[step - 1];
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  function updateJourneyArc(data) {
    const arc1 = document.getElementById('arcPill1');
    const arc2 = document.getElementById('arcPill2');
    const arc3 = document.getElementById('arcPill3');
    const arc4 = document.getElementById('arcPill4');

    if (!arc1) return;

    arc1.classList.toggle('active', data.number >= 1 && data.number <= 3);
    arc2.classList.toggle('active', data.number >= 4 && data.number <= 6);
    arc3.classList.toggle('active', data.number === 7);
    arc4.classList.toggle('active', data.number >= 8);
  }

  function renderStoryBeats(beats) {
    const container = document.getElementById('storyBeatsList');
    if (!container) return;

    if (!beats || beats.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = beats.map((beat, idx) => `
      <div class="story-beat-card ${idx === 0 ? 'active' : ''}" data-beat-id="${beat.id}" id="beatCard_${idx}">
        <div class="beat-header">
          <span class="beat-title">${beat.title}</span>
          <span class="beat-action-pill"><i class="fa-solid fa-bullseye"></i> ${beat.actionText}</span>
        </div>
        <p class="beat-desc">${beat.desc}</p>
      </div>
    `).join('');

    // Attach click triggers to beats
    beats.forEach((beat, idx) => {
      document.getElementById(`beatCard_${idx}`)?.addEventListener('click', () => {
        document.querySelectorAll('.story-beat-card').forEach(c => c.classList.remove('active'));
        document.getElementById(`beatCard_${idx}`)?.classList.add('active');
        handleBeatTrigger(beat);
      });
    });
  }

  function handleBeatTrigger(beat) {
    const gisMap = window.DataStoryApp.gisMap;
    const charts = window.DataStoryApp.charts;
    const storytelling = window.DataStoryApp.storytelling;
    const threeVisuals = window.DataStoryApp.threeVisuals;
    const forceGraph = window.DataStoryApp.forceGraph;

    if (beat.focusNode && gisMap) {
      gisMap.highlightNode(beat.focusNode);
    }
    if (beat.filterWave && charts) {
      charts.filterWaveDataset(beat.filterWave);
    }
    if (typeof beat.jurisIdx === 'number' && charts) {
      charts.filterJurisdiction(beat.jurisIdx);
    }
    if (beat.id === 'beat4_1' && gisMap) {
      gisMap.setIsochroneTime(15);
      gisMap.highlightNode('merida');
    }
    if (beat.id === 'beat4_3' && gisMap) {
      gisMap.setIsochroneTime(10);
    }
    if (beat.id === 'beat6_1' && forceGraph) {
      forceGraph.filterCluster('vacunacion');
    }
    if (beat.id === 'beat6_2' && forceGraph) {
      forceGraph.filterCluster('juventud');
    }
    if (beat.id === 'beat8_1' && threeVisuals) threeVisuals.setCameraPreset('iso');
    if (beat.id === 'beat8_2' && threeVisuals) threeVisuals.setLidarTheme('terrain');
    if (beat.id === 'beat8_3' && threeVisuals) threeVisuals.setLidarTheme('cyberpunk');
    if (beat.id === 'beat9_1' && threeVisuals) threeVisuals.initThreeDVisual('ar');
    if (beat.id === 'beat9_2' && threeVisuals) threeVisuals.toggleSpikeExplosion();
    if (beat.id === 'beat9_3' && threeVisuals) threeVisuals.triggerArModal();

    if (storytelling) storytelling.showToast(`Paso seleccionado: ${beat.title}`);
  }

  function renderKpis(kpis) {
    const container = document.getElementById('kpiContainer');
    if (!container || !kpis) return;

    container.innerHTML = kpis.map(k => `
      <div class="kpi-block">
        <div class="kpi-icon-box" style="color: ${k.color};">
          <i class="fa-solid ${k.icon}"></i>
        </div>
        <div class="kpi-info-content">
          <span class="kpi-main-number">${k.value}</span>
          <span class="kpi-text-label">${k.label}</span>
          <span class="kpi-delta-pill"><i class="fa-solid fa-arrow-trend-up"></i> ${k.delta || "Dato verificado"}</span>
        </div>
      </div>
    `).join('');
  }

  function setupContextualControls(step) {
    const controls = document.getElementById('vizControls');
    if (!controls) return;

    const threeVisuals = window.DataStoryApp.threeVisuals;
    const forceGraph = window.DataStoryApp.forceGraph;
    const gisMap = window.DataStoryApp.gisMap;
    const charts = window.DataStoryApp.charts;

    if (step === 1) {
      controls.innerHTML = `
        <span style="color: var(--text-dim); font-size: 0.74rem;">Filtro DENUE:</span>
        <button class="ctrl-btn active" id="btnGisAll"><i class="fa-solid fa-layer-group"></i> Todos</button>
        <button class="ctrl-btn" id="btnGisHosp"><i class="fa-solid fa-hospital"></i> Hospitales</button>
        <button class="ctrl-btn" id="btnGisClin"><i class="fa-solid fa-stethoscope"></i> Clínicas</button>
        <button class="ctrl-btn" id="btnGisFarm"><i class="fa-solid fa-pills"></i> Farmacias</button>
      `;
      document.getElementById('btnGisAll')?.addEventListener('click', (e) => {
        highlightActiveCtrl(e.target);
        if (gisMap) gisMap.filterGisLayer('all');
      });
      document.getElementById('btnGisHosp')?.addEventListener('click', (e) => {
        highlightActiveCtrl(e.target);
        if (gisMap) gisMap.filterGisLayer('hospital');
      });
      document.getElementById('btnGisClin')?.addEventListener('click', (e) => {
        highlightActiveCtrl(e.target);
        if (gisMap) gisMap.filterGisLayer('clinica');
      });
      document.getElementById('btnGisFarm')?.addEventListener('click', (e) => {
        highlightActiveCtrl(e.target);
        if (gisMap) gisMap.filterGisLayer('farmacia');
      });

    } else if (step === 2) {
      controls.innerHTML = `
        <span style="color: var(--text-dim); font-size: 0.74rem;">Fase:</span>
        <button class="ctrl-btn active" id="btnWaveAll"><i class="fa-solid fa-timeline"></i> Todas las Olas</button>
        <button class="ctrl-btn" id="btnWave1"><i class="fa-solid fa-triangle-exclamation"></i> Ola 1 (2020)</button>
        <button class="ctrl-btn" id="btnWaveVac"><i class="fa-solid fa-syringe"></i> Post-Vacuna</button>
      `;
      document.getElementById('btnWaveAll')?.addEventListener('click', (e) => {
        highlightActiveCtrl(e.target);
        if (charts) charts.filterWaveDataset('all');
      });
      document.getElementById('btnWave1')?.addEventListener('click', (e) => {
        highlightActiveCtrl(e.target);
        if (charts) charts.filterWaveDataset('wave1');
      });
      document.getElementById('btnWaveVac')?.addEventListener('click', (e) => {
        highlightActiveCtrl(e.target);
        if (charts) charts.filterWaveDataset('waveVac');
      });

    } else if (step === 3) {
      controls.innerHTML = `
        <span style="color: var(--text-dim); font-size: 0.74rem;">Jurisdicciones:</span>
        <button class="ctrl-btn active" id="btnJAll">Todas (3)</button>
        <button class="ctrl-btn" id="btnJ1">J1 Mérida</button>
        <button class="ctrl-btn" id="btnJ2">J2 Valladolid</button>
        <button class="ctrl-btn" id="btnJ3">J3 Ticul</button>
      `;
      document.getElementById('btnJAll')?.addEventListener('click', (e) => {
        highlightActiveCtrl(e.target);
        if (charts) charts.filterJurisdiction('all');
      });
      document.getElementById('btnJ1')?.addEventListener('click', (e) => {
        highlightActiveCtrl(e.target);
        if (charts) charts.filterJurisdiction(0);
      });
      document.getElementById('btnJ2')?.addEventListener('click', (e) => {
        highlightActiveCtrl(e.target);
        if (charts) charts.filterJurisdiction(1);
      });
      document.getElementById('btnJ3')?.addEventListener('click', (e) => {
        highlightActiveCtrl(e.target);
        if (charts) charts.filterJurisdiction(2);
      });

    } else if (step === 4) {
      controls.innerHTML = `
        <span style="color: var(--text-dim); font-size: 0.74rem;">Isócronas Peatonales:</span>
        <button class="ctrl-btn active" id="btnIso15"><i class="fa-solid fa-person-walking"></i> 15 min</button>
        <button class="ctrl-btn" id="btnIso10"><i class="fa-solid fa-person-walking"></i> 10 min</button>
        <button class="ctrl-btn" id="btnIso5"><i class="fa-solid fa-person-walking"></i> 5 min</button>
      `;
      document.getElementById('btnIso15')?.addEventListener('click', (e) => {
        highlightActiveCtrl(e.target);
        if (gisMap) gisMap.setIsochroneTime(15);
      });
      document.getElementById('btnIso10')?.addEventListener('click', (e) => {
        highlightActiveCtrl(e.target);
        if (gisMap) gisMap.setIsochroneTime(10);
      });
      document.getElementById('btnIso5')?.addEventListener('click', (e) => {
        highlightActiveCtrl(e.target);
        if (gisMap) gisMap.setIsochroneTime(5);
      });

    } else if (step === 6) {
      controls.innerHTML = `
        <span style="color: var(--text-dim); font-size: 0.74rem;">NLP & Prensa:</span>
        <button class="ctrl-btn active" id="btnScramble"><i class="fa-solid fa-shuffle"></i> Repulsión</button>
        <button class="ctrl-btn" id="btnFiltVac"><i class="fa-solid fa-syringe"></i> Vacunación</button>
        <button class="ctrl-btn" id="btnFiltUpy"><i class="fa-solid fa-graduation-cap"></i> UPY</button>
      `;
      document.getElementById('btnScramble')?.addEventListener('click', () => {
        if (forceGraph) forceGraph.scrambleForceNodes();
      });
      document.getElementById('btnFiltVac')?.addEventListener('click', () => {
        if (forceGraph) forceGraph.filterCluster('vacunacion');
      });
      document.getElementById('btnFiltUpy')?.addEventListener('click', () => {
        if (forceGraph) forceGraph.filterCluster('juventud');
      });

    } else if (step === 8) {
      controls.innerHTML = `
        <span style="color: var(--text-dim); font-size: 0.74rem;">Cámara LiDAR:</span>
        <button class="ctrl-btn active" id="btnCamIso"><i class="fa-solid fa-cube"></i> Isométrica</button>
        <button class="ctrl-btn" id="btnCamTop"><i class="fa-solid fa-plane"></i> Cenital</button>
        <button class="ctrl-btn" id="btnCamStreet"><i class="fa-solid fa-street-view"></i> Calle</button>
        <button class="ctrl-btn" id="btnLidarPalette"><i class="fa-solid fa-palette"></i> Topografía</button>
      `;
      document.getElementById('btnCamIso')?.addEventListener('click', (e) => {
        highlightActiveCtrl(e.target);
        if (threeVisuals) threeVisuals.setCameraPreset('iso');
      });
      document.getElementById('btnCamTop')?.addEventListener('click', (e) => {
        highlightActiveCtrl(e.target);
        if (threeVisuals) threeVisuals.setCameraPreset('top');
      });
      document.getElementById('btnCamStreet')?.addEventListener('click', (e) => {
        highlightActiveCtrl(e.target);
        if (threeVisuals) threeVisuals.setCameraPreset('street');
      });
      document.getElementById('btnLidarPalette')?.addEventListener('click', (e) => {
        highlightActiveCtrl(e.target);
        if (threeVisuals) threeVisuals.setLidarTheme('terrain');
      });

    } else if (step === 9) {
      controls.innerHTML = `
        <button class="ctrl-btn active" id="btnSpikeExplode"><i class="fa-solid fa-burst"></i> Explosión Estructural</button>
        <button class="ctrl-btn" id="btnArQr"><i class="fa-solid fa-qrcode"></i> Proyectar en Móvil AR</button>
      `;
      document.getElementById('btnSpikeExplode')?.addEventListener('click', () => {
        if (threeVisuals) threeVisuals.toggleSpikeExplosion();
      });
      document.getElementById('btnArQr')?.addEventListener('click', () => {
        if (threeVisuals) threeVisuals.triggerArModal();
      });

    } else {
      controls.innerHTML = `
        <span style="color: var(--text-dim); font-size: 0.74rem;">Vista:</span>
        <button class="ctrl-btn active"><i class="fa-solid fa-chart-simple"></i> Desglose Detallado</button>
      `;
    }
  }

  function highlightActiveCtrl(targetBtn) {
    if (!targetBtn) return;
    const parent = targetBtn.closest('.controls-bar');
    if (parent) {
      parent.querySelectorAll('.ctrl-btn').forEach(b => b.classList.remove('active'));
    }
    targetBtn.classList.add('active');
  }

  function navigateStep(direction) {
    let newStep = currentStep + direction;
    if (newStep < 1) newStep = 9;
    if (newStep > 9) newStep = 1;
    switchView(newStep);
  }

  function setupAppEvents() {
    const storytelling = window.DataStoryApp.storytelling;
    const viewsData = window.DataStoryApp.viewsData;

    // Journey Arc Steppers Click
    document.getElementById('arcPill1')?.addEventListener('click', () => switchView(1));
    document.getElementById('arcPill2')?.addEventListener('click', () => switchView(4));
    document.getElementById('arcPill3')?.addEventListener('click', () => switchView(7));
    document.getElementById('arcPill4')?.addEventListener('click', () => switchView(8));

    // Tabs navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => switchView(idx + 1));
    });

    // Footer Navigation Buttons
    document.getElementById('prevBtn')?.addEventListener('click', () => navigateStep(-1));
    document.getElementById('nextBtn')?.addEventListener('click', () => navigateStep(1));

    // Brand Header Click
    document.querySelector('.brand-container')?.addEventListener('click', () => switchView(1));

    // Auto-Tour Button
    document.getElementById('presBtn')?.addEventListener('click', () => {
      if (storytelling) storytelling.togglePresentationMode(() => navigateStep(1));
    });

    // Audio Narration Button
    document.getElementById('narrateBtn')?.addEventListener('click', () => {
      if (storytelling && viewsData) storytelling.toggleAudioNarration(viewsData[currentStep]);
    });

    // Methodology Modal Events
    document.getElementById('btnOpenMethodology')?.addEventListener('click', () => {
      document.getElementById('methodologyModal')?.showModal();
    });
    document.getElementById('btnCloseMethodology')?.addEventListener('click', () => {
      document.getElementById('methodologyModal')?.close();
    });
    document.getElementById('btnMethodologyUnderstood')?.addEventListener('click', () => {
      document.getElementById('methodologyModal')?.close();
    });

    // Export Data JSON
    document.getElementById('btnExportData')?.addEventListener('click', () => {
      if (!viewsData) return;
      const data = viewsData[currentStep];
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `capitulo_${currentStep}_${data.tabName.replace(/\s+/g, '_')}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      if (storytelling) storytelling.showToast("Dataset JSON descargado exitosamente");
    });

    // Canvas Viewport Tools
    document.getElementById('btnSnapshot')?.addEventListener('click', () => {
      const chartCanvas = document.getElementById('vizChart');
      if (chartCanvas && chartCanvas.style.display !== 'none') {
        const image = chartCanvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = `viz_capitulo_${currentStep}.png`;
        link.href = image;
        link.click();
        if (storytelling) storytelling.showToast("Captura de pantalla guardada");
      } else {
        if (storytelling) storytelling.showToast("Captura interactiva guardada");
      }
    });

    document.getElementById('btnFullscreen')?.addEventListener('click', () => {
      const wrapper = document.getElementById('canvasWrapper');
      if (!document.fullscreenElement) {
        wrapper?.requestFullscreen().catch(err => alert(err.message));
      } else {
        document.exitFullscreen();
      }
    });

    // Window Resize
    window.addEventListener('resize', () => {
      const threeVisuals = window.DataStoryApp.threeVisuals;
      if (currentStep >= 8 && threeVisuals && viewsData) {
        threeVisuals.initThreeDVisual(viewsData[currentStep].vizType);
      }
    });
  }

  function setupKeyboardNavigation() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') navigateStep(1);
      if (e.key === 'ArrowLeft') navigateStep(-1);
      if (e.key >= '1' && e.key <= '9') switchView(parseInt(e.key));
      if (e.key === 'm' || e.key === 'M') {
        const modal = document.getElementById('methodologyModal');
        if (modal?.open) modal.close();
        else modal?.showModal();
      }
    });
  }

  return {
    init,
    switchView,
    navigateStep
  };
})();

// Iniciar al cargar scripts
window.addEventListener('DOMContentLoaded', () => {
  if (window.DataStoryApp.app) {
    window.DataStoryApp.app.init();
  }
});
