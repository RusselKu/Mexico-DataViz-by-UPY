/**
 * Estructura base de las 9 vistas de Narrativa con Datos (Equipo 3 · UPY)
 * Todos los indicadores, textos y series están alineados con data/gold/ y data/silver/,
 * y se hidratan dinámicamente al inicio mediante js/data/goldLoader.js.
 */
window.DataStoryApp = window.DataStoryApp || {};

window.DataStoryApp.viewsData = {
  1: {
    number: 1,
    arc: "Fase 1: Macro Territorial",
    arcIcon: "fa-earth-americas",
    tag: "CAPÍTULO 1 • CARTOGRAFÍA Y COBERTURA",
    tabName: "Red de Salud Yucatán",
    primarySource: "OpenStreetMap (Overpass) + INEGI Censo 2020 (ITER) y Marco Geoestadístico",
    secondarySources: ["data/gold/mart_cobertura_salud_municipal.csv", "booklet/datos/escena-1.csv"],
    vizTitle: "Cartografía de unidades de salud mapeadas en los 106 municipios de Yucatán",
    vizType: "custom_map",
    storyTitle: "La red que nos cuida",
    storyLead: "¿Cómo se distribuyen las unidades médicas mapeadas en el territorio yucateco?",
    storyDesc: "El cruce espacial de establecimientos de salud de OpenStreetMap contra los 106 polígonos municipales del INEGI muestra una marcada concentración: Mérida reúne 239 de las 482 unidades registradas en el estado (49.6 %), mientras 56 municipios aparecen sin registro en la cartografía abierta.",
    storyBeats: [
      {
        id: "beat1_1",
        title: "1. Concentración en Mérida (CVEGEO 31050)",
        desc: "Mérida concentra 239 de las 482 unidades médicas mapeadas en Yucatán (49.6 % del total estatal).",
        focusNode: "merida",
        actionText: "Enfocar Mérida"
      },
      {
        id: "beat1_2",
        title: "2. Polos regionales del interior",
        desc: "Valladolid (86 unidades), Tizimín (23) e Izamal (16) encabezan el interior del estado.",
        focusNode: "interior",
        actionText: "Ver polos regionales"
      },
      {
        id: "beat1_3",
        title: "3. Brecha en cartografía abierta",
        desc: "56 de los 106 municipios no registran unidades médicas en OpenStreetMap, señalando rezago de cobertura o subregistro.",
        focusNode: "all",
        actionText: "Ver cobertura estatal"
      }
    ],
    territorialNodes: [
      { id: "merida", name: "Mérida", lat: 20.9674, lng: -89.5926, units: 239, beds: 41, type: "Polo principal (49.6 %)", desc: "41 hospitales, 26 clínicas y 140 farmacias mapeadas en CVEGEO 31050.", color: "#600d8b" },
      { id: "valladolid", name: "Valladolid", lat: 20.6897, lng: -88.2014, units: 86, beds: 10, type: "Polo oriente", desc: "10 hospitales, 22 clínicas y 35 farmacias registradas.", color: "#ed9f22" },
      { id: "tizimin", name: "Tizimín", lat: 21.1422, lng: -88.1492, units: 23, beds: 11, type: "Polo nororiente", desc: "11 hospitales, 4 clínicas y 7 farmacias registradas.", color: "#b45309" },
      { id: "izamal", name: "Izamal", lat: 20.9303, lng: -89.0189, units: 16, beds: 2, type: "Zona centro", desc: "2 hospitales, 1 clínica y 8 farmacias registradas.", color: "#9ca3af" },
      { id: "temozon", name: "Temozón", lat: 20.8045, lng: -88.2010, units: 9, beds: 3, type: "Zona oriente", desc: "3 hospitales y 4 clínicas registradas.", color: "#9ca3af" },
      { id: "tinum", name: "Tinum", lat: 20.7610, lng: -88.4580, units: 8, beds: 3, type: "Zona oriente", desc: "3 hospitales, 1 clínica y 3 farmacias registradas.", color: "#9ca3af" },
      { id: "kanasin", name: "Kanasín", lat: 20.9333, lng: -89.5583, units: 6, beds: 2, type: "Zona conurbada", desc: "2 hospitales, 1 clínica y 3 farmacias registradas.", color: "#9ca3af" },
      { id: "espita", name: "Espita", lat: 21.0108, lng: -88.3056, units: 5, beds: 2, type: "Zona oriente", desc: "2 hospitales y 3 farmacias registradas.", color: "#9ca3af" }
    ],
    medicalFacilities: [
      { name: "Hospital General Dr. Agustín O'Horán", lat: 20.9678, lng: -89.6375, category: "hospital", units: 1, type: "Hospital público de 3.er nivel" },
      { name: "Hospital Regional de Alta Especialidad (HRAEPY)", lat: 21.0185, lng: -89.5682, category: "hospital", units: 1, type: "Hospital federal de alta especialidad" },
      { name: "UMAE T1 IMSS Lic. Ignacio García Téllez", lat: 20.9575, lng: -89.6080, category: "hospital", units: 1, type: "Centro Médico Nacional IMSS" },
      { name: "Hospital Regional ISSSTE Mérida", lat: 20.9882, lng: -89.6450, category: "hospital", units: 1, type: "Hospital de especialidades ISSSTE" },
      { name: "Centro de Salud Urbano Santa Rosa", lat: 20.9420, lng: -89.6150, category: "clinica", units: 1, type: "Clínica de primer nivel SSY" },
      { name: "Módulo Médico Ciudad Caucel", lat: 20.9985, lng: -89.7020, category: "clinica", units: 1, type: "Atención primaria poniente" },
      { name: "Farmacias y consultorios Centro de Mérida", lat: 20.9700, lng: -89.6230, category: "farmacia", units: 1, type: "Primer contacto barrial" }
    ],
    chartData: {
      labels: ["Mérida", "Valladolid", "Tizimín", "Izamal", "Temozón", "Tinum", "Kanasín", "Espita"],
      datasets: [
        { label: "Farmacias y consultorios", data: [172, 54, 8, 13, 2, 4, 3, 3], backgroundColor: "rgba(96, 13, 139, 0.8)" },
        { label: "Hospitales y clínicas", data: [67, 32, 15, 3, 7, 4, 3, 2], backgroundColor: "rgba(237, 159, 34, 0.85)" }
      ]
    },
    kpis: [
      { icon: "fa-hospital", label: "Unidades mapeadas (Yucatán)", value: "482", delta: "OpenStreetMap + INEGI", color: "var(--accent-cyan)" },
      { icon: "fa-city", label: "Concentración en Mérida", value: "49.6 %", delta: "239 unidades en 31050", color: "var(--accent-blue)" },
      { icon: "fa-map-location-dot", label: "Municipios sin registro", value: "56 / 106", delta: "Brecha en cartografía abierta", color: "var(--accent-amber)" }
    ],
    insight: "<strong>Hallazgo verificado (mart_cobertura_salud_municipal.csv):</strong> Mérida concentra 239 de las 482 unidades médicas registradas en Yucatán (49.6 %), mientras 56 de los 106 municipios no registran unidades en OpenStreetMap."
  },

  2: {
    number: 2,
    arc: "Fase 1: Macro Territorial",
    arcIcon: "fa-earth-americas",
    tag: "CAPÍTULO 2 • EVOLUCIÓN EPIDEMIOLÓGICA",
    tabName: "Datos.gob.mx (DGE)",
    primarySource: "DGE Secretaría de Salud (vía espejo mariorz/covid19-mx-time-series)",
    secondarySources: ["data/gold/mart_evolucion_epidemiologica_mensual.csv", "booklet/datos/escena-4.csv"],
    vizTitle: "Evolución mensual de casos confirmados y defunciones en Yucatán (2020–2021)",
    vizType: "line",
    storyTitle: "La presión sobre el sistema de salud",
    storyLead: "¿Cómo evolucionaron los contagios y defunciones mensuales en Yucatán entre 2020 y 2021?",
    storyDesc: "La serie histórica de la Dirección General de Epidemiología (del 23 de enero de 2020 al 12 de junio de 2021) registra 41,179 casos confirmados acumulados y 4,078 defunciones en Yucatán, con el pico máximo en julio de 2020.",
    storyBeats: [
      {
        id: "beat2_1",
        title: "1. Primer pico (julio de 2020)",
        desc: "Julio de 2020 marcó el máximo mensual de la serie con 5,280 casos confirmados y 460 defunciones en un solo mes.",
        filterWave: "wave1",
        actionText: "Ver primer año"
      },
      {
        id: "beat2_2",
        title: "2. Segundo repunte (enero–junio 2021)",
        desc: "Durante la primera mitad de 2021 la transmisión se mantuvo activa hasta acumular 41,179 casos confirmados al corte del 12 de junio.",
        filterWave: "waveVac",
        actionText: "Ver 2021"
      },
      {
        id: "beat2_3",
        title: "3. Balance del periodo (18 meses)",
        desc: "Los 500 días analizados se consolidan en 18 meses en la tabla Gold sin valores nulos ni duplicados.",
        filterWave: "all",
        actionText: "Serie completa"
      }
    ],
    chartData: {
      labels: ["2020-03", "2020-07", "2020-12", "2021-03", "2021-06"],
      datasets: [
        {
          label: "Casos confirmados mensuales",
          data: [45, 5280, 2610, 2240, 2890],
          borderColor: "#600d8b",
          backgroundColor: "rgba(96, 13, 139, 0.16)",
          fill: true,
          tension: 0.3,
          borderWidth: 3
        },
        {
          label: "Defunciones mensuales",
          data: [0, 460, 210, 225, 195],
          borderColor: "#ed9f22",
          backgroundColor: "rgba(237, 159, 34, 0.15)",
          tension: 0.3,
          borderWidth: 2.5
        }
      ]
    },
    kpis: [
      { icon: "fa-virus", label: "Confirmados acumulados", value: "41,179", delta: "DGE Yucatán (ene 2020–jun 2021)", color: "var(--accent-cyan)" },
      { icon: "fa-heart-pulse", label: "Defunciones acumuladas", value: "4,078", delta: "Serie histórica verificada", color: "var(--accent-amber)" },
      { icon: "fa-chart-line", label: "Pico mensual (confirmados)", value: "5,280", delta: "Mes pico: 2020-07", color: "var(--accent-green)" }
    ],
    insight: "<strong>Hallazgo verificado (mart_evolucion_epidemiologica_mensual.csv):</strong> Entre enero de 2020 y junio de 2021 Yucatán acumuló 41,179 casos confirmados y 4,078 defunciones, con el mayor pico mensual en julio de 2020 (5,280 casos)."
  },

  3: {
    number: 3,
    arc: "Fase 1: Macro Territorial",
    arcIcon: "fa-earth-americas",
    tag: "CAPÍTULO 3 • COHESIÓN TERRITORIAL",
    tabName: "SIEGY Yucatán",
    primarySource: "INEGI Marco Geoestadístico (vía espejo JuveCampos) y Jurisdicciones Sanitarias",
    secondarySources: ["data/gold/mart_cohesion_jurisdicciones_yucatan.csv", "data/silver/dim_municipios_yucatan.geojson"],
    vizTitle: "Unidades de salud y cobertura municipal por Jurisdicción Sanitaria (106 municipios)",
    vizType: "bar",
    storyTitle: "Los 106 municipios y sus tres jurisdicciones",
    storyLead: "¿Cómo se reparte la infraestructura médica entre las tres jurisdicciones sanitarias de Yucatán?",
    storyDesc: "Al agrupar los 106 municipios oficiales del INEGI en las 3 jurisdicciones sanitarias estatales (Mérida, Valladolid y Ticul), se observa cómo la Jurisdicción 1 y el polo de Valladolid absorben la mayor parte de los establecimientos registrados.",
    storyBeats: [
      {
        id: "beat3_1",
        title: "1. Jurisdicción 1 (Mérida y Centro)",
        desc: "Concentra la capital del estado y el área metropolitana con el mayor volumen de hospitales y farmacias.",
        jurisIdx: 0,
        actionText: "Ver Jurisdicción 1"
      },
      {
        id: "beat3_2",
        title: "2. Jurisdicción 2 (Valladolid y Oriente)",
        desc: "Reúne los polos de Valladolid y Tizimín, clave para el oriente y la costa nororiente.",
        jurisIdx: 1,
        actionText: "Ver Jurisdicción 2"
      },
      {
        id: "beat3_3",
        title: "3. Jurisdicción 3 (Ticul y Sur)",
        desc: "Presenta la menor densidad de unidades mapeadas por municipio en la cartografía abierta.",
        jurisIdx: 2,
        actionText: "Ver Jurisdicción 3"
      }
    ],
    chartData: {
      labels: ["Jurisdicción 1 - Mérida", "Jurisdicción 2 - Valladolid", "Jurisdicción 3 - Ticul"],
      datasets: [
        { label: "Total de unidades de salud", data: [285, 165, 32], backgroundColor: "rgba(96, 13, 139, 0.8)" },
        { label: "Municipios con registro", data: [22, 18, 10], backgroundColor: "rgba(237, 159, 34, 0.85)" }
      ]
    },
    kpis: [
      { icon: "fa-landmark", label: "Municipios analizados", value: "106", delta: "100 % de Yucatán (INEGI)", color: "var(--accent-cyan)" },
      { icon: "fa-diagram-project", label: "Jurisdicciones sanitarias", value: "3", delta: "Mérida, Valladolid y Ticul", color: "var(--accent-blue)" },
      { icon: "fa-check-double", label: "Municipios con registro", value: "50 / 106", delta: "47.2 % con cobertura mapeada", color: "var(--accent-green)" }
    ],
    insight: "<strong>Hallazgo verificado (mart_cohesion_jurisdicciones_yucatan.csv):</strong> Los 106 polígonos municipales validados en EPSG:4326 confirman que la cobertura registrada se concentra en la Jurisdicción 1 (Mérida) y el eje Valladolid–Tizimín."
  },

  4: {
    number: 4,
    arc: "Fase 2: Escala Urbana y Operativa",
    arcIcon: "fa-city",
    tag: "CAPÍTULO 4 • MOVILIDAD Y PROXIMIDAD",
    tabName: "Accesibilidad Mérida",
    primarySource: "OpenStreetMap (Overpass) recortado al límite municipal INEGI 31050 (UTM 16N)",
    secondarySources: ["data/silver/comisarias_isocronas_merida.csv", "booklet/datos/escena-3.csv"],
    vizTitle: "Distancia y tiempo a pie a la unidad de salud en 185 localidades de Mérida",
    vizType: "custom_map",
    storyTitle: "¿Qué tan lejos queda el médico en Mérida?",
    storyLead: "¿Cuántas localidades y comisarías de Mérida cumplen con el umbral de 15 minutos caminando?",
    storyDesc: "Al calcular la distancia euclidiana en proyección UTM 16N desde las 185 localidades dentro del polígono oficial de Mérida (CVEGEO 31050) hasta la unidad de salud más cercana, 54.6 % rebasa los 15 minutos a pie. Mientras en colonias y barrios la mediana es de 11.0 minutos, en las 44 comisarías sube a 56.6 minutos.",
    storyBeats: [
      {
        id: "beat4_1",
        title: "1. Colonias y barrios urbanos (11.0 min)",
        desc: "Las 136 colonias y barrios consolidados presentan una mediana de 11.0 minutos caminando a la unidad de salud más cercana.",
        actionText: "Ver umbral 15 min"
      },
      {
        id: "beat4_2",
        title: "2. Brecha en 44 comisarías (56.6 min)",
        desc: "Las comisarías y subcomisarías dentro de Mérida tienen una mediana de 56.6 minutos a pie, 5.1 veces más lejos que el área urbana.",
        actionText: "Ver comisarías"
      },
      {
        id: "beat4_3",
        title: "3. Red de 884 parques en Mérida",
        desc: "Se georreferenciaron 884 parques y áreas verdes para comparar accesibilidad recreativa frente a acceso médico.",
        actionText: "Ver proximidad"
      }
    ],
    isochroneComisarias: [
      { id: "COM-01", name: "Komchén", lat: 21.088, lng: -89.683, pop: 4800, walkMin: 56.6, sidewalkPct: 72.0, facility: "Unidad médica más cercana (OSM)" },
      { id: "COM-02", name: "Cholul", lat: 21.035, lng: -89.553, pop: 6200, walkMin: 18.0, sidewalkPct: 78.5, facility: "Unidad médica más cercana (OSM)" },
      { id: "COM-03", name: "Ciudad Caucel", lat: 20.999, lng: -89.704, pop: 75000, walkMin: 11.0, sidewalkPct: 85.0, facility: "Clínica / farmacia Caucel" },
      { id: "COM-04", name: "Dzityá", lat: 21.048, lng: -89.682, pop: 3200, walkMin: 35.0, sidewalkPct: 70.0, facility: "Unidad médica más cercana (OSM)" },
      { id: "COM-05", name: "Chablekal", lat: 21.076, lng: -89.585, pop: 3900, walkMin: 48.0, sidewalkPct: 68.0, facility: "Unidad médica más cercana (OSM)" },
      { id: "COM-06", name: "San José Tzal", lat: 20.850, lng: -89.651, pop: 4100, walkMin: 95.0, sidewalkPct: 65.0, facility: "Unidad médica más cercana (OSM)" },
      { id: "COM-07", name: "Sotuta de Peón", lat: 20.790, lng: -89.620, pop: 2800, walkMin: 236.8, sidewalkPct: 62.0, facility: "Localidad más alejada (18.9 km)" }
    ],
    macroSedes: [
      { id: "HOSP-01", name: "HRAEPY (Norte)", lat: 21.0185, lng: -89.5682, dailyDoses: 1, color: "#600d8b" },
      { id: "HOSP-02", name: "Hospital O'Horán (Centro-Poniente)", lat: 20.9678, lng: -89.6375, dailyDoses: 1, color: "#ed9f22" },
      { id: "HOSP-03", name: "UMAE T1 IMSS (Oriente)", lat: 20.9575, lng: -89.6080, dailyDoses: 1, color: "#b45309" },
      { id: "HOSP-04", name: "Hospital ISSSTE Pensiones", lat: 20.9882, lng: -89.6450, dailyDoses: 1, color: "#9ca3af" }
    ],
    chartData: {
      labels: ["Comisaría", "Subcomisaría", "Barrio / Zona urbana", "Colonia / Fraccionamiento"],
      datasets: [
        { label: "Minutos promedio a unidad médica", data: [72.4, 88.2, 16.5, 13.8], backgroundColor: "rgba(96, 13, 139, 0.82)" }
      ]
    },
    kpis: [
      { icon: "fa-map-pin", label: "Localidades en Mérida", value: "185", delta: "Recorte polígono CVEGEO 31050", color: "var(--accent-cyan)" },
      { icon: "fa-person-walking", label: "Fuera del umbral de 15 min", value: "54.6 %", delta: "101 de 185 localidades", color: "var(--accent-amber)" },
      { icon: "fa-clock", label: "Mediana en comisarías", value: "56.6 min", delta: "Contra 11.0 min en colonias", color: "var(--accent-green)" }
    ],
    insight: "<strong>Hallazgo verificado (comisarias_isocronas_merida.csv):</strong> 54.6 % de las 185 localidades dentro de Mérida rebasa los 15 minutos caminando al médico; en las 44 comisarías la mediana es de 56.6 min frente a 11.0 min en colonias urbanas."
  },

  5: {
    number: 5,
    arc: "Fase 2: Escala Urbana y Operativa",
    arcIcon: "fa-city",
    tag: "CAPÍTULO 5 • INFRAESTRUCTURA HOSPITALARIA",
    tabName: "Red Hospitalaria",
    primarySource: "Infraestructura hospitalaria y clínica de Yucatán (OSM / Red Hospitalaria)",
    secondarySources: ["data/gold/mart_logistica_hospitales_ancla.csv", "data/silver/infraestructura_hospitalaria_yucatan.csv"],
    vizTitle: "Distribución de 190 hospitales y clínicas registradas por municipio en Yucatán",
    vizType: "bar",
    storyTitle: "Hospitales y clínicas de referencia",
    storyLead: "¿En qué municipios se concentra la capacidad hospitalaria y clínica de Yucatán?",
    storyDesc: "Del universo de unidades médicas de Yucatán, 190 corresponden a hospitales y clínicas de primero, segundo y tercer nivel. La tabla Gold agrupa esta red por municipio y nivel de atención para identificar los nodos ancla del estado.",
    storyBeats: [
      {
        id: "beat5_1",
        title: "1. Nodo hospitalario de Mérida",
        desc: "Mérida concentra los principales hospitales de segundo y tercer nivel (O'Horán, HRAEPY, UMAE T1 IMSS e ISSSTE).",
        actionText: "Ver concentración"
      },
      {
        id: "beat5_2",
        title: "2. Cabeceras regionales",
        desc: "Valladolid y Tizimín actúan como nodos de referencia para el oriente y la costa nororiente de Yucatán.",
        actionText: "Ver cabeceras"
      },
      {
        id: "beat5_3",
        title: "3. Cobertura municipal parcial",
        desc: "El resto de los municipios depende de traslados hacia las cabeceras jurisdiccionales para atención hospitalaria.",
        actionText: "Ver desglose"
      }
    ],
    chartData: {
      labels: ["Mérida", "Valladolid", "Tizimín", "Temozón", "Tinum", "Izamal", "Kanasín"],
      datasets: [
        { label: "Hospitales y clínicas registradas", data: [67, 32, 15, 7, 4, 3, 3], backgroundColor: "rgba(96, 13, 139, 0.82)" }
      ]
    },
    kpis: [
      { icon: "fa-hospital", label: "Hospitales y clínicas", value: "190", delta: "Red hospitalaria Yucatán", color: "var(--accent-cyan)" },
      { icon: "fa-city", label: "Registros por municipio", value: "57", delta: "Cruce municipio × nivel", color: "var(--accent-blue)" },
      { icon: "fa-shield-halved", label: "Principal polo (Mérida)", value: "67", delta: "Hospitales y clínicas en 31050", color: "var(--accent-amber)" }
    ],
    insight: "<strong>Hallazgo verificado (mart_logistica_hospitales_ancla.csv):</strong> Los 190 hospitales y clínicas mapeadas se concentran en Mérida y las cabeceras jurisdiccionales, reforzando la necesidad de traslado para comunidades periféricas."
  },

  6: {
    number: 6,
    arc: "Fase 2: Escala Urbana y Operativa",
    arcIcon: "fa-city",
    tag: "CAPÍTULO 6 • VOZ PÚBLICA EN MEDIOS",
    tabName: "Prensa Regional",
    primarySource: "Prensa Regional de Yucatán (Extracción RSS: Diario de Yucatán, Por Esto!, La Jornada Maya)",
    secondarySources: ["data/silver/corpus_prensa_yucatan.csv", "data/gold/mart_sentimiento_prensa_yucatan.csv"],
    vizTitle: "Red semántica de co-ocurrencia y análisis léxico de 235 titulares regionales",
    vizType: "custom_force",
    storyTitle: "Lo que cubre la prensa de Yucatán",
    storyLead: "¿Qué temas de salud, hospitales y comisarías dominan la agenda periodística local?",
    storyDesc: "Mediante extracción automatizada de feeds RSS regionales se recopilaron 235 titulares únicos de medios locales y nacionales sobre salud, hospitales, vacunación, comisarías y la UPY, procesados con diccionario léxico en español.",
    storyBeats: [
      {
        id: "beat6_1",
        title: "1. Cobertura de salud y vacunación",
        desc: "Las notas sobre campañas de salud, hospitales públicos y servicios en Mérida encabezan el corpus de 235 artículos.",
        actionText: "Ver núcleo temático"
      },
      {
        id: "beat6_2",
        title: "2. Comunidad universitaria y comisarías",
        desc: "El corpus incluye seguimiento específico sobre la UPY y las condiciones de servicios en las comisarías de Mérida.",
        actionText: "Ver comunidad"
      },
      {
        id: "beat6_3",
        title: "3. Análisis léxico reproducible",
        desc: "Cada titular cuenta con fecha ISO-8601, medio, palabras clave extraídas, puntaje de polaridad y URL verificable.",
        actionText: "Ver corpus"
      }
    ],
    newsArticlesCorpus: [],
    kpis: [
      { icon: "fa-newspaper", label: "Notas periodísticas reales", value: "235", delta: "Extracción RSS regional", color: "var(--accent-cyan)" },
      { icon: "fa-face-smile", label: "Tópicos analizados", value: "5", delta: "Salud, hospitales, UPY, comisarías", color: "var(--accent-green)" },
      { icon: "fa-tower-broadcast", label: "Trazabilidad completa", value: "100 %", delta: "URL y fecha ISO por nota", color: "var(--accent-amber)" }
    ],
    insight: "<strong>Hallazgo verificado (corpus_prensa_yucatan.csv):</strong> Los 235 titulares reales extraídos vía RSS se encuentran limpios en capas Silver y Gold con trazabilidad directa a cada medio."
  },

  7: {
    number: 7,
    arc: "Fase 3: Brecha de Afiliación (Censo 2020)",
    arcIcon: "fa-users",
    tag: "CAPÍTULO 7 • AFILIACIÓN A SERVICIOS DE SALUD",
    tabName: "Afiliación Censo 2020",
    primarySource: "INEGI, Censo de Población y Vivienda 2020 (515 AGEB urbanas de Mérida)",
    secondarySources: ["data/gold/mart_sin_afiliacion_ageb_merida.csv", "booklet/datos/escena-2.csv"],
    vizTitle: "Brecha de afiliación a servicios de salud por AGEB urbana en Mérida (Censo 2020)",
    vizType: "bar",
    storyTitle: "Quién queda sin afiliación médica en Mérida",
    storyLead: "¿Cuántas personas en las AGEB urbanas de Mérida carecen de afiliación a servicios de salud?",
    storyDesc: "Con datos oficiales directos del Censo de Población y Vivienda 2020 del INEGI, 211,556 habitantes de las 515 AGEB urbanas de Mérida (22.1 %) no cuentan con afiliación médica y 61 AGEB superan el 30 %. La encuesta estudiantil UPY previa quedó excluida del booklet por transparencia metodológica.",
    storyBeats: [
      {
        id: "beat7_1",
        title: "1. Uno de cada cinco sin afiliación (22.1 %)",
        desc: "211,556 personas de las 957,340 contabilizadas en las 515 AGEB urbanas de Mérida carecen de derecho a servicios de salud (PSINDER).",
        actionText: "Ver distribución"
      },
      {
        id: "beat7_2",
        title: "2. 61 AGEB con 30 % o más sin afiliación",
        desc: "La desigualdad interna es fuerte: 61 AGEB urbanas de Mérida superan el umbral del 30 % sin afiliación.",
        actionText: "Ver zonas críticas"
      },
      {
        id: "beat7_3",
        title: "3. Transparencia metodológica",
        desc: "Se usa exclusivamente el Censo 2020 oficial de INEGI; la encuesta UPY fue excluida del booklet y el script automatizado previo fue eliminado.",
        actionText: "Ver metodología"
      }
    ],
    chartData: {
      labels: ["0–15 %", "15–25 %", "25–30 %", "30 % o más"],
      datasets: [
        { label: "AGEB urbanas de Mérida por rango sin afiliación", data: [108, 250, 96, 61], backgroundColor: ["#9ca3af", "#ed9f22", "#b45309", "#600d8b"] }
      ]
    },
    kpis: [
      { icon: "fa-users", label: "Sin afiliación en Mérida", value: "211,556", delta: "22.1 % de 957,340 hab.", color: "var(--accent-cyan)" },
      { icon: "fa-layer-group", label: "AGEB urbanas analizadas", value: "515", delta: "INEGI Censo 2020 oficial", color: "var(--accent-green)" },
      { icon: "fa-triangle-exclamation", label: "AGEB con ≥ 30 % sin afiliación", value: "61", delta: "Zonas de mayor brecha", color: "var(--accent-amber)" }
    ],
    insight: "<strong>Hallazgo verificado (mart_sin_afiliacion_ageb_merida.csv):</strong> En Mérida 211,556 habitantes de AGEB urbanas (22.1 %) no tienen afiliación médica según el Censo 2020 oficial del INEGI, con 61 AGEB por encima del 30 %."
  },

  8: {
    number: 8,
    arc: "Fase 4: Inmersión Tecnológica",
    arcIcon: "fa-cube",
    tag: "CAPÍTULO 8 • ALTIMETRÍA 3D DETERMINÍSTICA",
    tabName: "Altimetría DEM 3D",
    primarySource: "Open-Meteo Elevation API (Copernicus DEM GLO-90, malla 20×20 Mérida)",
    secondarySources: ["data/silver/dem_altimetria_merida_matrix.json", "data/gold/mart_altimetria_urbana_merida.csv"],
    vizTitle: "Modelo altimétrico 3D de Mérida basado en 400 puntos reales Copernicus DEM",
    vizType: "3d",
    storyTitle: "Mérida en tres dimensiones",
    storyLead: "¿Cómo se comporta el relieve plano y cárstico de Mérida sobre la malla altimétrica real?",
    storyDesc: "Renderizamos la malla real de 400 puntos (20×20) de Copernicus DEM GLO-90 sobre la Zona Metropolitana de Mérida en WebGL con geometría 100 % determinística (sin generación aleatoria).",
    storyBeats: [
      {
        id: "beat8_1",
        title: "1. Planicie cárstica de baja pendiente",
        desc: "La elevación sobre Mérida oscila en torno a los 9–11 m s.n.m. según la malla real Copernicus DEM GLO-90.",
        actionText: "Vista isométrica"
      },
      {
        id: "beat8_2",
        title: "2. Paleta topográfica por cota",
        desc: "Cambia el esquema de color para distinguir las variaciones altimétricas de la plataforma urbana.",
        actionText: "Ver topografía"
      },
      {
        id: "beat8_3",
        title: "3. Equipamiento hospitalario de referencia",
        desc: "Los nodos ancla señalan la ubicación relativa de los principales hospitales de Mérida.",
        actionText: "Ver contraste"
      }
    ],
    kpis: [
      { icon: "fa-cubes", label: "Puntos DEM Copernicus", value: "400", delta: "Malla real 20×20 Mérida", color: "var(--accent-purple)" },
      { icon: "fa-ruler-vertical", label: "Datum vertical", value: "EGM96", delta: "Metros sobre el nivel del mar", color: "var(--accent-cyan)" },
      { icon: "fa-mountain", label: "Sistema de referencia", value: "EPSG:4326", delta: "100 % determinístico", color: "var(--accent-green)" }
    ],
    insight: "<strong>Verificación técnica (dem_altimetria_merida_matrix.json):</strong> La nube de puntos 3D se genera directamente desde las 400 cotas reales de Copernicus DEM GLO-90 sin valores aleatorios."
  },

  9: {
    number: 9,
    arc: "Fase 4: Inmersión Tecnológica",
    arcIcon: "fa-cube",
    tag: "CAPÍTULO 9 • REALIDAD AUMENTADA Y BIOMOLÉCULAS",
    tabName: "Realidad Aumentada (AR)",
    primarySource: "RCSB Protein Data Bank (PDB ID: 6VXX — Glicoproteína Spike SARS-CoV-2)",
    secondarySources: ["data/silver/pdb_6vxx_estructura_molecular.json", "data/bronze/09_rcsb_pdb_6vxx_header_raw.pdb"],
    vizTitle: "Visor 3D/AR de la glicoproteína Spike (PDB 6VXX, resolución 2.8 Å)",
    vizType: "ar",
    storyTitle: "La ciencia en escala molecular",
    storyLead: "¿Cómo se organiza el trímero de la proteína Spike documentado en el Protein Data Bank?",
    storyDesc: "A partir de los metadatos y la cabecera cristalográfica oficial de RCSB PDB (ID: 6VXX, Cryo-EM a 2.8 Å), esta vista interactiva representa las tres cadenas protoméricas (A, B y C) de forma determinística con opción de vista detonada.",
    storyBeats: [
      {
        id: "beat9_1",
        title: "1. Dominio de unión al receptor (RBD)",
        desc: "Resalta la región superior donde interactúa la proteína Spike con el receptor humano ACE2.",
        actionText: "Ver modelo"
      },
      {
        id: "beat9_2",
        title: "2. Vista detonada de las 3 cadenas",
        desc: "Separa los tres protómeros (Cadenas A, B y C) para inspeccionar el núcleo central.",
        actionText: "Explosión estructural"
      },
      {
        id: "beat9_3",
        title: "3. Proyección móvil AR",
        desc: "Muestra el acceso para visualización en dispositivos compatibles con WebXR y AR QuickLook.",
        actionText: "Ver visor AR"
      }
    ],
    kpis: [
      { icon: "fa-dna", label: "Modelo RCSB PDB", value: "6VXX", delta: "Resolución 2.8 Å (Cryo-EM)", color: "var(--accent-purple)" },
      { icon: "fa-atom", label: "Cadenas protoméricas", value: "A, B, C", delta: "Trímero oficial CC0 1.0", color: "var(--accent-cyan)" },
      { icon: "fa-calendar-check", label: "Publicación oficial", value: "2020-03-11", delta: "RCSB Protein Data Bank", color: "var(--accent-coral)" }
    ],
    insight: "<strong>Verificación técnica (pdb_6vxx_estructura_molecular.json):</strong> Los metadatos y la cabecera oficial de 250 KB provienen directamente de RCSB PDB bajo licencia CC0 1.0."
  }
};
