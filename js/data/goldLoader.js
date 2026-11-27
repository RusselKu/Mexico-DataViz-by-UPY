/**
 * Cargador dinámico de datos reales (Capas Gold y Silver)
 * Lee directamente los CSV y JSON verificados desde ./data/gold/ y ./data/silver/
 * Proyecto: El Viaje de la Resiliencia (Equipo 3 · UPY)
 */
window.DataStoryApp = window.DataStoryApp || {};

window.DataStoryApp.goldLoader = (function() {
  const fmtInt = (n) => Number(n || 0).toLocaleString("es-MX");
  const fmtDec = (n, d = 1) => Number(n || 0).toLocaleString("es-MX", {
    minimumFractionDigits: d,
    maximumFractionDigits: d
  });

  async function safeCsv(path) {
    try {
      return await d3.csv(path);
    } catch (err) {
      console.warn("No se pudo cargar CSV:", path, err);
      return null;
    }
  }

  async function safeJson(path) {
    try {
      return await d3.json(path);
    } catch (err) {
      console.warn("No se pudo cargar JSON:", path, err);
      return null;
    }
  }

  async function hydrateFromGold() {
    const views = window.DataStoryApp.viewsData;
    if (!views || typeof d3 === "undefined") return;

    const [
      mSaludMun,
      mEpidMes,
      mJuris,
      mAcces15,
      sComisarias,
      mHospAncla,
      sPrensa,
      mAgeb,
      sDemMatrix,
      sPdb
    ] = await Promise.all([
      safeCsv("./data/gold/mart_cobertura_salud_municipal.csv"),
      safeCsv("./data/gold/mart_evolucion_epidemiologica_mensual.csv"),
      safeCsv("./data/gold/mart_cohesion_jurisdicciones_yucatan.csv"),
      safeCsv("./data/gold/mart_accesibilidad_15min_merida.csv"),
      safeCsv("./data/silver/comisarias_isocronas_merida.csv"),
      safeCsv("./data/gold/mart_logistica_hospitales_ancla.csv"),
      safeCsv("./data/silver/corpus_prensa_yucatan.csv"),
      safeCsv("./data/gold/mart_sin_afiliacion_ageb_merida.csv"),
      safeJson("./data/silver/dem_altimetria_merida_matrix.json"),
      safeJson("./data/silver/pdb_6vxx_estructura_molecular.json")
    ]);

    // Vista 1: Unidades médicas CLUES por municipio (data/gold/mart_cobertura_salud_municipal.csv)
    if (mSaludMun && mSaludMun.length && views[1]) {
      const totalUnidades = d3.sum(mSaludMun, d => +d.unidades_medicas);
      const totalHosp = d3.sum(mSaludMun, d => +d.hospitales);
      const merida = mSaludMun.find(d => String(d.cvegeo).padStart(5, "0") === "31050");
      const meridaUn = merida ? +merida.unidades_medicas : 0;
      const meridaHosp = merida ? +merida.hospitales : 0;
      const pctMerida = totalUnidades ? (100 * meridaUn) / totalUnidades : 0;
      const munSinHosp = mSaludMun.filter(d => +d.hospitales === 0).length;
      const top9 = mSaludMun.slice(0, 9);

      views[1].chartData = {
        labels: top9.map(d => d.municipio),
        datasets: [
          {
            label: "Unidades públicas (CLUES)",
            data: top9.map(d => +d.unidades_publicas || 0),
            backgroundColor: "rgba(96, 13, 139, 0.82)"
          },
          {
            label: "Unidades privadas (CLUES)",
            data: top9.map(d => +d.unidades_privadas || 0),
            backgroundColor: "rgba(237, 159, 34, 0.85)"
          }
        ]
      };
      views[1].kpis = [
        { icon: "fa-hospital", label: "Unidades médicas CLUES", value: fmtInt(totalUnidades), delta: `${fmtInt(totalHosp)} hospitales · sin farmacias`, color: "var(--accent-cyan)" },
        { icon: "fa-city", label: "Concentración en Mérida", value: `${fmtDec(pctMerida)} %`, delta: `${fmtInt(meridaUn)} unid. · ${meridaHosp} hospitales`, color: "var(--accent-blue)" },
        { icon: "fa-map-location-dot", label: "Municipios sin hospital", value: `${munSinHosp} / ${mSaludMun.length}`, delta: "Dependencia de cabeceras", color: "var(--accent-amber)" }
      ];
      views[1].insight = `<strong>Hallazgo verificado (CLUES octubre 2026):</strong> Mérida concentra ${fmtInt(meridaUn)} de las ${fmtInt(totalUnidades)} unidades médicas en operación de Yucatán (${fmtDec(pctMerida)} %) y ${meridaHosp} de ${totalHosp} hospitales, mientras ${munSinHosp} de 106 municipios no cuentan con hospital.`;
    }

    // Vista 2: Serie epidemiológica mensual DGE (data/gold/mart_evolucion_epidemiologica_mensual.csv)
    if (mEpidMes && mEpidMes.length && views[2]) {
      const confTotal = d3.max(mEpidMes, d => +d.confirmados_acum);
      const defTotal = d3.max(mEpidMes, d => +d.defunciones_acum);
      const pico = mEpidMes.reduce((a, b) => (+b.confirmados_mes > +a.confirmados_mes ? b : a), mEpidMes[0]);

      views[2].chartData = {
        labels: mEpidMes.map(d => d.anio_mes),
        datasets: [
          {
            label: "Casos confirmados mensuales",
            data: mEpidMes.map(d => +d.confirmados_mes),
            borderColor: "#600d8b",
            backgroundColor: "rgba(96, 13, 139, 0.16)",
            fill: true,
            tension: 0.3,
            borderWidth: 3
          },
          {
            label: "Defunciones mensuales",
            data: mEpidMes.map(d => +d.defunciones_mes),
            borderColor: "#ed9f22",
            backgroundColor: "rgba(237, 159, 34, 0.15)",
            tension: 0.3,
            borderWidth: 2.5
          }
        ]
      };
      views[2].kpis = [
        { icon: "fa-virus", label: "Confirmados acumulados", value: fmtInt(confTotal), delta: "DGE Yucatán (ene 2020–jun 2021)", color: "var(--accent-cyan)" },
        { icon: "fa-heart-pulse", label: "Defunciones acumuladas", value: fmtInt(defTotal), delta: "Serie histórica verificada", color: "var(--accent-amber)" },
        { icon: "fa-chart-line", label: "Pico mensual (confirmados)", value: fmtInt(pico.confirmados_mes), delta: `Mes pico: ${pico.anio_mes}`, color: "var(--accent-green)" }
      ];
      views[2].insight = `<strong>Hallazgo verificado (mart_evolucion_epidemiologica_mensual.csv):</strong> Entre enero de 2020 y junio de 2021 Yucatán acumuló ${fmtInt(confTotal)} casos confirmados y ${fmtInt(defTotal)} defunciones, con el máximo mensual en ${pico.anio_mes} (${fmtInt(pico.confirmados_mes)} casos).`;
    }

    // Vista 3: Jurisdicciones Sanitarias (data/gold/mart_cohesion_jurisdicciones_yucatan.csv)
    if (mJuris && mJuris.length && views[3]) {
      const totMun = d3.sum(mJuris, d => +d.total_municipios);
      const totConHosp = d3.sum(mJuris, d => +d.municipios_con_hospital);
      views[3].chartData = {
        labels: mJuris.map(d => d.jurisdiccion_sanitaria),
        datasets: [
          {
            label: "Unidades médicas CLUES",
            data: mJuris.map(d => +d.unidades_medicas),
            backgroundColor: "rgba(96, 13, 139, 0.8)"
          },
          {
            label: "Hospitales",
            data: mJuris.map(d => +d.hospitales),
            backgroundColor: "rgba(237, 159, 34, 0.85)"
          }
        ]
      };
      views[3].kpis = [
        { icon: "fa-landmark", label: "Municipios analizados", value: fmtInt(totMun), delta: "100 % de Yucatán (INEGI)", color: "var(--accent-cyan)" },
        { icon: "fa-diagram-project", label: "Jurisdicciones sanitarias", value: fmtInt(mJuris.length), delta: "Mérida, Valladolid y Ticul", color: "var(--accent-blue)" },
        { icon: "fa-hospital", label: "Municipios con hospital", value: `${totConHosp} / ${totMun}`, delta: `${fmtDec((100 * totConHosp) / totMun)} % con hospital CLUES`, color: "var(--accent-green)" }
      ];
    }

    // Vista 4: Accesibilidad 15 minutos en Mérida (ITER 2020 + CLUES)
    if (sComisarias && sComisarias.length && views[4]) {
      const fueraCab = sComisarias.filter(d => String(d.clave_loc).padStart(4, "0") !== "0001");
      const fuera15 = fueraCab.filter(d => String(d.en_umbral_15min).toLowerCase() !== "true");
      const pctFuera = fueraCab.length ? (100 * fuera15.length) / fueraCab.length : 0;
      const pobFuera = d3.sum(fuera15, d => +d.poblacion);
      const medComis = d3.median(fueraCab, d => +d.minutos_pie_medico) || 0;

      if (mAcces15 && mAcces15.length) {
        views[4].chartData = {
          labels: mAcces15.map(d => d.tipo_localidad),
          datasets: [
            {
              label: "Mediana de minutos a pie a unidad CLUES",
              data: mAcces15.map(d => +d.mediana_min_medico),
              backgroundColor: "rgba(96, 13, 139, 0.82)"
            }
          ]
        };
      }
      views[4].kpis = [
        { icon: "fa-map-pin", label: "Localidades oficiales Mérida", value: fmtInt(sComisarias.length), delta: "INEGI ITER 2020 (MUN 050)", color: "var(--accent-cyan)" },
        { icon: "fa-person-walking", label: "Comisarías > 15 min al médico", value: `${fmtDec(pctFuera)} %`, delta: `${fuera15.length} de ${fueraCab.length} (${fmtInt(pobFuera)} hab.)`, color: "var(--accent-amber)" },
        { icon: "fa-clock", label: "Mediana en comisarías", value: `${fmtDec(medComis)} min`, delta: "A unidad médica CLUES (sin farmacias)", color: "var(--accent-green)" }
      ];
      views[4].insight = `<strong>Hallazgo verificado (INEGI ITER + CLUES):</strong> ${fmtDec(pctFuera)} % de las ${fueraCab.length} comisarías y subcomisarías de Mérida (${fmtInt(pobFuera)} habitantes) queda a más de 15 minutos a pie de la unidad médica CLUES más cercana (mediana de ${fmtDec(medComis)} min).`;
    }

    // Vista 5: Infraestructura hospitalaria (data/gold/mart_logistica_hospitales_ancla.csv)
    if (mHospAncla && mHospAncla.length && views[5]) {
      const totHosp = d3.sum(mHospAncla, d => +d.total_unidades);
      const porMun = Array.from(
        d3.rollup(mHospAncla, v => d3.sum(v, d => +d.total_unidades), d => d.nom_mun),
        ([mun, total]) => ({ mun, total })
      ).sort((a, b) => b.total - a.total).slice(0, 8);

      views[5].vizType = "bar";
      views[5].chartData = {
        labels: porMun.map(d => d.mun),
        datasets: [
          {
            label: "Hospitales y clínicas registradas",
            data: porMun.map(d => d.total),
            backgroundColor: "rgba(96, 13, 139, 0.82)"
          }
        ]
      };
      views[5].kpis = [
        { icon: "fa-hospital", label: "Hospitales y clínicas", value: fmtInt(totHosp), delta: "Red hospitalaria Yucatán", color: "var(--accent-cyan)" },
        { icon: "fa-city", label: "Municipios con hospital/clínica", value: fmtInt(new Set(mHospAncla.map(d => d.cvegeo)).size), delta: "De 106 municipios estatales", color: "var(--accent-blue)" },
        { icon: "fa-shield-halved", label: "Principal polo (Mérida)", value: fmtInt(porMun[0]?.total || 0), delta: "Concentración de 2.º y 3.er nivel", color: "var(--accent-amber)" }
      ];
    }

    // Vista 6: Prensa regional real (data/silver/corpus_prensa_yucatan.csv)
    if (sPrensa && sPrensa.length && views[6]) {
      const nArt = sPrensa.length;
      const pos = sPrensa.filter(d => d.sentimiento === "positivo").length;
      const pctPos = (100 * pos) / nArt;
      const medios = new Set(sPrensa.map(d => d.medio)).size;

      views[6].newsArticlesCorpus = sPrensa.slice(0, 12).map(d => ({
        source: d.medio,
        title: d.titular,
        quote: `Fecha: ${d.fecha_iso} · Tópico: ${d.topico}`,
        sentiment: `${d.sentimiento} (${d.polaridad})`,
        keywords: String(d.keywords || "").split(";").map(s => s.trim()).filter(Boolean)
      }));
      views[6].kpis = [
        { icon: "fa-newspaper", label: "Notas periodísticas reales", value: fmtInt(nArt), delta: "Extracción RSS regional", color: "var(--accent-cyan)" },
        { icon: "fa-face-smile", label: "Tono positivo léxico", value: `${fmtDec(pctPos)} %`, delta: `${pos} de ${nArt} titulares`, color: "var(--accent-green)" },
        { icon: "fa-tower-broadcast", label: "Medios cubiertos", value: fmtInt(medios), delta: "Prensa local y nacional", color: "var(--accent-amber)" }
      ];
    }

    // Vista 7: Brecha de afiliación médica Censo 2020 (data/gold/mart_sin_afiliacion_ageb_merida.csv)
    if (mAgeb && mAgeb.length && views[7]) {
      const pobTot = d3.sum(mAgeb, d => +d.poblacion_total);
      const sinAfil = d3.sum(mAgeb, d => +d.poblacion_sin_afiliacion);
      const pctSin = (100 * sinAfil) / pobTot;
      const ageb30 = mAgeb.filter(d => +d.pct_sin_afiliacion >= 30).length;
      const rangos = [
        { lbl: "0–15 %", n: mAgeb.filter(d => +d.pct_sin_afiliacion < 15).length },
        { lbl: "15–25 %", n: mAgeb.filter(d => +d.pct_sin_afiliacion >= 15 && +d.pct_sin_afiliacion < 25).length },
        { lbl: "25–30 %", n: mAgeb.filter(d => +d.pct_sin_afiliacion >= 25 && +d.pct_sin_afiliacion < 30).length },
        { lbl: "30 % o más", n: ageb30 }
      ];

      views[7].chartData = {
        labels: rangos.map(r => r.lbl),
        datasets: [
          {
            label: "AGEB urbanas de Mérida por rango sin afiliación",
            data: rangos.map(r => r.n),
            backgroundColor: ["#9ca3af", "#ed9f22", "#b45309", "#600d8b"]
          }
        ]
      };
      views[7].kpis = [
        { icon: "fa-users", label: "Sin afiliación en Mérida", value: fmtInt(sinAfil), delta: `${fmtDec(pctSin)} % de ${fmtInt(pobTot)} hab.`, color: "var(--accent-cyan)" },
        { icon: "fa-layer-group", label: "AGEB urbanas analizadas", value: fmtInt(mAgeb.length), delta: "INEGI Censo 2020 oficial", color: "var(--accent-green)" },
        { icon: "fa-triangle-exclamation", label: "AGEB con ≥ 30 % sin afiliación", value: fmtInt(ageb30), delta: "Zonas de mayor brecha", color: "var(--accent-amber)" }
      ];
    }

    // Vista 8: Altimetría DEM Mérida (data/silver/dem_altimetria_merida_matrix.json)
    if (sDemMatrix && sDemMatrix.stats && views[8]) {
      window.DataStoryApp.demMatrix = sDemMatrix;
      views[8].kpis = [
        { icon: "fa-cubes", label: "Puntos DEM Copernicus", value: fmtInt((sDemMatrix.grid_shape?.[0] || 20) * (sDemMatrix.grid_shape?.[1] || 20)), delta: "Malla real 20×20 Mérida", color: "var(--accent-purple)" },
        { icon: "fa-ruler-vertical", label: "Elevación promedio", value: `${fmtDec(sDemMatrix.stats.mean_msnm)} m`, delta: `Rango ${fmtDec(sDemMatrix.stats.min_msnm)}–${fmtDec(sDemMatrix.stats.max_msnm)} m s.n.m.`, color: "var(--accent-cyan)" },
        { icon: "fa-mountain", label: "Desviación estándar", value: `${fmtDec(sDemMatrix.stats.std_msnm)} m`, delta: "Planicie cárstica de Yucatán", color: "var(--accent-green)" }
      ];
    }

    // Vista 9: PDB 6VXX real (data/silver/pdb_6vxx_estructura_molecular.json)
    if (sPdb && views[9]) {
      window.DataStoryApp.pdb6vxx = sPdb;
      views[9].kpis = [
        { icon: "fa-dna", label: "Modelo RCSB PDB", value: sPdb.pdb_id || "6VXX", delta: `Resolución ${sPdb.resolution_angstroms} Å (Cryo-EM)`, color: "var(--accent-purple)" },
        { icon: "fa-atom", label: "Átomos depositados", value: fmtInt(sPdb.deposited_atom_count), delta: `${sPdb.alpha_helices_count} hélices · ${sPdb.beta_sheets_count} láminas`, color: "var(--accent-cyan)" },
        { icon: "fa-calendar-check", label: "Publicación oficial", value: sPdb.initial_release_date || "2020-03-11", delta: "Dominio público CC0 1.0", color: "var(--accent-coral)" }
      ];
    }
  }

  return { hydrateFromGold };
})();
