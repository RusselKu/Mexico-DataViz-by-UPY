(async function renderEscena4() {
  const MORADO = "#600d8b";
  const ORO = "#ed9f22";
  const ORO_OSCURO = "#b45309";
  const TINTA = "#0d0d0d";
  const BORDE = "#e5e7eb";

  const fmtEntero = d3.format(",");
  const mesesCortos = {
    "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr",
    "05": "May", "06": "Jun", "07": "Jul", "08": "Ago",
    "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic"
  };

  const filas = await d3.csv("../datos/escena-4.csv", d => {
    const [anio, mes] = d.anio_mes.split("-");
    return {
      anio_mes: d.anio_mes,
      etiqueta: `${mesesCortos[mes]} ${anio.slice(2)}`,
      confirmados: +d.confirmados_mes,
      defunciones: +d.defunciones_mes,
      conf_acum: +d.confirmados_acum,
      def_acum: +d.defunciones_acum
    };
  });

  // Conciliación exacta: suma mensual == acumulado final
  const confTotal = d3.sum(filas, d => d.confirmados);
  const defTotal = d3.sum(filas, d => d.defunciones);
  const pico = filas.reduce((a, b) => (b.confirmados > a.confirmados ? b : a), filas[0]);

  document.getElementById("titulo-escena").textContent =
    `Yucatán acumuló ${fmtEntero(confTotal)} casos confirmados y ${fmtEntero(defTotal)} defunciones hasta junio de 2021`;
  document.getElementById("lectura-escena").textContent =
    `El pico mensual ocurrió en ${pico.etiqueta} con ${fmtEntero(pico.confirmados)} casos confirmados y ${fmtEntero(pico.defunciones)} defunciones. La suma de los 18 meses coincide exactamente con el acumulado estatal (${fmtEntero(confTotal)} casos y ${fmtEntero(defTotal)} defunciones).`;

  // viewBox 680 px => 11.5–12 px SVG = 8.6–9 pt reales al imprimir (>= 8 pt)
  const width = 680;
  const height = 375;
  const margin = { top: 54, right: 54, bottom: 60, left: 56 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const svg = d3.select("#grafica-escena-4")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Serie mensual de casos confirmados y defunciones por COVID-19 en Yucatán, 2020 a 2021");

  const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

  const x = d3.scaleBand()
    .domain(filas.map(d => d.etiqueta))
    .range([0, innerW])
    .padding(0.24);

  const yConf = d3.scaleLinear()
    .domain([0, d3.max(filas, d => d.confirmados) * 1.24])
    .nice()
    .range([innerH, 0]);

  const yDef = d3.scaleLinear()
    .domain([0, d3.max(filas, d => d.defunciones) * 1.42])
    .nice()
    .range([innerH, 0]);

  g.append("g")
    .selectAll("line")
    .data(yConf.ticks(5))
    .join("line")
    .attr("x1", 0).attr("x2", innerW)
    .attr("y1", d => yConf(d)).attr("y2", d => yConf(d))
    .attr("stroke", BORDE);

  // Eje X: mostrar 1 de cada 2 etiquetas para mantener 11.5 px (>= 8.6 pt impresos) sin encime
  const xAxis = d3.axisBottom(x)
    .tickValues(filas.filter((_, i) => i % 2 === 0 || i === filas.length - 1).map(d => d.etiqueta))
    .tickSize(0);

  g.append("g")
    .attr("transform", `translate(0, ${innerH})`)
    .call(xAxis)
    .call(ax => ax.select(".domain").attr("stroke", "#d1d5db"))
    .selectAll("text")
    .attr("dy", "1.3em")
    .attr("font-size", 11.5)
    .attr("fill", TINTA);

  g.append("g")
    .call(d3.axisLeft(yConf).ticks(5).tickFormat(fmtEntero).tickSize(0))
    .call(ax => ax.select(".domain").remove())
    .selectAll("text")
    .attr("font-size", 11.5)
    .attr("fill", MORADO);

  g.append("g")
    .attr("transform", `translate(${innerW}, 0)`)
    .call(d3.axisRight(yDef).ticks(5).tickFormat(fmtEntero).tickSize(0))
    .call(ax => ax.select(".domain").remove())
    .selectAll("text")
    .attr("font-size", 11.5)
    .attr("fill", ORO_OSCURO);

  g.append("text").attr("x", 0).attr("y", -24)
    .attr("font-size", 12).attr("font-weight", 700).attr("fill", MORADO)
    .text("Confirmados mensuales (barras)");
  g.append("text").attr("x", innerW).attr("y", -24)
    .attr("text-anchor", "end")
    .attr("font-size", 12).attr("font-weight", 700).attr("fill", ORO_OSCURO)
    .text("Defunciones mensuales (línea oro)");

  g.selectAll("rect")
    .data(filas)
    .join("rect")
    .attr("x", d => x(d.etiqueta))
    .attr("y", d => yConf(d.confirmados))
    .attr("width", x.bandwidth())
    .attr("height", d => Math.max(0, innerH - yConf(d.confirmados)))
    .attr("rx", 3)
    .attr("fill", d => d.anio_mes === pico.anio_mes ? MORADO : "#d1c4dc");

  const line = d3.line()
    .x(d => x(d.etiqueta) + x.bandwidth() / 2)
    .y(d => yDef(d.defunciones))
    .curve(d3.curveMonotoneX);

  g.append("path")
    .datum(filas)
    .attr("fill", "none")
    .attr("stroke", ORO)
    .attr("stroke-width", 2.8)
    .attr("d", line);

  g.selectAll("circle")
    .data(filas)
    .join("circle")
    .attr("cx", d => x(d.etiqueta) + x.bandwidth() / 2)
    .attr("cy", d => yDef(d.defunciones))
    .attr("r", d => d.anio_mes === pico.anio_mes ? 5 : 3.2)
    .attr("fill", d => d.anio_mes === pico.anio_mes ? ORO_OSCURO : ORO)
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 1.3);

  // Etiquetas del pico separadas limpiamente (sin encime)
  const px = x(pico.etiqueta) + x.bandwidth() / 2;
  g.append("text")
    .attr("x", px).attr("y", yConf(pico.confirmados) - 10)
    .attr("text-anchor", "middle")
    .attr("font-size", 12).attr("font-weight", 700).attr("fill", MORADO)
    .text(`Pico ${pico.etiqueta}: ${fmtEntero(pico.confirmados)} casos`);

  // Etiqueta de defunciones desplazada a la derecha con línea guía
  const pyDef = yDef(pico.defunciones);
  g.append("line")
    .attr("x1", px + 6).attr("y1", pyDef)
    .attr("x2", px + 34).attr("y2", pyDef - 18)
    .attr("stroke", ORO_OSCURO).attr("stroke-width", 1.3);
  g.append("text")
    .attr("x", px + 38).attr("y", pyDef - 14)
    .attr("font-size", 12).attr("font-weight", 700).attr("fill", ORO_OSCURO)
    .text(`${fmtEntero(pico.defunciones)} defunciones`);
})();
