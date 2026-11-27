(async function renderEscena3() {
  const MORADO = "#600d8b";
  const ORO = "#ed9f22";
  const ORO_OSCURO = "#b45309";
  const GRIS = "#9ca3af";
  const TINTA = "#0d0d0d";
  const BORDE = "#e5e7eb";

  const fmtEntero = d3.format(",");
  const fmtDec = d3.format(".1f");
  const fmtKm = v => d3.format(".1f")(v / 1000);

  const filas = await d3.csv("../datos/escena-3.csv", d => ({
    clave_loc: String(d.clave_loc).padStart(4, "0"),
    localidad: d.localidad,
    tipo: d.tipo_localidad,
    poblacion: +d.poblacion,
    unidad: d.unidad_medica_cercana,
    dist_m: +d.distancia_medica_m,
    min_pie: +d.minutos_pie_medico,
    en15: String(d.en_umbral_15min).toLowerCase() === "true"
  }));

  const fueraCab = filas.filter(d => d.clave_loc !== "0001");
  const fuera15 = fueraCab.filter(d => !d.en15);
  const pctFuera15 = (100 * fuera15.length) / fueraCab.length;
  const pobFuera15 = d3.sum(fuera15, d => d.poblacion);
  const medFueraCab = d3.median(fueraCab, d => d.min_pie);

  document.getElementById("titulo-escena").textContent =
    `${fmtDec(pctFuera15)} % de las comisarías y subcomisarías de Mérida rebasa los 15 minutos a pie al médico (${fmtEntero(pobFuera15)} habitantes)`;
  document.getElementById("lectura-escena").textContent =
    `De las ${fueraCab.length} localidades oficiales fuera de la cabecera de Mérida (INEGI ITER), ${fuera15.length} quedan a más de 15 minutos caminando de la unidad médica CLUES más cercana (mediana de ${fmtDec(medFueraCab)} min). Solo las 5 comisarías de 2,500 o más habitantes tienen centro de salud local (1.3 min).`;

  const ordenTipos = [
    "Subcomisaría / localidad < 500 hab.",
    "Comisaría / localidad 500–2,499 hab.",
    "Comisaría / localidad ≥ 2,500 hab.",
    "Cabecera municipal (Mérida)"
  ];
  const etiquetasCortas = {
    "Subcomisaría / localidad < 500 hab.": "Subcomisarías (< 500 hab.)",
    "Comisaría / localidad 500–2,499 hab.": "Comisarías (500–2,499)",
    "Comisaría / localidad ≥ 2,500 hab.": "Comisarías (≥ 2,500)",
    "Cabecera municipal (Mérida)": "Cabecera (Mérida)"
  };

  const grupos = ordenTipos.map(t => {
    const sub = filas.filter(d => d.tipo === t);
    return {
      tipo: etiquetasCortas[t],
      n: sub.length,
      mediana: d3.median(sub, d => d.min_pie) || 0,
      pctFuera: sub.length ? (100 * sub.filter(d => !d.en15).length) / sub.length : 0
    };
  });

  // Top 6 localidades pobladas (>= 500 hab.) más alejadas de una unidad médica CLUES
  const topLejanas = fueraCab
    .filter(d => d.poblacion >= 500)
    .sort((a, b) => b.dist_m - a.dist_m)
    .slice(0, 6);

  // viewBox 680 px => 12 px SVG = 9 pt reales al imprimir (>= 8 pt)
  const width = 680;
  const height = 435;

  const svg = d3.select("#grafica-escena-3")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Mediana de minutos a pie a la unidad médica CLUES por tipo de localidad y comisarías más alejadas en Mérida");

  // Panel superior: Mediana por tipo de localidad
  const labelW = 198;
  const barW = 300;
  const gTop = svg.append("g").attr("transform", `translate(${labelW}, 34)`);
  const topH = 148;

  gTop.append("text")
    .attr("x", -labelW + 4).attr("y", -12)
    .attr("font-size", 12.5).attr("font-weight", 700).attr("fill", TINTA)
    .text("Mediana de caminata a la unidad médica CLUES más cercana");

  const y1 = d3.scaleBand()
    .domain(grupos.map(d => d.tipo))
    .range([8, topH])
    .padding(0.28);

  const x1 = d3.scaleLinear()
    .domain([0, d3.max(grupos, d => d.mediana) * 1.15])
    .range([0, barW]);

  gTop.selectAll("rect")
    .data(grupos)
    .join("rect")
    .attr("x", 0)
    .attr("y", d => y1(d.tipo))
    .attr("width", d => Math.max(5, x1(d.mediana)))
    .attr("height", y1.bandwidth())
    .attr("rx", 3)
    .attr("fill", d => d.mediana > 15 ? MORADO : ORO);

  gTop.append("line")
    .attr("x1", x1(15)).attr("x2", x1(15))
    .attr("y1", 4).attr("y2", topH + 6)
    .attr("stroke", ORO_OSCURO).attr("stroke-dasharray", "4,3").attr("stroke-width", 1.6);

  gTop.append("text")
    .attr("x", x1(15) + 6).attr("y", topH + 4)
    .attr("font-size", 11.5).attr("font-weight", 700).attr("fill", ORO_OSCURO)
    .text("Umbral 15 min");

  gTop.selectAll("text.lbl-tipo")
    .data(grupos)
    .join("text")
    .attr("class", "lbl-tipo")
    .attr("x", -8)
    .attr("y", d => y1(d.tipo) + y1.bandwidth() / 2 + 4)
    .attr("text-anchor", "end")
    .attr("font-size", 11.5)
    .attr("fill", TINTA)
    .text(d => `${d.tipo} (n=${d.n})`);

  gTop.selectAll("text.val-tipo")
    .data(grupos)
    .join("text")
    .attr("class", "val-tipo")
    .attr("x", d => x1(d.mediana) + 8)
    .attr("y", d => y1(d.tipo) + y1.bandwidth() / 2 + 4)
    .attr("font-size", 11.5)
    .attr("font-weight", 700)
    .attr("fill", d => d.mediana > 15 ? MORADO : ORO_OSCURO)
    .text(d => `${fmtDec(d.mediana)} min (${fmtDec(d.pctFuera)} % > 15)`);

  svg.append("line")
    .attr("x1", 4).attr("x2", width - 4)
    .attr("y1", 206).attr("y2", 206)
    .attr("stroke", BORDE);

  // Panel inferior: Las 6 comisarías (>= 500 hab.) más alejadas en Mérida
  const gBot = svg.append("g").attr("transform", `translate(${labelW}, 240)`);
  const botH = 175;

  gBot.append("text")
    .attr("x", -labelW + 4).attr("y", -12)
    .attr("font-size", 12.5).attr("font-weight", 700).attr("fill", TINTA)
    .text("Comisarías de Mérida (≥ 500 hab.) más alejadas de una unidad médica CLUES");

  const y2 = d3.scaleBand()
    .domain(topLejanas.map(d => d.localidad))
    .range([6, botH])
    .padding(0.28);

  const x2 = d3.scaleLinear()
    .domain([0, d3.max(topLejanas, d => d.dist_m) * 1.15])
    .range([0, barW]);

  gBot.selectAll("rect")
    .data(topLejanas)
    .join("rect")
    .attr("x", 0)
    .attr("y", d => y2(d.localidad))
    .attr("width", d => x2(d.dist_m))
    .attr("height", y2.bandwidth())
    .attr("rx", 3)
    .attr("fill", (d, i) => i < 3 ? MORADO : GRIS);

  gBot.selectAll("text.lbl-loc")
    .data(topLejanas)
    .join("text")
    .attr("class", "lbl-loc")
    .attr("x", -8)
    .attr("y", d => y2(d.localidad) + y2.bandwidth() / 2 + 4)
    .attr("text-anchor", "end")
    .attr("font-size", 11.5)
    .attr("fill", TINTA)
    .text(d => `${d.localidad} (${fmtEntero(d.poblacion)})`);

  gBot.selectAll("text.val-loc")
    .data(topLejanas)
    .join("text")
    .attr("class", "val-loc")
    .attr("x", d => x2(d.dist_m) + 8)
    .attr("y", d => y2(d.localidad) + y2.bandwidth() / 2 + 4)
    .attr("font-size", 11.5)
    .attr("font-weight", (d, i) => i < 3 ? 700 : 500)
    .attr("fill", (d, i) => i < 3 ? MORADO : "#4b5563")
    .text(d => `${fmtKm(d.dist_m)} km (${fmtDec(d.min_pie)} min)`);
})();
