(async function renderEscena4() {
  const MORADO = "#600d8b";
  const ORO = "#ed9f22";
  const ORO_OSCURO = "#b45309";
  const GRIS = "#9ca3af";
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

  const confTotal = d3.max(filas, d => d.conf_acum);
  const defTotal = d3.max(filas, d => d.def_acum);
  const pico = filas.reduce((a, b) => (b.confirmados > a.confirmados ? b : a), filas[0]);

  document.getElementById("titulo-escena").textContent =
    `Yucatán acumuló ${fmtEntero(confTotal)} casos confirmados y ${fmtEntero(defTotal)} defunciones hasta junio de 2021`;
  document.getElementById("lectura-escena").textContent =
    `El pico mensual se registró en ${pico.etiqueta} con ${fmtEntero(pico.confirmados)} casos confirmados y ${fmtEntero(pico.defunciones)} defunciones en un solo mes; los datos corresponden a las primeras olas previas a Ómicron.`;

  const width = 860;
  const height = 385;
  const margin = { top: 44, right: 64, bottom: 56, left: 60 };
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
    .domain([0, d3.max(filas, d => d.confirmados) * 1.18])
    .nice()
    .range([innerH, 0]);

  const yDef = d3.scaleLinear()
    .domain([0, d3.max(filas, d => d.defunciones) * 1.25])
    .nice()
    .range([innerH, 0]);

  // Rejilla
  g.append("g")
    .selectAll("line")
    .data(yConf.ticks(5))
    .join("line")
    .attr("x1", 0).attr("x2", innerW)
    .attr("y1", d => yConf(d)).attr("y2", d => yConf(d))
    .attr("stroke", BORDE);

  // Ejes
  g.append("g")
    .attr("transform", `translate(0, ${innerH})`)
    .call(d3.axisBottom(x).tickSize(0))
    .call(ax => ax.select(".domain").attr("stroke", "#d1d5db"))
    .selectAll("text")
    .attr("dy", "1.1em")
    .attr("font-size", 10.2)
    .attr("fill", TINTA)
    .attr("transform", "rotate(-28)")
    .style("text-anchor", "end");

  g.append("g")
    .call(d3.axisLeft(yConf).ticks(5).tickFormat(fmtEntero).tickSize(0))
    .call(ax => ax.select(".domain").remove())
    .selectAll("text")
    .attr("font-size", 10.5)
    .attr("fill", MORADO);

  g.append("g")
    .attr("transform", `translate(${innerW}, 0)`)
    .call(d3.axisRight(yDef).ticks(5).tickFormat(fmtEntero).tickSize(0))
    .call(ax => ax.select(".domain").remove())
    .selectAll("text")
    .attr("font-size", 10.5)
    .attr("fill", ORO_OSCURO);

  // Títulos de ejes
  g.append("text").attr("x", 0).attr("y", -18)
    .attr("font-size", 11.5).attr("font-weight", 700).attr("fill", MORADO)
    .text("Confirmados mensuales (barras)");
  g.append("text").attr("x", innerW).attr("y", -18)
    .attr("text-anchor", "end")
    .attr("font-size", 11.5).attr("font-weight", 700).attr("fill", ORO_OSCURO)
    .text("Defunciones mensuales (línea oro)");

  // Barras: confirmados nuevos (pico en morado, resto en gris)
  g.selectAll("rect")
    .data(filas)
    .join("rect")
    .attr("x", d => x(d.etiqueta))
    .attr("y", d => yConf(d.confirmados))
    .attr("width", x.bandwidth())
    .attr("height", d => innerH - yConf(d.confirmados))
    .attr("rx", 3)
    .attr("fill", d => d.anio_mes === pico.anio_mes ? MORADO : "#d1c4dc");

  // Línea oro: defunciones mensuales
  const line = d3.line()
    .x(d => x(d.etiqueta) + x.bandwidth() / 2)
    .y(d => yDef(d.defunciones))
    .curve(d3.curveMonotoneX);

  g.append("path")
    .datum(filas)
    .attr("fill", "none")
    .attr("stroke", ORO)
    .attr("stroke-width", 2.6)
    .attr("d", line);

  g.selectAll("circle")
    .data(filas)
    .join("circle")
    .attr("cx", d => x(d.etiqueta) + x.bandwidth() / 2)
    .attr("cy", d => yDef(d.defunciones))
    .attr("r", d => d.anio_mes === pico.anio_mes ? 4.8 : 3)
    .attr("fill", d => d.anio_mes === pico.anio_mes ? ORO_OSCURO : ORO)
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 1.2);

  // Etiqueta directa del pico (Jul 20)
  const px = x(pico.etiqueta) + x.bandwidth() / 2;
  g.append("text")
    .attr("x", px).attr("y", yConf(pico.confirmados) - 8)
    .attr("text-anchor", "middle")
    .attr("font-size", 11.5).attr("font-weight", 700).attr("fill", MORADO)
    .text(`Pico: ${fmtEntero(pico.confirmados)} casos`);

  g.append("text")
    .attr("x", px + 14).attr("y", yDef(pico.defunciones) + 4)
    .attr("font-size", 10.8).attr("font-weight", 700).attr("fill", ORO_OSCURO)
    .text(`${fmtEntero(pico.defunciones)} def.`);

  // Etiqueta directa del último mes con datos (Jun 21)
  const ult = filas[filas.length - 1];
  const ux = x(ult.etiqueta) + x.bandwidth() / 2;
  g.append("text")
    .attr("x", ux).attr("y", yConf(ult.confirmados) - 8)
    .attr("text-anchor", "end")
    .attr("font-size", 10.5).attr("font-weight", 600).attr("fill", "#4b5563")
    .text(`${ult.etiqueta}: ${fmtEntero(ult.confirmados)}`);
})();
