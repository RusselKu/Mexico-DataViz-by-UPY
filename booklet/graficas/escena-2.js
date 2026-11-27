(async function renderEscena2() {
  const MORADO = "#600d8b";
  const ORO = "#ed9f22";
  const ORO_OSCURO = "#b45309";
  const GRIS = "#9ca3af";
  const TINTA = "#0d0d0d";
  const BORDE = "#e5e7eb";

  const fmtEntero = d3.format(",");
  const fmtDec = d3.format(".1f");

  const filas = await d3.csv("../datos/escena-2.csv", d => ({
    cve_ageb: d.cve_ageb,
    codigo_ageb: d.codigo_ageb,
    poblacion: +d.poblacion_total,
    sin_afiliacion: +d.poblacion_sin_afiliacion,
    pct: +d.pct_sin_afiliacion
  }));

  const pobTotal = d3.sum(filas, d => d.poblacion);
  const sinAfilTotal = d3.sum(filas, d => d.sin_afiliacion);
  const pctMerida = (100 * sinAfilTotal) / pobTotal;
  const agebAltas = filas.filter(d => d.pct >= 30).length;

  document.getElementById("titulo-escena").textContent =
    `${fmtEntero(sinAfilTotal)} personas en las AGEB urbanas de Mérida (${fmtDec(pctMerida)} %) no tienen afiliación médica`;
  document.getElementById("lectura-escena").textContent =
    `El promedio de las ${fmtEntero(filas.length)} AGEB urbanas de Mérida (${fmtDec(pctMerida)} %) oculta brechas internas: ${agebAltas} AGEB superan el 30 % de habitantes sin afiliación a servicios de salud.`;

  // Histograma en rangos de 5 puntos porcentuales (0 a 60%)
  const bins = [
    { rango: "0–10 %", min: 0, max: 10 },
    { rango: "10–15 %", min: 10, max: 15 },
    { rango: "15–20 %", min: 15, max: 20 },
    { rango: "20–25 %", min: 20, max: 25 },
    { rango: "25–30 %", min: 25, max: 30 },
    { rango: "30–35 %", min: 30, max: 35 },
    { rango: "35–40 %", min: 35, max: 40 },
    { rango: "40 % o más", min: 40, max: 101 }
  ].map(b => {
    const sub = filas.filter(d => d.pct >= b.min && d.pct < b.max);
    return {
      ...b,
      agebs: sub.length,
      personas_sin: d3.sum(sub, d => d.sin_afiliacion),
      es_critico: b.min >= 30,
      es_promedio: b.min === 20
    };
  });

  const width = 860;
  const height = 380;
  const margin = { top: 44, right: 28, bottom: 64, left: 56 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const svg = d3.select("#grafica-escena-2")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Histograma de AGEB urbanas de Mérida por porcentaje de población sin afiliación médica");

  const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

  const x = d3.scaleBand()
    .domain(bins.map(d => d.rango))
    .range([0, innerW])
    .padding(0.24);

  const y = d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.agebs) * 1.2])
    .nice()
    .range([innerH, 0]);

  // Rejilla horizontal
  g.append("g")
    .selectAll("line")
    .data(y.ticks(5))
    .join("line")
    .attr("x1", 0).attr("x2", innerW)
    .attr("y1", d => y(d)).attr("y2", d => y(d))
    .attr("stroke", BORDE);

  // Ejes
  g.append("g")
    .attr("transform", `translate(0, ${innerH})`)
    .call(d3.axisBottom(x).tickSize(0))
    .call(ax => ax.select(".domain").attr("stroke", "#d1d5db"))
    .selectAll("text")
    .attr("dy", "1.2em")
    .attr("font-size", 11.5)
    .attr("fill", TINTA);

  g.append("g")
    .call(d3.axisLeft(y).ticks(5).tickSize(0))
    .call(ax => ax.select(".domain").remove())
    .selectAll("text")
    .attr("font-size", 11)
    .attr("fill", "#4b5563");

  g.append("text")
    .attr("x", -margin.left + 4).attr("y", -18)
    .attr("font-size", 11.5).attr("font-weight", 600).attr("fill", "#4b5563")
    .text("Número de AGEB urbanas");

  // Barras (Morado: >=30% foco crítico; Oro: rango del promedio municipal 20-25%; Gris: resto)
  g.selectAll("rect")
    .data(bins)
    .join("rect")
    .attr("x", d => x(d.rango))
    .attr("y", d => y(d.agebs))
    .attr("width", x.bandwidth())
    .attr("height", d => innerH - y(d.agebs))
    .attr("rx", 4)
    .attr("fill", d => d.es_critico ? MORADO : (d.es_promedio ? ORO : GRIS));

  // Etiquetas directas sobre cada barra
  g.selectAll("text.bar-val")
    .data(bins)
    .join("text")
    .attr("class", "bar-val")
    .attr("x", d => x(d.rango) + x.bandwidth() / 2)
    .attr("y", d => y(d.agebs) - 8)
    .attr("text-anchor", "middle")
    .attr("font-size", 11.5)
    .attr("font-weight", 700)
    .attr("fill", d => d.es_critico ? MORADO : (d.es_promedio ? ORO_OSCURO : "#4b5563"))
    .text(d => fmtEntero(d.agebs));

  // Anotación directa del bloque crítico (>=30 %)
  const xUmbral = x("30–35 %") - x.step() * 0.12;
  g.append("line")
    .attr("x1", xUmbral).attr("x2", xUmbral)
    .attr("y1", 4).attr("y2", innerH)
    .attr("stroke", MORADO).attr("stroke-dasharray", "4,4").attr("stroke-width", 1.5);

  g.append("text")
    .attr("x", xUmbral + 8).attr("y", 16)
    .attr("font-size", 11.5).attr("font-weight", 700).attr("fill", MORADO)
    .text(`${agebAltas} AGEB con 30 % o más sin afiliación`);

  // Anotación del rango del promedio municipal
  g.append("text")
    .attr("x", x("20–25 %") + x.bandwidth() / 2).attr("y", -18)
    .attr("text-anchor", "middle")
    .attr("font-size", 11.5).attr("font-weight", 700).attr("fill", ORO_OSCURO)
    .text(`Promedio Mérida: ${fmtDec(pctMerida)} % (oro)`);

  // Etiqueta del eje X
  g.append("text")
    .attr("x", innerW / 2).attr("y", innerH + 46)
    .attr("text-anchor", "middle")
    .attr("font-size", 11.5).attr("fill", "#4b5563")
    .text("Porcentaje de población sin afiliación a servicios de salud por AGEB (Censo 2020)");
})();
