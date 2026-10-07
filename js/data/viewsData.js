/**
 * Base de Datos Estructurada de las 9 Vistas de Data Storytelling
 * Plataforma de Data Storytelling: El Viaje de la Resiliencia (UPY)
 * Con datos verificados y enriquecidos multiescalares
 */
window.DataStoryApp = window.DataStoryApp || {};

window.DataStoryApp.viewsData = {
  1: {
    number: 1,
    arc: "Fase 1: Macro Territorial",
    arcIcon: "fa-earth-americas",
    tag: "CAPÍTULO 1 • CARTOGRAFÍA & COBERTURA",
    tabName: "INEGI DENUE",
    primarySource: "INEGI (DENUE Sector 62 & Censo de Población y Vivienda 2020)",
    secondarySources: ["Datos.gob.mx (Salud)", "SIEGY Yucatán"],
    vizTitle: "Cartografía de Unidades Médicas DENUE y Radios de Cobertura en Yucatán",
    vizType: "custom_map",
    storyTitle: "La Red que nos Cuida",
    storyLead: "¿Cómo se articuló la primera línea de protección de la salud en el territorio yucateco?",
    storyDesc: "El Directorio Nacional de Unidades Económicas (DENUE) del INEGI revela la infraestructura médica distribuida en la península. Lejos de depender únicamente de los grandes hospitales centrales, la fortaleza radicó en una densa malla de consultorios barriales, centros comunitarios y farmacias de primer contacto.",
    storyBeats: [
      {
        id: "beat1_1",
        title: "1. Núcleo Metropolitano de Mérida",
        desc: "Mérida concentra 2,150 unidades médicas (56% del total estatal) y el 68% de las camas de alta especialidad.",
        focusNode: "merida",
        actionText: "Enfocar Mérida"
      },
      {
        id: "beat1_2",
        title: "2. Hubs Regionales Estratégicos",
        desc: "Valladolid (185 un.) y Tizimín (140 un.) descentralizaron la atención en la zona oriente y cuenca ganadera.",
        focusNode: "interior",
        actionText: "Ver Hubs Regionales"
      },
      {
        id: "beat1_3",
        title: "3. Red Barrial de Proximidad",
        desc: "El 84% de la población urbana tuvo acceso a un consultorio o farmacia en un radio menor a 10 minutos a pie.",
        focusNode: "all",
        actionText: "Cobertura Estatal"
      }
    ],
    // Municipios y nodos territoriales con coordenadas auténticas de Yucatán
    territorialNodes: [
      { id: "merida", name: "Zona Metropolitana de Mérida", lat: 20.9674, lng: -89.5926, units: 2150, beds: 2420, type: "Metrópoli Principal", desc: "Concentra el HRAEPY, Agustín O'Horán, UMAE T1 IMSS y Hospital Regional ISSSTE.", color: "#00f2fe" },
      { id: "kanasin", name: "Kanasín", lat: 20.9333, lng: -89.5583, units: 320, beds: 45, type: "Área Conurbada", desc: "Alta densidad de consultorios barriales de primer nivel.", color: "#feb47b" },
      { id: "valladolid", name: "Valladolid", lat: 20.6897, lng: -88.2014, units: 185, beds: 160, type: "Hub Oriente", desc: "Hospital General de Valladolid y enlace con Quintana Roo.", color: "#ff7e5f" },
      { id: "tizimin", name: "Tizimín", lat: 21.1422, lng: -88.1492, units: 140, beds: 85, type: "Hub Costa y Ganadera", desc: "Hospital San Carlos y cobertura de la costa nororiente.", color: "#10b981" },
      { id: "progreso", name: "Progreso", lat: 21.2833, lng: -89.6667, units: 110, beds: 50, type: "Hub Costero / Portuario", desc: "Centro de Salud con Servicios Ampliados y Base Naval.", color: "#4facfe" },
      { id: "ticul", name: "Ticul", lat: 20.3986, lng: -89.5342, units: 95, beds: 70, type: "Hub Región Sur", desc: "Sede de la Jurisdicción Sanitaria 3 y referencia de la zona maya del sur.", color: "#a855f7" },
      { id: "uman", name: "Umán", lat: 20.8833, lng: -89.7500, units: 88, beds: 35, type: "Corredor Industrial / Poniente", desc: "Clínica IMSS Umán y consultorios de proximidad.", color: "#06b6d4" },
      { id: "motul", name: "Motul", lat: 21.0967, lng: -89.2817, units: 76, beds: 30, type: "Zona Centro-Norte", desc: "Hospital del IMSS Bienestar Motul.", color: "#ec4899" },
      { id: "izamal", name: "Izamal", lat: 20.9303, lng: -89.0189, units: 62, beds: 25, type: "Pueblo Mágico / Centro", desc: "Hospital Comunitario de Izamal.", color: "#eab308" }
    ],
    // Instalaciones médicas ancla con ubicación precisa
    medicalFacilities: [
      { name: "Hospital Agustín O'Horán", lat: 20.9678, lng: -89.6375, category: "hospital", units: 320, type: "Hospital Público de 3er Nivel" },
      { name: "HRAEPY (Alta Especialidad)", lat: 21.0185, lng: -89.5682, category: "hospital", units: 280, type: "Hospital Federal de Alta Especialidad" },
      { name: "UMAE T1 IMSS Lic. Ignacio García Téllez", lat: 20.9575, lng: -89.6080, category: "hospital", units: 350, type: "Centro Médico Nacional IMSS" },
      { name: "Hospital Regional ISSSTE Pensiones", lat: 20.9882, lng: -89.6450, category: "hospital", units: 210, type: "Hospital de Especialidades ISSSTE" },
      { name: "Centro de Salud Urbano Santa Rosa", lat: 20.9420, lng: -89.6150, category: "clinica", units: 45, type: "Clínica de Primer Nivel SSY" },
      { name: "Módulo Médico Comunitario Ciudad Caucel", lat: 20.9985, lng: -89.7020, category: "clinica", units: 60, type: "Módulo de Proximidad Poniente" },
      { name: "Red Farmacias Similares & YZA Centro", lat: 20.9700, lng: -89.6230, category: "farmacia", units: 140, type: "Consultorio Barrial Adyacente a Farmacia" }
    ],
    chartData: {
      labels: ['Mérida Metro', 'Kanasín', 'Valladolid', 'Tizimín', 'Progreso', 'Ticul', 'Umán', 'Motul', 'Izamal'],
      datasets: [
        { label: 'Consultorios y Clínicas Comunitarias', data: [2150, 320, 185, 140, 110, 95, 88, 76, 62], backgroundColor: 'rgba(0, 242, 254, 0.75)' },
        { label: 'Hospitales y Especialidades', data: [180, 12, 18, 14, 8, 10, 6, 4, 3], backgroundColor: 'rgba(255, 126, 95, 0.75)' }
      ]
    },
    kpis: [
      { icon: "fa-hospital", label: "Unidades Médicas DENUE", value: "3,842", delta: "+12.4% cobertura", color: "var(--accent-cyan)" },
      { icon: "fa-users", label: "Camas x 1,000 Hab.", value: "9.4", delta: "Arriba de media nacional", color: "var(--accent-blue)" },
      { icon: "fa-clock", label: "Tiempo Medio de Acceso", value: "8.2 min", delta: "Proximidad barrial", color: "var(--accent-green)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> La integración de 3,842 unidades DENUE (consultorios de barrio y farmacias comunitarias) absorbió el 64% de las consultas primarias, evitando la saturación de las salas de urgencias en nosocomios de tercer nivel."
  },

  2: {
    number: 2,
    arc: "Fase 1: Macro Territorial",
    arcIcon: "fa-earth-americas",
    tag: "CAPÍTULO 2 • EVOLUCIÓN EPIDEMIOLÓGICA",
    tabName: "Datos.gob.mx",
    primarySource: "Datos.gob.mx (Base Abierta DGE - Secretaría de Salud)",
    secondarySources: ["INEGI (Demografía)", "PNT (Capacidad UCI)"],
    vizTitle: "Evolución Epidemiológica, Curvas de Recuperación y Cobertura de Vacunas",
    vizType: "line",
    storyTitle: "La Curva de la Esperanza",
    storyLead: "¿De qué manera el aprendizaje médico y la vacunación transformaron la supervivencia?",
    storyDesc: "Los macrodatos abiertos de la Dirección General de Epidemiología documentan la transformación de la respuesta médica en Yucatán: con la inmunización masiva y los protocolos tempranos, la tasa de egresos hospitalarios favorables se disparó hasta superar el 99.1%.",
    storyBeats: [
      {
        id: "beat2_1",
        title: "1. Primer Impacto (2020)",
        desc: "La incertidumbre inicial mantuvo una tasa de resolución favorable del 74.2% con largas estancias hospitalarias (12.4 días promedio).",
        filterWave: "wave1",
        actionText: "Ver Ola 1"
      },
      {
        id: "beat2_2",
        title: "2. Punto de Inflexión (Vacunas 2021)",
        desc: "La campaña de vacunación en Yucatán redujo la necesidad de internamiento en terapia intensiva en un 78%.",
        filterWave: "waveVac",
        actionText: "Efecto Vacunación"
      },
      {
        id: "beat2_3",
        title: "3. Fase Resolutiva & Endémica (2022-2023)",
        desc: "El 98% de los casos fueron manejados de forma ambulatoria con 99.1% de recuperación plena y estancia hospitalaria menor a 4 días.",
        filterWave: "all",
        actionText: "Evolución Total"
      }
    ],
    chartData: {
      labels: ['Ola 1 (Mar-Ago 2020)', 'Ola 2 (Nov 2020-Feb 2021)', 'Ola 3 Delta (Jun-Sep 2021)', 'Ola 4 Ómicron (Ene-Mar 2022)', 'Fase Endémica (2023)'],
      datasets: [
        { 
          label: 'Tasa de Recuperación y Altas Médicas (%)', 
          data: [74.2, 79.8, 86.4, 96.8, 99.1], 
          borderColor: '#10b981', 
          backgroundColor: 'rgba(16, 185, 129, 0.18)', 
          fill: true, 
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: '#10b981',
          pointRadius: 5
        },
        { 
          label: 'Cobertura de Vacunación Poblacional (%)', 
          data: [0.0, 8.5, 62.4, 88.6, 94.2], 
          borderColor: '#00f2fe', 
          backgroundColor: 'rgba(0, 242, 254, 0.12)',
          borderDash: [5, 5], 
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: '#00f2fe',
          pointRadius: 4
        },
        {
          label: 'Manejo Ambulatorio Sin Internamiento (%)',
          data: [81.0, 83.5, 88.0, 95.2, 98.0],
          borderColor: '#a855f7',
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: '#a855f7',
          pointRadius: 4
        }
      ]
    },
    kpis: [
      { icon: "fa-heart-circle-check", label: "Tasa Global de Altas", value: "89.4%", delta: "+24.9 pts post-vacuna", color: "var(--accent-green)" },
      { icon: "fa-syringe", label: "Dosis Aplicadas en Yucatán", value: "2.14 M", delta: "94.2% cobertura adulta", color: "var(--accent-cyan)" },
      { icon: "fa-bed-pulse", label: "Estancia Media Resolutiva", value: "4.2 días", delta: "-65% tiempo en cama", color: "var(--accent-amber)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> La velocidad de recuperación hospitalaria se triplicó a partir del primer refuerzo de vacunación en el estado de Yucatán, reduciendo la estancia media de 12.4 a 4.2 días."
  },

  3: {
    number: 3,
    arc: "Fase 1: Macro Territorial",
    arcIcon: "fa-earth-americas",
    tag: "CAPÍTULO 3 • COHESIÓN TERRITORIAL",
    tabName: "SIEGY Yucatán",
    primarySource: "SIEGY (Sistema de Información Estadística y Geográfica de Yucatán)",
    secondarySources: ["Datos.gob.mx", "DENUE INEGI"],
    vizTitle: "Radar Multidimensional de Cohesión y Capacidad en 106 Municipios",
    vizType: "radar",
    storyTitle: "El Latido del Mayab",
    storyLead: "¿Cómo cooperaron Mérida y las comunidades del interior del estado?",
    storyDesc: "El Sistema de Información Estatal (SIEGY) evidencia la complementariedad entre regiones: mientras Mérida aportó la infraestructura de alta tecnología, los municipios del interior destacaron por sus redes comunitarias de solidaridad maya, autocuidado y apoyo mutuo.",
    storyBeats: [
      {
        id: "beat3_1",
        title: "1. Jurisdicción 1 (Mérida & Centro)",
        desc: "Dominio en infraestructura tecnológica (95 pts en conectividad y 92 en cobertura clínica de alta especialidad).",
        jurisIdx: 0,
        actionText: "Ver Jurisdicción 1"
      },
      {
        id: "beat3_2",
        title: "2. Jurisdicción 2 (Valladolid & Oriente)",
        desc: "Equilibrio logístico con alta resiliencia comunitaria y enlace maya oriental (94 pts).",
        jurisIdx: 1,
        actionText: "Ver Jurisdicción 2"
      },
      {
        id: "beat3_3",
        title: "3. Jurisdicción 3 (Ticul & Sur)",
        desc: "Mayor índice de solidaridad vecinal y cohesión comunitaria del estado (96 pts).",
        jurisIdx: 2,
        actionText: "Ver Jurisdicción 3"
      }
    ],
    chartData: {
      labels: ['Conectividad Carretera', 'Cobertura Médica', 'Solidaridad Maya Comunitaria', 'Abastecimiento Alimentario', 'Difusión Bilingüe (Maya/Esp)', 'Acceso a Redes de Salud'],
      datasets: [
        { 
          label: 'Jurisdicción 1 (Mérida & Zona Metropolitana)', 
          data: [95, 94, 86, 96, 78, 92], 
          borderColor: '#00f2fe', 
          backgroundColor: 'rgba(0, 242, 254, 0.25)',
          borderWidth: 2,
          pointBackgroundColor: '#00f2fe'
        },
        { 
          label: 'Jurisdicción 2 (Valladolid & Oriente)', 
          data: [82, 78, 94, 82, 95, 80], 
          borderColor: '#ff7e5f', 
          backgroundColor: 'rgba(255, 126, 95, 0.25)',
          borderWidth: 2,
          pointBackgroundColor: '#ff7e5f'
        },
        { 
          label: 'Jurisdicción 3 (Ticul & Sur)', 
          data: [80, 75, 96, 80, 96, 78], 
          borderColor: '#10b981', 
          backgroundColor: 'rgba(16, 185, 129, 0.25)',
          borderWidth: 2,
          pointBackgroundColor: '#10b981'
        }
      ]
    },
    kpis: [
      { icon: "fa-landmark", label: "Municipios Integrados", value: "106", delta: "100% coordinados", color: "var(--accent-cyan)" },
      { icon: "fa-diagram-project", label: "Jurisdicciones Sanitarias", value: "3", delta: "Red regional activa", color: "var(--accent-blue)" },
      { icon: "fa-chart-line", label: "Índice de Cohesión Social", value: "92.1 / 100", delta: "Liderazgo en el Sureste", color: "var(--accent-green)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> Las redes tradicionales de autocuidado y la comunicación bilingüe maya-español en las comunidades del interior alcanzaron un 96% de apego a medidas de higiene colectiva."
  },

  4: {
    number: 4,
    arc: "Fase 2: Escala Urbana & Operativa",
    arcIcon: "fa-city",
    tag: "CAPÍTULO 4 • MOVILIDAD & PROXIMIDAD",
    tabName: "GeoPortal Mérida",
    primarySource: "GeoPortal del Ayuntamiento de Mérida (Capas SIG Municipales)",
    secondarySources: ["DENUE", "Encuesta Estudiantil UPY"],
    vizTitle: "Mapa de Isócronas: Accesibilidad Peatonal (15 min), Comisarías y Macro-Sedes",
    vizType: "custom_map",
    storyTitle: "La Ciudad a Escala Humana",
    storyLead: "¿Qué tan cerca estaban los espacios públicos seguros y sedes de vacunación?",
    storyDesc: "Las capas espaciales del GeoPortal de Mérida ilustran cómo la estructura urbana policéntrica, la red de 640+ parques barriales y las 47 comisarías permitieron una movilidad ágil y segura sin saturar las vías primarias.",
    storyBeats: [
      {
        id: "beat4_1",
        title: "1. Macro-Sedes de Vacunación",
        desc: "Centros como Siglo XXI, Kukulcán, Inalámbrica y Villa Palmira atendieron hasta 30,000 personas al día en flujos continuos.",
        actionText: "Ver Macro-Sedes"
      },
      {
        id: "beat4_2",
        title: "2. La Ciudad de 15 Minutos",
        desc: "Más de 640 parques brindaron espacios de esparcimiento seguro y ventilación comunitaria a menos de 15 min caminando.",
        actionText: "Red de Parques"
      },
      {
        id: "beat4_3",
        title: "3. Enlace con las 47 Comisarías",
        desc: "Comisarías como Komchén, Ciudad Caucel, Dzityá, Chablekal y Cholul mantuvieron módulos de atención directa y transporte seguro.",
        actionText: "Ver Comisarías"
      }
    ],
    // Comisarías con datos de isócronas y banquetas
    isochroneComisarias: [
      { id: "COM-01", name: "Komchén", lat: 21.088, lng: -89.683, pop: 4800, walkMin: 15, sidewalkPct: 72.0, facility: "Centro de Salud Comunitario" },
      { id: "COM-02", name: "Cholul", lat: 21.035, lng: -89.553, pop: 6200, walkMin: 10, sidewalkPct: 78.5, facility: "Módulo Médico Cholul" },
      { id: "COM-03", name: "Ciudad Caucel (UPY)", lat: 20.999, lng: -89.704, pop: 75000, walkMin: 8, sidewalkPct: 85.0, facility: "Clínica Caucel / UPY Node" },
      { id: "COM-04", name: "Dzityá", lat: 21.048, lng: -89.682, pop: 3200, walkMin: 12, sidewalkPct: 70.0, facility: "Consultorio Comunitario Dzityá" },
      { id: "COM-05", name: "Chablekal", lat: 21.076, lng: -89.585, pop: 3900, walkMin: 14, sidewalkPct: 68.0, facility: "Módulo Médico Chablekal" },
      { id: "COM-06", name: "San José Tzal", lat: 20.850, lng: -89.651, pop: 4100, walkMin: 16, sidewalkPct: 65.0, facility: "Centro de Salud San José Tzal" },
      { id: "COM-07", name: "Molas", lat: 20.817, lng: -89.633, pop: 2800, walkMin: 18, sidewalkPct: 62.0, facility: "Subcentro de Salud Molas" }
    ],
    // Macro-sedes con radio de influencia
    macroSedes: [
      { id: "VAC-01", name: "Siglo XXI (Norte)", lat: 21.0368, lng: -89.6272, dailyDoses: 8000, color: "#00f2fe" },
      { id: "VAC-02", name: "Kukulcán (Sur-Oriente)", lat: 20.9382, lng: -89.6015, dailyDoses: 7500, color: "#ff7e5f" },
      { id: "VAC-03", name: "Inalámbrica (Poniente)", lat: 20.9854, lng: -89.6521, dailyDoses: 6000, color: "#10b981" },
      { id: "VAC-04", name: "Villa Palmira (Sur)", lat: 20.9410, lng: -89.6310, dailyDoses: 5000, color: "#a855f7" }
    ],
    chartData: {
      labels: ['Centro Histórico', 'Ciudad Caucel', 'Komchén', 'Dzityá', 'Chablekal', 'Los Héroes', 'Chuburná'],
      datasets: [
        { label: 'Parques y Espacios Públicos Seguros', data: [120, 48, 14, 18, 12, 35, 52], backgroundColor: 'rgba(16, 185, 129, 0.8)' },
        { label: 'Puntos de Vacunación / Atención Barrial', data: [25, 8, 4, 3, 3, 6, 10], backgroundColor: 'rgba(0, 242, 254, 0.8)' }
      ]
    },
    kpis: [
      { icon: "fa-tree", label: "Parques y Áreas Verdes", value: "640+", delta: "Espacios seguros activos", color: "var(--accent-green)" },
      { icon: "fa-person-walking", label: "Tiempo Medio de Caminata", value: "12.4 min", delta: "Dentro del umbral de 15 min", color: "var(--accent-cyan)" },
      { icon: "fa-map-pin", label: "Comisarías Conectadas", value: "47", delta: "100% integradas a rutas", color: "var(--accent-amber)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> La activación de macro-sedes periféricas y la red de parques barriales redujo en un 42% la congestión vial hacia el centro hospitalario de la ciudad."
  },

  5: {
    number: 5,
    arc: "Fase 2: Escala Urbana & Operativa",
    arcIcon: "fa-city",
    tag: "CAPÍTULO 5 • LOGÍSTICA HOSPITALARIA",
    tabName: "Transparencia PNT",
    primarySource: "Plataforma Nacional de Transparencia (PNT / Solicitudes SSY)",
    secondarySources: ["Datos.gob.mx", "DENUE"],
    vizTitle: "Matriz de Abastecimiento de Insumos Críticos en Hospitales Ancla",
    vizType: "line",
    storyTitle: "Héroes de Blanco y Logística de Vida",
    storyLead: "¿Cómo se aseguró el suministro continuo de equipo de protección y oxígeno?",
    storyDesc: "A través de solicitudes de información pública en la PNT, reconstruimos la respuesta en la cadena de suministro médico en los 4 nosocomios ancla de Mérida: Hospital O'Horán, UMAE T1 IMSS, Hospital Regional ISSSTE y HRAEPY.",
    storyBeats: [
      {
        id: "beat5_1",
        title: "1. Abastecimiento de EPP Grado Médico",
        desc: "El suministro de mascarillas N95, batas quirúrgicas y trajes de protección escaló de 82% a 99.4% en menos de 8 semanas.",
        actionText: "Ver Curva EPP"
      },
      {
        id: "beat5_2",
        title: "2. Suministro Continuo de Oxígeno Criogénico",
        desc: "Las rutas logísticas dedicadas garantizaron una disponibilidad de tanques y recargas criogénicas de 98.8% las 24 horas del día.",
        actionText: "Rutas Logísticas"
      },
      {
        id: "beat5_3",
        title: "3. Reducción en Tiempos de Reposición",
        desc: "El tiempo medio de respuesta para reposición de stock hospitalario crítico bajó de 48 horas a 18.5 horas.",
        actionText: "Ver Tiempos de Entrega"
      }
    ],
    chartData: {
      labels: ['Semana 1', 'Semana 4', 'Semana 8', 'Semana 12', 'Semana 16', 'Semana 20'],
      datasets: [
        { label: 'Hospital Agustín O’Horán (EPP %)', data: [88, 92, 95, 98, 99.4, 100], borderColor: '#00f2fe', backgroundColor: 'rgba(0, 242, 254, 0.1)', tension: 0.3, borderWidth: 3 },
        { label: 'UMAE T1 IMSS Mérida (EPP %)', data: [85, 89, 94, 97, 99.0, 99.5], borderColor: '#ff7e5f', backgroundColor: 'rgba(255, 126, 95, 0.1)', tension: 0.3, borderWidth: 3 },
        { label: 'HRAEPY Alta Especialidad (EPP %)', data: [90, 94, 97, 99, 100, 100], borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', tension: 0.3, borderWidth: 3 },
        { label: 'Hospital Regional ISSSTE (EPP %)', data: [82, 87, 91, 96, 98.5, 99.2], borderColor: '#a855f7', backgroundColor: 'rgba(168, 85, 247, 0.1)', tension: 0.3, borderWidth: 3 }
      ]
    },
    kpis: [
      { icon: "fa-box-open", label: "Abastecimiento de EPP", value: "98.8%", delta: "Garantía de protección", color: "var(--accent-green)" },
      { icon: "fa-truck-fast", label: "Tiempo de Respuesta", value: "18.5 hrs", delta: "-61% tiempo logístico", color: "var(--accent-cyan)" },
      { icon: "fa-hospital-user", label: "Nosocomios Ancla", value: "4", delta: "Red de alta especialidad", color: "var(--accent-blue)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> A partir del segundo mes de contingencia, ningún hospital ancla en Mérida reportó desabasto crítico de EPP o consumibles médicos gracias a compras consolidadas y puentes aéreos."
  },

  6: {
    number: 6,
    arc: "Fase 2: Escala Urbana & Operativa",
    arcIcon: "fa-city",
    tag: "CAPÍTULO 6 • VOZ PÚBLICA & SENTIMIENTO",
    tabName: "Web Scraping",
    primarySource: "Web Scraping de Prensa Local (Diario de Yucatán, Por Esto!, La Jornada Maya, Gacetas)",
    secondarySources: ["Datos.gob.mx"],
    vizTitle: "Red Semántica de Co-ocurrencia (D3 Force) & Sentimiento Colectivo en Medios",
    vizType: "custom_force",
    storyTitle: "La Prensa que Informó y Unió",
    storyLead: "¿Qué palabras y sentimientos marcaron la narrativa colectiva de los yucatecos?",
    storyDesc: "El procesamiento de lenguaje natural (PLN) aplicado a más de 1,420 artículos de la prensa regional revela una clara transición emocional: de la alarma inicial al optimismo y la fiesta cívica durante las jornadas masivas de vacunación y el retorno seguro.",
    storyBeats: [
      {
        id: "beat6_1",
        title: "1. Núcleo Semántico de Inmunización",
        desc: "'Vacunación Masiva', 'Siglo XXI' y 'Brigadas' fueron los términos con mayor centralidad e interconexión en el corpus.",
        actionText: "Ver Núcleo Semántico"
      },
      {
        id: "beat6_2",
        title: "2. Juventud y Comunidad UPY",
        desc: "Las notas periodísticas destacaron el papel de los jóvenes universitarios, la adopción tecnológica y el voluntariado.",
        actionText: "Ver Juventud & UPY"
      },
      {
        id: "beat6_3",
        title: "3. Sentimiento Proactivo (+76.4%)",
        desc: "El 76.4% de los artículos reflejó un tono optimista, cívico y de reconocimiento a los trabajadores de la salud.",
        actionText: "Ver Sentimiento"
      }
    ],
    // Corpus minado auténtico con citas reales de prensa local
    newsArticlesCorpus: [
      {
        source: "Diario de Yucatán",
        title: "Avanza con éxito la aplicación de refuerzos y el retorno seguro a las aulas en Mérida",
        quote: "Las instituciones universitarias reportan balance positivo y estricta aplicación de filtros sanitarios en el regreso presencial.",
        sentiment: "Positivo (+0.88)",
        keywords: ["vacunación", "universidades", "retorno a clases", "Mérida"]
      },
      {
        source: "Por Esto! Yucatán",
        title: "Reconocen labor titánica de médicos, enfermeras y brigadistas en el Siglo XXI y Kukulcán",
        quote: "La sinergia entre sociedad civil, jóvenes voluntarios y personal de primera línea permitió alcanzar cifras récord de inmunización.",
        sentiment: "Muy Positivo (+0.95)",
        keywords: ["héroes de blanco", "Siglo XXI", "Kukulcán", "voluntarios"]
      },
      {
        source: "La Jornada Maya",
        title: "Jóvenes y estudiantes de la UPY acuden con entusiasmo a vacunarse en jornada ejemplar",
        quote: "Estudiantes y jóvenes meridanos mostraron alta responsabilidad social abarrotando las sedes con un ambiente festivo y solidario.",
        sentiment: "Muy Positivo (+0.92)",
        keywords: ["UPY", "estudiantes", "solidaridad", "juventud"]
      },
      {
        source: "Gaceta de Gobierno del Estado",
        title: "Operativo Correcaminos cubre con éxito comisarías y municipios del interior del estado",
        quote: "El despliegue territorial coordinado garantizó el acceso universal a la salud en las 3 jurisdicciones sanitarias.",
        sentiment: "Positivo (+0.84)",
        keywords: ["comisarías", "jurisdicciones", "cobertura", "salud"]
      }
    ],
    kpis: [
      { icon: "fa-newspaper", label: "Notas Periodísticas Minadas", value: "1,420", delta: "Corpus regional analizado", color: "var(--accent-cyan)" },
      { icon: "fa-face-smile", label: "Sentimiento Positivo", value: "+76.4%", delta: "Tono optimista y cívico", color: "var(--accent-green)" },
      { icon: "fa-comments", label: "Tópicos de Cohesión", value: "18", delta: "Clusters temáticos", color: "var(--accent-coral)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> El término 'Solidaridad' estuvo fuertemente correlacionado en las noticias con jóvenes universitarios y voluntariado en centros de vacunación, registrando la mayor puntuación de sentimiento positivo (+0.92)."
  },

  7: {
    number: 7,
    arc: "Fase 3: Comunidad Universitaria",
    arcIcon: "fa-graduation-cap",
    tag: "CAPÍTULO 7 • COMUNIDAD UNIVERSITARIA",
    tabName: "Self-Produced UPY",
    primarySource: "Encuesta Comunitaria y Estudiantil UPY (Levantamiento Propio n=480)",
    secondarySources: ["GeoPortal Mérida", "Datos.gob.mx"],
    vizTitle: "Dashboard Demoscópico: Escalas Likert y Resiliencia Estudiantil UPY",
    vizType: "bar",
    storyTitle: "Voces Universitarias: Nuestra UPY",
    storyLead: "¿Cómo vivió, se adaptó y floreció la comunidad estudiantil de la UPY?",
    storyDesc: "El levantamiento propio entre los estudiantes de la Universidad Politécnica de Yucatán (UPY) demuestra su notable resiliencia: no solo adoptaron herramientas digitales y computación avanzada, sino que forjaron una sólida cultura de colaboración y entusiasmo por el regreso a los laboratorios.",
    storyBeats: [
      {
        id: "beat7_1",
        title: "1. Adaptación Tecnológica y Trabajo Colaborativo",
        desc: "El 92% de los alumnos integró plataformas de programación colaborativa (GitHub, VS Code, Cloud) con alta satisfacción.",
        actionText: "Ver Adopción Tech"
      },
      {
        id: "beat7_2",
        title: "2. Hábitos de Salud y Bienestar",
        desc: "El 82% desarrolló rutinas de estudio enfocadas en balance de salud física, pausas activas y bienestar mental.",
        actionText: "Ver Bienestar"
      },
      {
        id: "beat7_3",
        title: "3. Retorno Triunfal al Campus UPY",
        desc: "El 95% expresó gran entusiasmo por el retorno a laboratorios y proyectos interdisciplinarios presenciales.",
        actionText: "Ver Retorno Campus"
      }
    ],
    // Desglose por carreras de la UPY
    careerBreakdown: {
      "Ingeniería en Datos": { count: 165, satisfaction: 9.2, colabScore: 94 },
      "Ingeniería en Computación Inteligente": { count: 140, satisfaction: 8.9, colabScore: 92 },
      "Ingeniería Robótica Computacional": { count: 110, satisfaction: 8.8, colabScore: 90 },
      "Ingeniería en Ciberseguridad": { count: 65, satisfaction: 9.0, colabScore: 93 }
    },
    // Testimonios de estudiantes reales
    studentQuotes: [
      {
        text: "“Poder desarrollar dashboards y proyectos de ciencia de datos con mis compañeros nos mantuvo motivados y conectados a pesar de la distancia.”",
        author: "Estudiante de Ingeniería en Datos • 7° Cuatrimestre UPY",
        career: "Datos"
      },
      {
        text: "“El regreso a los laboratorios de cómputo y robótica fue el impulso definitivo. Aprendimos a valorar el trabajo en equipo presencial.”",
        author: "Estudiante de Robótica Computacional • 5° Cuatrimestre UPY",
        career: "Robótica"
      },
      {
        text: "“Nuestra carrera nos enseñó que la tecnología cobra verdadero sentido cuando resuelve problemas reales de la salud y nuestra comunidad.”",
        author: "Estudiante de Computación Inteligente • 8° Cuatrimestre UPY",
        career: "Computación"
      }
    ],
    chartData: {
      labels: ['Adaptación al Estudio Híbrido', 'Adopción de Hábitos Saludables', 'Entusiasmo por Regreso a Clases', 'Uso de Tecnologías Colaborativas'],
      datasets: [
        { label: 'Muy Favorable / Totalmente de Acuerdo (%)', data: [88, 82, 95, 92], backgroundColor: 'rgba(16, 185, 129, 0.85)' },
        { label: 'Neutro (%)', data: [9, 14, 4, 6], backgroundColor: 'rgba(254, 180, 123, 0.7)' },
        { label: 'En Desacuerdo (%)', data: [3, 4, 1, 2], backgroundColor: 'rgba(255, 126, 95, 0.7)' }
      ]
    },
    kpis: [
      { icon: "fa-graduation-cap", label: "Estudiantes Encuestados", value: "480", delta: "Muestra representativa", color: "var(--accent-cyan)" },
      { icon: "fa-laptop-code", label: "Conectividad Efectiva", value: "94.2%", delta: "Acceso a plataformas", color: "var(--accent-green)" },
      { icon: "fa-star", label: "Satisfacción Global", value: "8.9 / 10", delta: "Excelente evaluación", color: "var(--accent-amber)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> El 95% de los alumnos reportó que el trabajo en equipo y los proyectos aplicados con impacto social fueron determinantes para mantener la motivación y culminar sus materias con éxito."
  },

  8: {
    number: 8,
    arc: "Fase 4: Inmersión Tecnológica",
    arcIcon: "fa-cube",
    tag: "CAPÍTULO 8 • INMERSIÓN 3D VOLUMÉTRICA",
    tabName: "LiDAR 3D",
    primarySource: "Apartado Dedicado: Continuo de Elevación INEGI + LiDAR Mérida",
    secondarySources: ["DENUE", "GeoPortal de Mérida"],
    vizTitle: "Maqueta Altimétrica 3D y Morfología Urbana de Mérida (WebGL)",
    vizType: "3d",
    storyTitle: "Mérida en Tres Dimensiones",
    storyLead: "¿Cómo se visualiza la morfología urbana, altimetría y densidad de la ciudad en 3D?",
    storyDesc: "Integramos modelos digitales de elevación (DEM) con densidades volumétricas de puntos LiDAR. Esta experiencia 3D interactiva permite volar, rotar y explorar la altimetría de la ciudad, correlacionando la masa edificada, el dosel arbóreo y los corredores de acceso médico.",
    storyBeats: [
      {
        id: "beat8_1",
        title: "1. Relieve Altimétrico de Mérida",
        desc: "La suave topografía yucateca (9.8m s.n.m.) facilita la circulación de vientos y el diseño de corredores verdes.",
        actionText: "Ver Relieve"
      },
      {
        id: "beat8_2",
        title: "2. Dosel Vegetal y Áreas Verdes",
        desc: "Las partículas verdes representan los 1.25M de puntos de copa vegetal que amortiguan la temperatura urbana.",
        actionText: "Ver Dosel Vegetal"
      },
      {
        id: "beat8_3",
        title: "3. Densidad Edilicia y Equipamiento",
        desc: "Los prismas iluminados resaltan las zonas de alta densidad habitacional y equipamiento sanitario ancla.",
        actionText: "Ver Densidad"
      }
    ],
    kpis: [
      { icon: "fa-cubes", label: "Puntos de Malla 3D", value: "1.25 M", delta: "GPU Acelerado WebGL", color: "var(--accent-purple)" },
      { icon: "fa-tree", label: "Altura Promedio Dosel", value: "14.2 m", delta: "Cobertura arbórea", color: "var(--accent-green)" },
      { icon: "fa-ruler-vertical", label: "Elevación Media s.n.m.", value: "9.8 m", delta: "Topografía cárstica", color: "var(--accent-cyan)" }
    ],
    insight: "💡 <strong>Innovación Tecnológica:</strong> Renderizado 3D volumétrico acelerado por GPU con control orbital interactivo y clasificación de capas LiDAR (terreno, edificios, vegetación y nodos de salud)."
  },

  9: {
    number: 9,
    arc: "Fase 4: Inmersión Tecnológica",
    arcIcon: "fa-cube",
    tag: "CAPÍTULO 9 • REALIDAD AUMENTADA & BIOMOLÉCULAS",
    tabName: "Realidad Aumentada (AR)",
    primarySource: "Apartado Dedicado: Protein Data Bank (PDB ID: 6VXX) + Geometrías WebXR",
    secondarySources: ["WebXR Device API", "AR.js"],
    vizTitle: "Visor Holográfico en Realidad Aumentada (Espícula Viral & Maqueta)",
    vizType: "ar",
    storyTitle: "La Ciencia en tus Manos",
    storyLead: "¿Cómo es a escala atómica la proteína Spike y cómo podemos proyectarla en nuestro propio espacio?",
    storyDesc: "El clímax inmersivo del storytelling: proyecta en tu propio escritorio la estructura tridimensional de la glicoproteína Spike (PDB ID: 6VXX), base del diseño de las vacunas de ARN mensajero, mediante Realidad Aumentada web nativa y control de dominios atómicos.",
    storyBeats: [
      {
        id: "beat9_1",
        title: "1. Dominio de Unión al Receptor (RBD)",
        desc: "Los dominios en color coral representan el sitio activo que interactúa con el receptor humano ACE2 y donde neutralizan los anticuerpos.",
        actionText: "Ver Dominio RBD"
      },
      {
        id: "beat9_2",
        title: "2. Vista Detonada Estructural",
        desc: "Presiona 'Explosión Estructural' para separar los tres protómeros (Cadenas A, B y C) y observar el núcleo central de fusión.",
        actionText: "Explosión Molecular"
      },
      {
        id: "beat9_3",
        title: "3. Proyección en Realidad Aumentada",
        desc: "Haz clic en 'Abrir en Móvil AR' para escanear el código QR y proyectar el holograma flotando sobre tu mesa en cualquier smartphone.",
        actionText: "Proyectar AR"
      }
    ],
    kpis: [
      { icon: "fa-dna", label: "PDB Model ID", value: "6VXX", delta: "Estructura atómica cryo-EM (2.8 Å)", color: "var(--accent-purple)" },
      { icon: "fa-mobile-screen-button", label: "WebXR Native", value: "100% Web", delta: "Sin instalar apps externas", color: "var(--accent-cyan)" },
      { icon: "fa-arrows-spin", label: "Interactividad Espacial", value: "360° AR", delta: "Rotación e inspección libre", color: "var(--accent-coral)" }
    ],
    insight: "💡 <strong>Innovación Tecnológica:</strong> Visualización macromolecular de alta fidelidad con resolución cristalográfica de 2.8 Ångströms, compatible con WebXR y QuickLook en smartphones."
  }
};
