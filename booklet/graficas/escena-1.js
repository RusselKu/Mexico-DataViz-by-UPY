(async function renderEscena1() {
  const MORADO = "#600d8b";
  const ORO = "#ed9f22";
  const ORO_OSCURO = "#b45309";
  const GRIS = "#9ca3af";
  const TINTA = "#0d0d0d";
  const BORDE = "#e5e7eb";

  const fmtEntero = d3.format(",");
  const fmtDec = d3.format(".1f");

  const [filas, geo] = await Promise.all([
    d3.csv("../datos/escena-1.csv", d => ({
      cvegeo: String(d.cvegeo).padStart(5, "0"),
      municipio: d.municipio,
      poblacion: +d.poblacion_total,
      unidades: +d.unidades_medicas,
      hospitales: +d.hospitales,
      publicas: +d.unidades_publicas,
      privadas: +d.unidades_privadas,
      tasa10k: +d.unidades_por_10mil_hab
    })),
    d3.json("../datos/yucatan_municipios.geojson")
  ]);

  const totalUnidades = d3.sum(filas, d => d.unidades);
  const totalHosp = d3.sum(filas, d => d.hospitales);
  const merida = filas.find(d => d.cvegeo === "31050");
  const pctMerida = (100 * merida.unidades) / totalUnidades;
  const pctHospMerida = (100 * merida.hospitales) / totalHosp;
  const munSinHosp = filas.filter(d => d.hospitales === 0).length;

  document.getElementById("titulo-escena").textContent =
    `Mérida concentra ${fmtDec(pctMerida)} % de las unidades médicas de Yucatán (${fmtEntero(merida.unidades)} de ${fmtEntero(totalUnidades)}) y ${fmtDec(pctHospMerida)} % de los hospitales`;
  document.getElementById("lectura-escena").textContent =
    `Aunque los 106 municipios tienen al menos una unidad de consulta externa en CLUES, ${munSinHosp} de 106 no cuentan con hospital; además, en Mérida ${fmtEntero(merida.privadas)} de sus ${fmtEntero(merida.unidades)} unidades son privadas y solo ${fmtEntero(merida.publicas)} son públicas.`;

  const mapaDatos = new Map(filas.map(d => [d.cvegeo, d]));
  // viewBox 680 px => en hoja carta (~510 pt) 12 px SVG = 9 pt reales (>= 8 pt exigido)
  const width = 680;
  const height = 430;

  const svg = d3.select("#grafica-escena-1")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Mapa coroplético de unidades médicas CLUES por municipio en Yucatán y barras de los 7 municipios con más unidades");

  // Panel izquierdo: Mapa coroplético (0..340)
  const mapG = svg.append("g").attr("transform", "translate(8, 34)");
  const projection = d3.geoMercator().fitSize([325, 290], geo);
  const path = d3.geoPath(projection);

  const colorScale = d3.scaleSqrt()
    .domain([1, merida.unidades])
    .range(["#f5eef8", MORADO]);

  mapG.selectAll("path")
    .data(geo.features)
    .join("path")
    .attr("d", path)
    .attr("fill", d => {
      const rec = mapaDatos.get(String(d.properties.cvegeo).padStart(5, "0"));
      return rec && rec.unidades > 0 ? colorScale(rec.unidades) : "#ffffff";
    })
    .attr("stroke", d => String(d.properties.cvegeo).padStart(5, "0") === "31050" ? ORO_OSCURO : "#d1d5db")
    .attr("stroke-width", d => String(d.properties.cvegeo).padStart(5, "0") === "31050" ? 1.8 : 0.6);

  // Etiqueta directa sobre Mérida dentro de márgenes seguros
  const meridaFeat = geo.features.find(f => String(f.properties.cvegeo).padStart(5, "0") === "31050");
  if (meridaFeat) {
    const [mx, my] = path.centroid(meridaFeat);
    mapG.append("line")
      .attr("x1", mx).attr("y1", my)
      .attr("x2", mx).attr("y2", 8)
      .attr("stroke", ORO_OSCURO).attr("stroke-width", 1.4);
    mapG.append("text")
      .attr("x", 6).attr("y", -6)
      .attr("font-size", 12).attr("font-weight", 700).attr("fill", MORADO)
      .text(`Mérida: ${fmtEntero(merida.unidades)} unid. (${fmtDec(pctMerida)} %)`);
  }

  // Leyenda continua del mapa (blanco a morado)
  const defs = svg.append("defs");
  const grad = defs.append("linearGradient").attr("id", "grad-morado-e1");
  grad.append("stop").attr("offset", "0%").attr("stop-color", "#f5eef8");
  grad.append("stop").attr("offset", "100%").attr("stop-color", MORADO);

  const legG = mapG.append("g").attr("transform", "translate(8, 314)");
  legG.append("text").attr("y", 0).attr("font-size", 11.5).attr("font-weight", 600).attr("fill", TINTA)
    .text("Unidades médicas CLUES por municipio");
  legG.append("rect").attr("y", 8).attr("width", 190).attr("height", 11).attr("rx", 2)
    .attr("fill", "url(#grad-morado-e1)").attr("stroke", "#d1d5db");
  legG.append("text").attr("x", 0).attr("y", 34).attr("font-size", 11.5).attr("fill", "#4b5563").text("1");
  legG.append("text").attr("x", 190).attr("y", 34).attr("text-anchor", "end").attr("font-size", 11.5).attr("fill", "#4b5563")
    .text(fmtEntero(merida.unidades));
  legG.append("text").attr("x", 0).attr("y", 54).attr("font-size", 11.5).attr("fill", ORO_OSCURO).attr("font-weight", 700)
    .text(`${munSinHosp} de 106 municipios no tienen hospital`);

  // Panel derecho: Top 7 municipios (355..672) con amplio margen para etiquetas sin cortes
  const top7 = filas.slice(0, 7);
  const barG = svg.append("g").attr("transform", "translate(352, 34)");
  const labelW = 78;
  const barAreaW = 242;
  const barH = 305;

  barG.append("text")
    .attr("x", 0).attr("y", -6)
    .attr("font-size", 12.5).attr("font-weight", 700).attr("fill", TINTA)
    .text("Top 7 municipios (CLUES en operación)");

  const y = d3.scaleBand()
    .domain(top7.map(d => d.municipio))
    .range([14, barH])
    .padding(0.28);

  const x = d3.scaleLinear()
    .domain([0, merida.unidades * 1.55])
    .range([0, barAreaW]);

  barG.append("g")
    .selectAll("line")
    .data(x.ticks(3))
    .join("line")
    .attr("x1", d => labelW + x(d)).attr("x2", d => labelW + x(d))
    .attr("y1", 14).attr("y2", barH)
    .attr("stroke", BORDE);

  barG.selectAll("rect")
    .data(top7)
    .join("rect")
    .attr("x", labelW)
    .attr("y", d => y(d.municipio))
    .attr("width", d => Math.max(4, x(d.unidades)))
    .attr("height", y.bandwidth())
    .attr("rx", 3)
    .attr("fill", (d, i) => d.cvegeo === "31050" ? MORADO : (i === 1 ? ORO : GRIS));

  barG.selectAll("text.mun-label")
    .data(top7)
    .join("text")
    .attr("class", "mun-label")
    .attr("x", labelW - 6)
    .attr("y", d => y(d.municipio) + y.bandwidth() / 2 + 4)
    .attr("text-anchor", "end")
    .attr("font-size", 12)
    .attr("font-weight", d => d.cvegeo === "31050" ? 700 : 500)
    .attr("fill", TINTA)
    .text(d => d.municipio);

  barG.selectAll("text.val-label")
    .data(top7)
    .join("text")
    .attr("class", "val-label")
    .attr("x", d => labelW + x(d.unidades) + 6)
    .attr("y", d => y(d.municipio) + y.bandwidth() / 2 + 4)
    .attr("font-size", 11.5)
    .attr("font-weight", d => d.cvegeo === "31050" ? 700 : 600)
    .attr("fill", (d, i) => d.cvegeo === "31050" ? MORADO : (i === 1 ? ORO_OSCURO : "#4b5563"))
    .text(d => `${fmtEntero(d.unidades)} (${d.hospitales} hosp.)`);

  barG.append("text")
    .attr("x", 0).attr("y", barH + 34)
    .attr("font-size", 11.5).attr("fill", "#4b5563")
    .text("Morado: Mérida · Oro: 2.º polo · Gris: resto");
})();
