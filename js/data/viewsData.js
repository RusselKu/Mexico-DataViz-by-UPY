/**
 * Base de Datos Estructurada de las 9 Vistas de Visualización
 * Plataforma de Data Storytelling: El Viaje de la Resiliencia (UPY)
 */
window.DataStoryApp = window.DataStoryApp || {};

window.DataStoryApp.viewsData = {
  1: {
    number: 1,
    tag: "CAPÍTULO 1 • CARTOGRAFÍA & COBERTURA",
    tabName: "INEGI DENUE",
    primarySource: "INEGI (DENUE Sector 62 & Censo de Población y Vivienda 2020)",
    secondarySources: ["Datos.gob.mx (Salud)", "SIEGY Yucatán"],
    vizTitle: "Explorador Cartográfico con Clusters y Radios de Cobertura Médica",
    vizType: "custom_map",
    customType: "gis_map",
    chartData: {
      labels: ['Mérida Metro', 'Kanasín', 'Valladolid', 'Tizimín', 'Progreso', 'Ticul', 'Umán'],
      datasets: [
        { label: 'Consultorios y Clínicas Comunitarias', data: [2150, 320, 185, 140, 110, 95, 88], backgroundColor: 'rgba(0, 242, 254, 0.75)' },
        { label: 'Hospitales y Especialidades', data: [180, 12, 18, 14, 8, 10, 6], backgroundColor: 'rgba(255, 126, 95, 0.75)' }
      ]
    },
    storyTitle: "La Red que nos Cuida",
    storyDesc: "El mapeo de unidades económicas del INEGI demuestra que la fortaleza territorial radicó en la densa red de consultorios de primer contacto y farmacias comunitarias, permitiendo una pronta atención y descentralizando la demanda médica.",
    kpis: [
      { icon: "fa-hospital", label: "Unidades Médicas DENUE", value: "3,842", color: "var(--accent-cyan)" },
      { icon: "fa-users", label: "Camas x 1,000 Hab.", value: "9.4", color: "var(--accent-blue)" },
      { icon: "fa-clock", label: "Tiempo Medio de Acceso", value: "8.2 min", color: "var(--accent-green)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> La integración de farmacias y consultorios de primer nivel redujo la saturación en nosocomios de alta especialidad en más de un 35%."
  },
  2: {
    number: 2,
    tag: "CAPÍTULO 2 • EVOLUCIÓN EPIDEMIOLÓGICA",
    tabName: "Datos.gob.mx",
    primarySource: "Datos.gob.mx (Base Abierta DGE - Secretaría de Salud)",
    secondarySources: ["INEGI (Demografía)", "PNT (Capacidad UCI)"],
    vizTitle: "Diagrama de Flujo Clínico & Curvas de Altas Médicas Exitosas",
    vizType: "line",
    chartData: {
      labels: ['Ola 1 (2020)', 'Ola 2 (2021)', 'Ola 3 - Delta', 'Ola 4 - Ómicron (2022)', 'Fase Endémica (2023)'],
      datasets: [
        { 
          label: 'Tasa de Altas Médicas y Recuperación (%)', 
          data: [74.2, 79.8, 86.4, 96.8, 99.1], 
          borderColor: '#10b981', 
          backgroundColor: 'rgba(16, 185, 129, 0.18)', 
          fill: true, 
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: '#10b981'
        },
        { 
          label: 'Tasa de Manejo Ambulatorio (%)', 
          data: [81.0, 83.5, 88.0, 95.2, 98.0], 
          borderColor: '#00f2fe', 
          borderDash: [5, 5], 
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: '#00f2fe'
        }
      ]
    },
    storyTitle: "La Curva de la Esperanza",
    storyDesc: "Los macrodatos epidemiológicos evidencian la transformación de la respuesta médica: con la llegada de las campañas de inmunización masiva, el porcentaje de altas exitosas superó el 96% en las fases avanzadas.",
    kpis: [
      { icon: "fa-heart-circle-check", label: "Tasa Global de Altas", value: "89.4%", color: "var(--accent-green)" },
      { icon: "fa-syringe", label: "Dosis Aplicadas en Yucatán", value: "2.14 M", color: "var(--accent-cyan)" },
      { icon: "fa-bed-pulse", label: "Estancia Media Resolutiva", value: "4.2 días", color: "var(--accent-amber)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> La velocidad de recuperación hospitalaria se triplicó a partir del primer refuerzo de vacunación en el estado."
  },
  3: {
    number: 3,
    tag: "CAPÍTULO 3 • COHESIÓN TERRITORIAL",
    tabName: "SIEGY Yucatán",
    primarySource: "SIEGY (Sistema de Información Estadística y Geográfica de Yucatán)",
    secondarySources: ["Datos.gob.mx", "DENUE INEGI"],
    vizTitle: "Radar Multidimensional de Cohesión y Capacidad en 106 Municipios",
    vizType: "radar",
    chartData: {
      labels: ['Conectividad Vial', 'Cobertura Médica', 'Resiliencia Comunitaria', 'Abastecimiento', 'Soporte Social'],
      datasets: [
        { 
          label: 'Jurisdicción 1 (Mérida & Alrededores)', 
          data: [95, 92, 88, 96, 90], 
          borderColor: '#00f2fe', 
          backgroundColor: 'rgba(0, 242, 254, 0.25)',
          borderWidth: 2
        },
        { 
          label: 'Jurisdicción 2 (Valladolid & Oriente)', 
          data: [82, 78, 94, 80, 89], 
          borderColor: '#ff7e5f', 
          backgroundColor: 'rgba(255, 126, 95, 0.25)',
          borderWidth: 2
        },
        { 
          label: 'Jurisdicción 3 (Ticul & Sur)', 
          data: [80, 75, 96, 78, 92], 
          borderColor: '#10b981', 
          backgroundColor: 'rgba(16, 185, 129, 0.25)',
          borderWidth: 2
        }
      ]
    },
    storyTitle: "El Latido del Mayab",
    storyDesc: "La información estatal del SIEGY demuestra la sinergia entre regiones: mientras Mérida concentró la infraestructura de alta tecnología, los municipios del interior destacaron por sus admirables redes de autocuidado comunitario.",
    kpis: [
      { icon: "fa-landmark", label: "Municipios Integrados", value: "106", color: "var(--accent-cyan)" },
      { icon: "fa-diagram-project", label: "Jurisdicciones Sanitarias", value: "3", color: "var(--accent-blue)" },
      { icon: "fa-chart-line", label: "Índice de Cohesión Social", value: "92.1 / 100", color: "var(--accent-green)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> Las redes tradicionales de solidaridad comunitaria en el Mayab registraron los mayores índices de apego a medidas preventivas colectivas."
  },
  4: {
    number: 4,
    tag: "CAPÍTULO 4 • MOVILIDAD & PROXIMIDAD",
    tabName: "GeoPortal Mérida",
    primarySource: "GeoPortal del Ayuntamiento de Mérida (Capas SIG Municipales)",
    secondarySources: ["DENUE", "Encuesta Estudiantil UPY"],
    vizTitle: "Mapa de Isócronas: Accesibilidad a Pie (15 min) y Comisarías",
    vizType: "bar",
    chartData: {
      labels: ['Centro Histórico', 'Caucel', 'Komchén', 'Dzityá', 'Chablekal', 'Los Héroes', 'Chuburná'],
      datasets: [
        { label: 'Parques y Espacios Públicos Seguros', data: [120, 48, 14, 18, 12, 35, 52], backgroundColor: 'rgba(16, 185, 129, 0.8)' },
        { label: 'Puntos de Vacunación / Atención Barrial', data: [25, 8, 4, 3, 3, 6, 10], backgroundColor: 'rgba(0, 242, 254, 0.8)' }
      ]
    },
    storyTitle: "La Ciudad a Escala Humana",
    storyDesc: "A través de las capas vectoriales del GeoPortal de Mérida, exploramos cómo la distribución de comisarías y parques de barrio facilitó una rápida reactivación de actividades al aire libre y una movilidad vecinal de proximidad.",
    kpis: [
      { icon: "fa-tree", label: "Parques y Áreas Verdes", value: "640+", color: "var(--accent-green)" },
      { icon: "fa-person-walking", label: "Tiempo Medio de Caminata", value: "12.4 min", color: "var(--accent-cyan)" },
      { icon: "fa-map-pin", label: "Comisarías Conectadas", value: "47", color: "var(--accent-amber)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> La activación de macro-sedes (Siglo XXI, Kukulcán, Villa Palmira) permitió vacunar a más de 30,000 personas por jornada con flujo vehicular continuo."
  },
  5: {
    number: 5,
    tag: "CAPÍTULO 5 • LOGÍSTICA HOSPITALARIA",
    tabName: "Transparencia PNT",
    primarySource: "Plataforma Nacional de Transparencia (PNT / Solicitudes SSY)",
    secondarySources: ["Datos.gob.mx", "DENUE"],
    vizTitle: "Raincloud & Matriz de Abastecimiento de Insumos Hospitalarios",
    vizType: "line",
    chartData: {
      labels: ['Semana 1', 'Semana 4', 'Semana 8', 'Semana 12', 'Semana 16', 'Semana 20'],
      datasets: [
        { label: 'Hospital Agustín O’Horán (EPP %)', data: [88, 92, 95, 98, 99, 100], borderColor: '#00f2fe', tension: 0.3, borderWidth: 3 },
        { label: 'UMAE T1 IMSS Mérida (EPP %)', data: [85, 89, 94, 97, 99, 99], borderColor: '#ff7e5f', tension: 0.3, borderWidth: 3 },
        { label: 'Hospital Regional ISSSTE (EPP %)', data: [82, 87, 91, 96, 98, 99], borderColor: '#a855f7', tension: 0.3, borderWidth: 3 }
      ]
    },
    storyTitle: "Héroes de Blanco y Logística de Vida",
    storyDesc: "Las solicitudes de información pública ante la SSY e instituciones de salud revelan el enorme esfuerzo logístico para garantizar el suministro ininterrumpido de equipo de protección personal y oxígeno en los centros críticos.",
    kpis: [
      { icon: "fa-box-open", label: "Abastecimiento de EPP", value: "98.2%", color: "var(--accent-green)" },
      { icon: "fa-truck-fast", label: "Tiempo de Respuesta", value: "18.5 hrs", color: "var(--accent-cyan)" },
      { icon: "fa-hospital-user", label: "Nosocomios Ancla", value: "4", color: "var(--accent-blue)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> La tasa de disponibilidad de insumos críticos se mantuvo por encima del 95% a partir del segundo mes de contingencia en Mérida."
  },
  6: {
    number: 6,
    tag: "CAPÍTULO 6 • VOZ PÚBLICA & SENTIMIENTO",
    tabName: "Web Scraping",
    primarySource: "Web Scraping de Prensa Local (Diario de Yucatán, Por Esto!, Gacetas)",
    secondarySources: ["Datos.gob.mx"],
    vizTitle: "Red Semántica de Co-ocurrencia (D3 Force) & Sentimiento Colectivo",
    vizType: "custom_force",
    chartData: {
      labels: ['Vacunación Masiva', 'Solidaridad / Apoyo', 'Reapertura Segura', 'Estudiantes UPY', 'Ciencia & Salud', 'Espacios Públicos'],
      datasets: [
        { label: 'Menciones Positivas en Prensa', data: [840, 620, 510, 430, 390, 310], backgroundColor: 'rgba(0, 242, 254, 0.75)' },
        { label: 'Menciones Neutras / Informativas', data: [310, 180, 220, 150, 120, 90], backgroundColor: 'rgba(148, 163, 184, 0.4)' }
      ]
    },
    storyTitle: "La Prensa que Informó y Unió",
    storyDesc: "El análisis de procesamiento de lenguaje natural aplicado a notas informativas revela cómo la narrativa colectiva transitó velozmente de la alerta inicial hacia la celebración cívica de las jornadas de vacunación.",
    kpis: [
      { icon: "fa-newspaper", label: "Notas Periodísticas Minadas", value: "1,420", color: "var(--accent-cyan)" },
      { icon: "fa-face-smile", label: "Sentimiento Proactivo", value: "+76.4%", color: "var(--accent-green)" },
      { icon: "fa-comments", label: "Tópicos de Cohesión", value: "18", color: "var(--accent-coral)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> El término 'Solidaridad' estuvo fuertemente correlacionado con notas sobre la comunidad universitaria y los centros de vacunación."
  },
  7: {
    number: 7,
    tag: "CAPÍTULO 7 • COMUNIDAD UNIVERSITARIA",
    tabName: "Self-Produced UPY",
    primarySource: "Encuesta Comunitaria y Estudiantil UPY (Levantamiento Propio n=480)",
    secondarySources: ["GeoPortal Mérida", "Datos.gob.mx"],
    vizTitle: "Dashboard Demoscópico: Escalas Likert de Adaptación Estudiantil",
    vizType: "bar",
    chartData: {
      labels: ['Adaptación al Estudio Híbrido', 'Adopción de Hábitos Saludables', 'Entusiasmo por Regreso a Clases', 'Uso de Tecnologías Colaborativas'],
      datasets: [
        { label: 'Muy Favorable / Totalmente de Acuerdo (%)', data: [88, 82, 95, 92], backgroundColor: 'rgba(16, 185, 129, 0.85)' },
        { label: 'Neutro (%)', data: [9, 14, 4, 6], backgroundColor: 'rgba(254, 180, 123, 0.7)' },
        { label: 'En Desacuerdo (%)', data: [3, 4, 1, 2], backgroundColor: 'rgba(255, 126, 95, 0.7)' }
      ]
    },
    storyTitle: "Voces Universitarias: Nuestra UPY",
    storyDesc: "La encuesta directa a estudiantes de la Universidad Politécnica de Yucatán muestra una admirable capacidad de resiliencia: los jóvenes adoptaron metodologías colaborativas y valoraron enormemente el retorno al campus.",
    kpis: [
      { icon: "fa-graduation-cap", label: "Estudiantes Encuestados", value: "480", color: "var(--accent-cyan)" },
      { icon: "fa-laptop-code", label: "Conectividad Efectiva", value: "94.2%", color: "var(--accent-green)" },
      { icon: "fa-star", label: "Satisfacción Global", value: "8.9 / 10", color: "var(--accent-amber)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> El 95% de los alumnos reportó que el trabajo en equipo y los proyectos aplicados fueron determinantes para mantener la motivación."
  },
  8: {
    number: 8,
    tag: "CAPÍTULO 8 • INMERSIÓN 3D VOLUMÉTRICA",
    tabName: "LiDAR 3D",
    primarySource: "Apartado Dedicado: Continuo de Elevación INEGI + LiDAR Mérida",
    secondarySources: ["DENUE", "GeoPortal de Mérida"],
    vizTitle: "Maqueta Altimétrica 3D y Morfología Urbana de Mérida (WebGL)",
    vizType: "3d",
    storyTitle: "Mérida en Tres Dimensiones",
    storyDesc: "Exploración volumétrica de la capital yucateca: combinamos nubes de puntos LiDAR y modelos digitales de elevación para asociar la morfología arquitectónica y el dosel vegetal con los corredores de acceso a centros de salud.",
    kpis: [
      { icon: "fa-cubes", label: "Puntos de Malla 3D", value: "1.25 M", color: "var(--accent-purple)" },
      { icon: "fa-tree", label: "Altura Promedio Dosel", value: "14.2 m", color: "var(--accent-green)" },
      { icon: "fa-ruler-vertical", label: "Elevación Media s.n.m.", value: "9.8 m", color: "var(--accent-cyan)" }
    ],
    insight: "💡 <strong>Innovación Tecnológica:</strong> Renderizado 3D acelerado por GPU con control orbital interactivo para inspeccionar la densidad edilicia de la ciudad."
  },
  9: {
    number: 9,
    tag: "CAPÍTULO 9 • REALIDAD AUMENTADA & BIOMOLÉCULAS",
    tabName: "Realidad Aumentada (AR)",
    primarySource: "Apartado Dedicado: Protein Data Bank (6VXX) + Geometrías WebXR",
    secondarySources: ["WebXR Device API", "AR.js"],
    vizTitle: "Visor Holográfico en Realidad Aumentada (Espícula Viral & Maqueta)",
    vizType: "ar",
    storyTitle: "La Ciencia en tus Manos",
    storyDesc: "El clímax inmersivo del proyecto: proyecta mediante Realidad Aumentada en tu propio escritorio la estructura atómica de la proteína Spike de la vacuna y la maqueta tridimensional interactiva de la UPY.",
    kpis: [
      { icon: "fa-dna", label: "PDB Model ID", value: "6VXX", color: "var(--accent-purple)" },
      { icon: "fa-mobile-screen-button", label: "WebXR Native", value: "100% Web", color: "var(--accent-cyan)" },
      { icon: "fa-arrows-spin", label: "Interactividad Espacial", value: "360° AR", color: "var(--accent-coral)" }
    ],
    insight: "💡 <strong>Innovación Tecnológica:</strong> Compatible con smartphones mediante WebXR/QuickLook sin necesidad de instalar apps adicionales."
  }
};
