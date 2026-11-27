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
      jurisdiccion: d.jurisdiccion_sanitaria,
      poblacion: +d.poblacion_total,
      hospitales: +d.hospitales,
      clinicas: +d.clinicas,
      farmacias: +d.farmacias,
      total: +d.total_unidades_salud,
      tasa10k: +d.unidades_por_10mil_hab
    })),
    d3.json("../datos/yucatan_municipios.geojson")
  ]);

  const totalUnidades = d3.sum(filas, d => d.total);
  const merida = filas.find(d => d.cvegeo === "31050");
  const pctMerida = (100 * merida.total) / totalUnidades;
  const munCero = filas.filter(d => d.total === 0).length;

  document.getElementById("titulo-escena").textContent =
    `Mérida concentra ${fmtDec(pctMerida)} % de las unidades de salud de Yucatán: ${fmtEntero(merida.total)} de ${fmtEntero(totalUnidades)}`;
  document.getElementById("lectura-escena").textContent =
    `El mapa estatal evidencia la centralización en Mérida (${fmtEntero(merida.total)} unidades), seguida por Valladolid (${fmtEntero(filas[1].total)}) y Tizimín (${fmtEntero(filas[2].total)}); en contraste, ${munCero} de los ${filas.length} municipios no registran ninguna unidad en la cartografía abierta.`;

  const mapaDatos = new Map(filas.map(d => [d.cvegeo, d]));
  const width = 860;
  const height = 400;

  const svg = d3.select("#grafica-escena-1")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Mapa coroplético de unidades de salud por municipio en Yucatán y barras de los municipios con más registros");

  // Panel izquierdo: Mapa coroplético de los 106 municipios (blanco -> morado)
  const mapG = svg.append("g").attr("transform", "translate(10, 12)");
  const projection = d3.geoMercator().fitSize([430, 320], geo);
  const path = d3.geoPath(projection);

  const colorScale = d3.scaleSqrt()
    .domain([0, merida.total])
    .range(["#ffffff", MORADO]);

  mapG.selectAll("path")
    .data(geo.features)
    .join("path")
    .attr("d", path)
    .attr("fill", d => {
      const cve = String(d.properties.cvegeo).padStart(5, "0");
      const rec = mapaDatos.get(cve);
      return rec && rec.total > 0 ? colorScale(rec.total) : "#f9fafb";
    })
    .attr("stroke", d => String(d.properties.cvegeo).padStart(5, "0") === "31050" ? ORO_OSCURO : "#d1d5db")
    .attr("stroke-width", d => String(d.properties.cvegeo).padStart(5, "0") === "31050" ? 1.8 : 0.6);

  // Etiqueta directa sobre Mérida en el mapa
  const meridaFeat = geo.features.find(f => String(f.properties.cvegeo).padStart(5, "0") === "31050");
  if (meridaFeat) {
    const [mx, my] = path.centroid(meridaFeat);
    mapG.append("line")
      .attr("x1", mx).attr("y1", my)
      .attr("x2", mx - 48).attr("y2", my - 42)
      .attr("stroke", ORO_OSCURO).attr("stroke-width", 1.3);
    mapG.append("text")
      .attr("x", mx - 52).attr("y", my - 46)
      .attr("text-anchor", "end")
      .attr("font-size", 11.5).attr("font-weight", 700).attr("fill", MORADO)
      .text(`Mérida: ${fmtEntero(merida.total)} (${fmtDec(pctMerida)} %)`);
  }

  // Leyenda continua del mapa (blanco a morado)
  const defs = svg.append("defs");
  const grad = defs.append("linearGradient").attr("id", "grad-morado-e1");
  grad.append("stop").attr("offset", "0%").attr("stop-color", "#ffffff");
  grad.append("stop").attr("offset", "100%").attr("stop-color", MORADO);

  const legG = mapG.append("g").attr("transform", "translate(16, 336)");
  legG.append("text").attr("y", -6).attr("font-size", 10.5).attr("font-weight", 600).attr("fill", TINTA)
    .text("Unidades de salud por municipio");
  legG.append("rect").attr("width", 180).attr("height", 10).attr("rx", 2)
    .attr("fill", "url(#grad-morado-e1)").attr("stroke", "#d1d5db");
  legG.append("text").attr("x", 0).attr("y", 23).attr("font-size", 10).attr("fill", "#4b5563").text("0");
  legG.append("text").attr("x", 180).attr("y", 23).attr("text-anchor", "end").attr("font-size", 10).attr("fill", "#4b5563")
    .text(fmtEntero(merida.total));
  legG.append("text").attr("x", 200).attr("y", 10).attr("font-size", 10.5).attr("fill", ORO_OSCURO).attr("font-weight", 600)
    .text(`${munCero} municipios con 0 registros`);

  // Panel derecho: Top 8 municipios (barras horizontales con etiquetas directas)
  const top8 = filas.slice(0, 8);
  const barG = svg.append("g").attr("transform", "translate(475, 28)");
  const barW = 345;
  const barH = 310;

  barG.append("text")
    .attr("x", 0).attr("y", -10)
    .attr("font-size", 12.5).attr("font-weight", 700).attr("fill", TINTA)
    .text("Municipios con más unidades registradas");

  const y = d3.scaleBand()
    .domain(top8.map(d => d.municipio))
    .range([8, barH])
    .padding(0.28);

  const x = d3.scaleLinear()
    .domain([0, merida.total * 1.18])
    .range([0, barW - 95]);

  barG.append("g")
    .selectAll("line")
    .data(x.ticks(4))
    .join("line")
    .attr("x1", d => 95 + x(d)).attr("x2", d => 95 + x(d))
    .attr("y1", 8).attr("y2", barH)
    .attr("stroke", BORDE);

  barG.selectAll("rect")
    .data(top8)
    .join("rect")
    .attr("x", 95)
    .attr("y", d => y(d.municipio))
    .attr("width", d => Math.max(3, x(d.total)))
    .attr("height", y.bandwidth())
    .attr("rx", 3)
    .attr("fill", (d, i) => d.cvegeo === "31050" ? MORADO : (i === 1 ? ORO : GRIS));

  barG.selectAll("text.mun-label")
    .data(top8)
    .join("text")
    .attr("class", "mun-label")
    .attr("x", 88)
    .attr("y", d => y(d.municipio) + y.bandwidth() / 2 + 4)
    .attr("text-anchor", "end")
    .attr("font-size", 11.5)
    .attr("font-weight", d => d.cvegeo === "31050" ? 700 : 500)
    .attr("fill", TINTA)
    .text(d => d.municipio);

  barG.selectAll("text.val-label")
    .data(top8)
    .join("text")
    .attr("class", "val-label")
    .attr("x", d => 95 + x(d.total) + 6)
    .attr("y", d => y(d.municipio) + y.bandwidth() / 2 + 4)
    .attr("font-size", 11)
    .attr("font-weight", d => d.cvegeo === "31050" ? 700 : 600)
    .attr("fill", (d, i) => d.cvegeo === "31050" ? MORADO : (i === 1 ? ORO_OSCURO : "#4b5563"))
    .text(d => `${fmtEntero(d.total)} (${fmtDec(d.tasa10k)} / 10 mil hab.)`);

  // Nota de color fijo
  barG.append("text")
    .attr("x", 95).attr("y", barH + 28)
    .attr("font-size", 10.5).attr("fill", "#4b5563")
    .text("Morado: Mérida (foco) · Oro: 2.º polo estatal (Valladolid) · Gris: resto");
})();
