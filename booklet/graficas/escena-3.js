(async function renderEscena3() {
  const MORADO = "#600d8b";
  const ORO = "#ed9f22";
  const ORO_OSCURO = "#b45309";
  const GRIS = "#9ca3af";
  const TINTA = "#0d0d0d";
  const BORDE = "#e5e7eb";

  const fmtDec = d3.format(".1f");
  const fmtKm = v => d3.format(".1f")(v / 1000);

  const filas = await d3.csv("../datos/escena-3.csv", d => ({
    localidad: d.localidad,
    tipo: d.tipo_localidad,
    unidad: d.unidad_salud_cercana,
    dist_m: +d.distancia_salud_m,
    min_pie: +d.minutos_pie_salud,
    en15: String(d.en_umbral_15min_salud).toLowerCase() === "true"
  }));

  const fuera15 = filas.filter(d => !d.en15).length;
  const pctFuera15 = (100 * fuera15) / filas.length;
  const comisarias = filas.filter(d => d.tipo === "Comisaría" || d.tipo === "Subcomisaría / Ranchería");
  const urbanas = filas.filter(d => d.tipo === "Colonia / Fraccionamiento" || d.tipo === "Barrio / Zona urbana");
  const medComis = d3.median(comisarias, d => d.min_pie);
  const medUrb = d3.median(urbanas, d => d.min_pie);

  document.getElementById("titulo-escena").textContent =
    `${fmtDec(pctFuera15)} % de las localidades de Mérida rebasa los 15 minutos a pie al médico`;
  document.getElementById("lectura-escena").textContent =
    `De las ${filas.length} localidades dentro del municipio de Mérida, ${fuera15} quedan fuera del umbral de 15 minutos caminando. En las ${comisarias.length} comisarías y subcomisarías la mediana es de ${fmtDec(medComis)} minutos frente a ${fmtDec(medUrb)} minutos en colonias y barrios (${fmtDec(medComis / medUrb)} veces más lejos).`;

  // Agrupación por tipo de localidad
  const grupos = Array.from(
    d3.rollup(
      filas,
      v => ({
        n: v.length,
        mediana: d3.median(v, d => d.min_pie),
        pctFuera: (100 * v.filter(d => !d.en15).length) / v.length
      }),
      d => d.tipo
    ),
    ([tipo, stats]) => ({ tipo, ...stats })
  ).sort((a, b) => b.mediana - a.mediana);

  const topLejanas = filas.slice(0, 7);

  const width = 860;
  const height = 410;

  const svg = d3.select("#grafica-escena-3")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Comparativa de tiempo caminando a la unidad de salud por tipo de localidad y localidades más alejadas en Mérida");

  // Panel superior: Mediana por tipo de localidad con línea umbral de 15 min
  const gTop = svg.append("g").attr("transform", "translate(185, 32)");
  const topW = 630;
  const topH = 155;

  gTop.append("text")
    .attr("x", -180).attr("y", -12)
    .attr("font-size", 12.5).attr("font-weight", 700).attr("fill", TINTA)
    .text("Mediana de caminata a la unidad de salud por tipo de localidad");

  const y1 = d3.scaleBand()
    .domain(grupos.map(d => d.tipo))
    .range([4, topH])
    .padding(0.28);

  const x1 = d3.scaleLinear()
    .domain([0, d3.max(grupos, d => d.mediana) * 1.25])
    .range([0, topW - 110]);

  gTop.selectAll("rect")
    .data(grupos)
    .join("rect")
    .attr("x", 0)
    .attr("y", d => y1(d.tipo))
    .attr("width", d => Math.max(4, x1(d.mediana)))
    .attr("height", y1.bandwidth())
    .attr("rx", 3)
    .attr("fill", d => d.mediana > 15 ? MORADO : ORO);

  // Línea de umbral 15 minutos
  gTop.append("line")
    .attr("x1", x1(15)).attr("x2", x1(15))
    .attr("y1", 0).attr("y2", topH + 4)
    .attr("stroke", ORO_OSCURO).attr("stroke-dasharray", "4,3").attr("stroke-width", 1.6);

  gTop.append("text")
    .attr("x", x1(15) + 5).attr("y", 11)
    .attr("font-size", 10.5).attr("font-weight", 700).attr("fill", ORO_OSCURO)
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
    .attr("font-size", 11)
    .attr("font-weight", 700)
    .attr("fill", d => d.mediana > 15 ? MORADO : ORO_OSCURO)
    .text(d => `${fmtDec(d.mediana)} min (${fmtDec(d.pctFuera)} % > 15 min)`);

  // Separador
  svg.append("line")
    .attr("x1", 5).attr("x2", width - 5)
    .attr("y1", 210).attr("y2", 210)
    .attr("stroke", BORDE);

  // Panel inferior: Las 7 localidades más alejadas dentro de Mérida
  const gBot = svg.append("g").attr("transform", "translate(185, 240)");
  const botH = 152;

  gBot.append("text")
    .attr("x", -180).attr("y", -10)
    .attr("font-size", 12.5).attr("font-weight", 700).attr("fill", TINTA)
    .text("Las 7 localidades dentro de Mérida más alejadas de una unidad de salud");

  const y2 = d3.scaleBand()
    .domain(topLejanas.map(d => d.localidad))
    .range([4, botH])
    .padding(0.28);

  const x2 = d3.scaleLinear()
    .domain([0, d3.max(topLejanas, d => d.dist_m) * 1.25])
    .range([0, topW - 110]);

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
    .attr("font-size", 11.2)
    .attr("fill", TINTA)
    .text(d => d.localidad);

  gBot.selectAll("text.val-loc")
    .data(topLejanas)
    .join("text")
    .attr("class", "val-loc")
    .attr("x", d => x2(d.dist_m) + 8)
    .attr("y", d => y2(d.localidad) + y2.bandwidth() / 2 + 4)
    .attr("font-size", 11)
    .attr("font-weight", (d, i) => i < 3 ? 700 : 500)
    .attr("fill", (d, i) => i < 3 ? MORADO : "#4b5563")
    .text(d => `${fmtKm(d.dist_m)} km (${fmtDec(d.min_pie)} min a pie)`);
})();
