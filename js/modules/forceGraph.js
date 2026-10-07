/**
 * Módulo de Grafo Semántico Dinámico y Minería de Sentimiento (D3.js Force Simulation)
 * Vista 6 (Web Scraping de Prensa Local & PLN)
 * Plataforma Data Storytelling • UPY
 */
window.DataStoryApp = window.DataStoryApp || {};

window.DataStoryApp.forceGraph = (function() {
  let simulation = null;
  let activeClusterFilter = 'all';

  const nlpNodes = [
    // Cluster 1: Vacunación & Inmunización (Cyan / Blue)
    { id: 1, text: "Vacunación Masiva", cluster: "vacunacion", count: 840, sentiment: 0.92, color: "#00f2fe", r: 32 },
    { id: 2, text: "Siglo XXI", cluster: "vacunacion", count: 620, sentiment: 0.88, color: "#00f2fe", r: 24 },
    { id: 3, text: "Kukulcán", cluster: "vacunacion", count: 580, sentiment: 0.85, color: "#00f2fe", r: 22 },
    { id: 4, text: "Brigadas Correcaminos", cluster: "vacunacion", count: 490, sentiment: 0.89, color: "#38bdf8", r: 20 },
    { id: 5, text: "Dosis & Refuerzos", cluster: "vacunacion", count: 530, sentiment: 0.86, color: "#38bdf8", r: 21 },
    { id: 6, text: "Inmunización Récord", cluster: "vacunacion", count: 410, sentiment: 0.94, color: "#00f2fe", r: 19 },

    // Cluster 2: Juventud & UPY (Emerald / Teal)
    { id: 7, text: "Estudiantes UPY", cluster: "juventud", count: 650, sentiment: 0.95, color: "#10b981", r: 28 },
    { id: 8, text: "Ingeniería en Datos", cluster: "juventud", count: 480, sentiment: 0.92, color: "#10b981", r: 20 },
    { id: 9, text: "Voluntariado Cívico", cluster: "juventud", count: 520, sentiment: 0.96, color: "#34d399", r: 22 },
    { id: 10, text: "Retorno a Campus", cluster: "juventud", count: 460, sentiment: 0.89, color: "#10b981", r: 19 },
    { id: 11, text: "Innovación Tecnológica", cluster: "juventud", count: 390, sentiment: 0.91, color: "#34d399", r: 18 },
    { id: 12, text: "Trabajo Colaborativo", cluster: "juventud", count: 430, sentiment: 0.93, color: "#10b981", r: 18 },

    // Cluster 3: Solidaridad & Comunidad (Violet / Purple)
    { id: 13, text: "Solidaridad Maya", cluster: "solidaridad", count: 720, sentiment: 0.96, color: "#a855f7", r: 26 },
    { id: 14, text: "Héroes de Blanco", cluster: "solidaridad", count: 680, sentiment: 0.98, color: "#c084fc", r: 25 },
    { id: 15, text: "Médicos & Enfermeras", cluster: "solidaridad", count: 610, sentiment: 0.94, color: "#a855f7", r: 23 },
    { id: 16, text: "Redes Vecinales", cluster: "solidaridad", count: 420, sentiment: 0.88, color: "#c084fc", r: 19 },
    { id: 17, text: "Adultos Mayores", cluster: "solidaridad", count: 470, sentiment: 0.90, color: "#a855f7", r: 20 },
    { id: 18, text: "Donaciones & Apoyo", cluster: "solidaridad", count: 340, sentiment: 0.87, color: "#c084fc", r: 17 },

    // Cluster 4: Ciencia, Protocolos & Reactivación (Coral / Amber)
    { id: 19, text: "Ciencia & Salud", cluster: "ciencia", count: 580, sentiment: 0.91, color: "#ff7e5f", r: 24 },
    { id: 20, text: "Reapertura Segura", cluster: "ciencia", count: 540, sentiment: 0.84, color: "#feb47b", r: 22 },
    { id: 21, text: "Filtros Sanitarios", cluster: "ciencia", count: 450, sentiment: 0.82, color: "#ff7e5f", r: 19 },
    { id: 22, text: "Espacios Públicos", cluster: "ciencia", count: 410, sentiment: 0.86, color: "#feb47b", r: 18 },
    { id: 23, text: "Parques Barriales", cluster: "ciencia", count: 380, sentiment: 0.88, color: "#ff7e5f", r: 17 },
    { id: 24, text: "Transparencia de Datos", cluster: "ciencia", count: 360, sentiment: 0.85, color: "#feb47b", r: 17 }
  ];

  const nlpLinks = [
    { source: 1, target: 2, value: 5 },
    { source: 1, target: 3, value: 5 },
    { source: 1, target: 4, value: 4 },
    { source: 1, target: 5, value: 4 },
    { source: 1, target: 7, value: 4 },
    { source: 1, target: 13, value: 5 },
    { source: 1, target: 19, value: 4 },
    { source: 7, target: 8, value: 5 },
    { source: 7, target: 9, value: 5 },
    { source: 7, target: 10, value: 4 },
    { source: 7, target: 11, value: 4 },
    { source: 7, target: 12, value: 4 },
    { source: 7, target: 14, value: 3 },
    { source: 13, target: 14, value: 5 },
    { source: 14, target: 15, value: 5 },
    { source: 13, target: 16, value: 4 },
    { source: 13, target: 17, value: 4 },
    { source: 19, target: 20, value: 4 },
    { source: 19, target: 21, value: 3 },
    { source: 20, target: 22, value: 4 },
    { source: 22, target: 23, value: 4 },
    { source: 11, target: 24, value: 3 }
  ];

  function renderForceGraph() {
    const container = document.getElementById('interactiveCustomSurface');
    if (!container) return;

    stopForceGraph();

    container.innerHTML = `
      <div class="force-graph-wrapper" id="forceGraphContainer">
        <!-- SVG Canvas for D3 Network -->
        <svg id="forceSvg" style="width: 100%; height: 100%;"></svg>

        <!-- NLP News Excerpts Drawer -->
        <div class="nlp-article-drawer" id="nlpDrawer">
          <div class="nlp-drawer-title">
            <span><i class="fa-solid fa-newspaper" style="color: var(--accent-cyan);"></i> Corpus de Prensa Minada</span>
            <span class="badge-pill badge-primary" style="font-size: 0.68rem;">1,420 Notas</span>
          </div>
          <div id="nlpArticlesList" style="display: flex; flex-direction: column; gap: 8px;">
            <!-- Citas inyectadas dinámicamente -->
          </div>
        </div>

        <!-- Floating Legend -->
        <div class="map-floating-legend" style="bottom: 14px; top: auto; right: 14px; z-index: 100;">
          <div style="font-weight: 700; color: var(--accent-cyan); margin-bottom: 2px;">Tópicos Semánticos (PLN):</div>
          <div class="legend-item"><span class="legend-color-dot" style="background: #00f2fe;"></span> Vacunación Masiva</div>
          <div class="legend-item"><span class="legend-color-dot" style="background: #10b981;"></span> Juventud & Comunidad UPY</div>
          <div class="legend-item"><span class="legend-color-dot" style="background: #a855f7;"></span> Solidaridad & Apoyo Maya</div>
          <div class="legend-item"><span class="legend-color-dot" style="background: #ff7e5f;"></span> Ciencia & Reactivación</div>
        </div>
      </div>
    `;

    // Renderizar artículos iniciales
    populateArticleQuotes();

    if (typeof d3 !== 'undefined') {
      initD3Simulation();
    } else {
      console.warn("D3.js no disponible, cargando fallback");
    }
  }

  function initD3Simulation() {
    const svg = d3.select("#forceSvg");
    const container = document.getElementById("forceGraphContainer");
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 460;

    svg.selectAll("*").remove();

    const g = svg.append("g");

    // Zoom & Pan
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

    // Deep clone data
    const nodes = JSON.parse(JSON.stringify(nlpNodes));
    const links = JSON.parse(JSON.stringify(nlpLinks));

    simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(65).strength(0.6))
      .force("charge", d3.forceManyBody().strength(-240))
      .force("center", d3.forceCenter(width / 2.3, height / 2))
      .force("collision", d3.forceCollide().radius(d => d.r + 6));

    // Dibujar enlaces
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("class", "d3-link")
      .attr("stroke-width", d => Math.sqrt(d.value) * 1.6);

    // Dibujar nodos
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .attr("class", "d3-node")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Círculos principales
    node.append("circle")
      .attr("r", d => d.r)
      .attr("fill", d => d.color)
      .attr("opacity", 0.9)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1.8)
      .style("filter", d => `drop-shadow(0 0 8px ${d.color})`);

    // Etiquetas de texto
    node.append("text")
      .attr("class", "d3-node-label")
      .attr("dy", ".3em")
      .text(d => d.text)
      .style("font-size", d => d.r > 24 ? "11px" : "9.5px");

    // Eventos interactivos en nodos
    node.on("click", (event, d) => {
      event.stopPropagation();
      highlightNodeNetwork(d, nodes, links, link, node);
      inspectTopicNode(d);
    });

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }

  function highlightNodeNetwork(selectedNode, nodes, links, linkSelection, nodeSelection) {
    const connectedNodeIds = new Set();
    connectedNodeIds.add(selectedNode.id);

    links.forEach(l => {
      const sId = typeof l.source === 'object' ? l.source.id : l.source;
      const tId = typeof l.target === 'object' ? l.target.id : l.target;
      if (sId === selectedNode.id) connectedNodeIds.add(tId);
      if (tId === selectedNode.id) connectedNodeIds.add(sId);
    });

    nodeSelection.select("circle")
      .transition().duration(250)
      .attr("opacity", d => connectedNodeIds.has(d.id) ? 1 : 0.25)
      .attr("stroke-width", d => d.id === selectedNode.id ? 3.5 : 1.5);

    linkSelection
      .classed("highlighted", l => {
        const sId = typeof l.source === 'object' ? l.source.id : l.source;
        const tId = typeof l.target === 'object' ? l.target.id : l.target;
        return sId === selectedNode.id || tId === selectedNode.id;
      });
  }

  function inspectTopicNode(nodeData) {
    const drawer = document.getElementById('nlpArticlesList');
    if (!drawer) return;

    const viewsData = window.DataStoryApp.viewsData ? window.DataStoryApp.viewsData[6] : null;
    const articles = viewsData ? viewsData.newsArticlesCorpus : [];

    // Filtrar noticias que coincidan con la palabra clave
    const matchingArticles = articles.filter(a => 
      a.keywords.some(k => nodeData.text.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(nodeData.text.toLowerCase()))
    );

    const targetArticles = matchingArticles.length > 0 ? matchingArticles : articles;

    drawer.innerHTML = `
      <div style="background: rgba(0, 242, 254, 0.12); padding: 8px 10px; border-radius: 6px; border-left: 3px solid ${nodeData.color};">
        <strong>Término Seleccionado:</strong> ${nodeData.text}<br>
        <span style="font-size: 0.72rem; color: #94a3b8;">Menciones: ${nodeData.count} • Polaridad: ${nodeData.sentiment > 0.9 ? 'Muy Positiva' : 'Positiva'} (+${(nodeData.sentiment * 100).toFixed(1)}%)</span>
      </div>
    ` + targetArticles.map(art => `
      <div class="nlp-article-card">
        <div class="nlp-article-source">${art.source} • ${art.sentiment}</div>
        <div style="font-weight: 600; margin-bottom: 3px; color: #f8fafc;">${art.title}</div>
        <div style="font-style: italic; color: #94a3b8;">${art.quote}</div>
      </div>
    `).join('');

    const showToast = window.DataStoryApp.storytelling?.showToast;
    if (showToast) showToast(`Término enfocado: ${nodeData.text}`);
  }

  function populateArticleQuotes() {
    const drawer = document.getElementById('nlpArticlesList');
    if (!drawer) return;

    const viewsData = window.DataStoryApp.viewsData ? window.DataStoryApp.viewsData[6] : null;
    const articles = viewsData ? viewsData.newsArticlesCorpus || [] : [];

    drawer.innerHTML = articles.map(art => `
      <div class="nlp-article-card">
        <div class="nlp-article-source">${art.source} • ${art.sentiment}</div>
        <div style="font-weight: 600; margin-bottom: 3px; color: #f8fafc;">${art.title}</div>
        <div style="font-style: italic; color: #94a3b8;">${art.quote}</div>
      </div>
    `).join('');
  }

  function filterCluster(clusterName) {
    activeClusterFilter = clusterName;
    if (simulation) {
      simulation.alpha(0.5).restart();
    }
    const showToast = window.DataStoryApp.storytelling?.showToast;
    if (showToast) showToast(`Filtrando tópico: ${clusterName}`);
  }

  function scrambleForceNodes() {
    if (simulation) {
      simulation.alpha(0.8).restart();
      const showToast = window.DataStoryApp.storytelling?.showToast;
      if (showToast) showToast("Fuerzas semánticas recalculadas");
    }
  }

  function stopForceGraph() {
    if (simulation) {
      simulation.stop();
      simulation = null;
    }
  }

  return {
    renderForceGraph,
    filterCluster,
    scrambleForceNodes,
    stopForceGraph
  };
})();
