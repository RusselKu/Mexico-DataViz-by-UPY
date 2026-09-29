/**
 * Módulo de Grafo de Fuerzas Semántico Dinámico (Vista 6 - Web Scraping)
 */
window.DataStoryApp = window.DataStoryApp || {};

window.DataStoryApp.forceGraph = (function() {
  let forceNodes = [];
  let forceGraphAnimId = null;

  function renderForceGraph() {
    const container = document.getElementById('interactiveCustomSurface');
    if (!container) return;

    container.innerHTML = `
      <canvas id="forceGraphCanvas" style="width: 100%; height: 100%;"></canvas>
    `;

    const canvas = document.getElementById('forceGraphCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = container.clientWidth || 800;
    canvas.height = container.clientHeight || 440;

    forceNodes = [
      { id: 1, text: "Vacunación Masiva", r: 36, color: "#00f2fe", x: canvas.width * 0.5, y: canvas.height * 0.45, vx: 0, vy: 0 },
      { id: 2, text: "Solidaridad UPY", r: 30, color: "#10b981", x: canvas.width * 0.35, y: canvas.height * 0.3, vx: 0, vy: 0 },
      { id: 3, text: "Reapertura Segura", r: 26, color: "#a855f7", x: canvas.width * 0.65, y: canvas.height * 0.35, vx: 0, vy: 0 },
      { id: 4, text: "Héroes de Blanco", r: 28, color: "#ff7e5f", x: canvas.width * 0.38, y: canvas.height * 0.7, vx: 0, vy: 0 },
      { id: 5, text: "Ciencia & Salud", r: 24, color: "#4facfe", x: canvas.width * 0.62, y: canvas.height * 0.65, vx: 0, vy: 0 },
      { id: 6, text: "Comunidad Maya", r: 25, color: "#feb47b", x: canvas.width * 0.2, y: canvas.height * 0.5, vx: 0, vy: 0 },
      { id: 7, text: "Espacios Públicos", r: 22, color: "#ec4899", x: canvas.width * 0.8, y: canvas.height * 0.5, vx: 0, vy: 0 }
    ];

    const links = [
      { source: 0, target: 1 }, { source: 0, target: 2 }, { source: 0, target: 3 },
      { source: 0, target: 4 }, { source: 1, target: 4 }, { source: 3, target: 4 },
      { source: 1, target: 5 }, { source: 2, target: 6 }
    ];

    function animateForce() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Enlaces
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1.5;
      links.forEach(l => {
        const s = forceNodes[l.source];
        const t = forceNodes[l.target];
        if (s && t) {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(t.x, t.y);
          ctx.stroke();
        }
      });

      // Nodos
      forceNodes.forEach(node => {
        node.x += Math.sin(Date.now() * 0.002 + node.id) * 0.3;
        node.y += Math.cos(Date.now() * 0.002 + node.id) * 0.3;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.stroke();

        ctx.fillStyle = "#050811";
        ctx.font = "bold 11px Outfit";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.text, node.x, node.y);
      });

      forceGraphAnimId = requestAnimationFrame(animateForce);
    }
    animateForce();
  }

  function scrambleForceNodes() {
    forceNodes.forEach(node => {
      node.x += (Math.random() - 0.5) * 60;
      node.y += (Math.random() - 0.5) * 60;
    });
    const showToast = window.DataStoryApp.storytelling?.showToast || console.log;
    showToast("Reajuste de fuerzas semánticas completado");
  }

  function stopForceGraph() {
    if (forceGraphAnimId) {
      cancelAnimationFrame(forceGraphAnimId);
      forceGraphAnimId = null;
    }
  }

  return {
    renderForceGraph,
    scrambleForceNodes,
    stopForceGraph
  };
})();
