/**
 * Base de Datos Estructurada de las 9 Vistas de Visualización
 * Plataforma de Data Storytelling: El Viaje de la Resiliencia (UPY)
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
    vizTitle: "Explorador Cartográfico con Clusters y Radios de Cobertura Médica",
    vizType: "custom_map",
    storyTitle: "La Red que nos Cuida",
    storyLead: "¿Cómo se articuló la primera línea de protección de la salud en el territorio yucateco?",
    storyDesc: "El Directorio Nacional de Unidades Económicas (DENUE) del INEGI revela la infraestructura médica distribuida en la península. Lejos de depender únicamente de los grandes hospitales centrales, la fortaleza radicó en una densa malla de consultorios barriales y farmacias comunitarias.",
    storyBeats: [
      {
        id: "beat1_1",
        title: "1. Concentración en Mérida",
        desc: "Mérida concentra 2,150 unidades médicas (56% del total estatal), operando como el núcleo de alta especialidad.",
        focusNode: "merida",
        actionText: "Enfocar Mérida"
      },
      {
        id: "beat1_2",
        title: "2. Hubs Regionales del Interior",
        desc: "Valladolid (185 un.) y Tizimín (140 un.) descentralizaron la atención en la zona oriente y ganadera.",
        focusNode: "interior",
        actionText: "Ver Hubs Regionales"
      },
      {
        id: "beat1_3",
        title: "3. Red Barrial de Proximidad",
        desc: "El 84% de la población urbana tuvo acceso a un consultorio o farmacia en un radio menor a 10 minutos a pie.",
        focusNode: "all",
        actionText: "Cobertura Completa"
      }
    ],
    chartData: {
      labels: ['Mérida Metro', 'Kanasín', 'Valladolid', 'Tizimín', 'Progreso', 'Ticul', 'Umán'],
      datasets: [
        { label: 'Consultorios y Clínicas Comunitarias', data: [2150, 320, 185, 140, 110, 95, 88], backgroundColor: 'rgba(0, 242, 254, 0.75)' },
        { label: 'Hospitales y Especialidades', data: [180, 12, 18, 14, 8, 10, 6], backgroundColor: 'rgba(255, 126, 95, 0.75)' }
      ]
    },
    kpis: [
      { icon: "fa-hospital", label: "Unidades Médicas DENUE", value: "3,842", delta: "+12.4% cobertura", color: "var(--accent-cyan)" },
      { icon: "fa-users", label: "Camas x 1,000 Hab.", value: "9.4", delta: "Arriba de media nacional", color: "var(--accent-blue)" },
      { icon: "fa-clock", label: "Tiempo Medio de Acceso", value: "8.2 min", delta: "Proximidad barrial", color: "var(--accent-green)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> La integración de farmacias comunitarias y consultorios de primer nivel redujo la saturación en nosocomios de tercer nivel en más de un 35%."
  },
  2: {
    number: 2,
    arc: "Fase 1: Macro Territorial",
    arcIcon: "fa-earth-americas",
    tag: "CAPÍTULO 2 • EVOLUCIÓN EPIDEMIOLÓGICA",
    tabName: "Datos.gob.mx",
    primarySource: "Datos.gob.mx (Base Abierta DGE - Secretaría de Salud)",
    secondarySources: ["INEGI (Demografía)", "PNT (Capacidad UCI)"],
    vizTitle: "Diagrama de Flujo Clínico & Curvas de Altas Médicas Exitosas",
    vizType: "line",
    storyTitle: "La Curva de la Esperanza",
    storyLead: "¿De qué manera el aprendizaje médico y la vacunación transformaron la supervivencia?",
    storyDesc: "Los macrodatos abiertos de la Dirección General de Epidemiología documentan la transformación de la respuesta médica: con la inmunización masiva y los protocolos tempranos, la tasa de egresos hospitalarios favorables se disparó hasta superar el 99%.",
    storyBeats: [
      {
        id: "beat2_1",
        title: "1. Primer Impacto (2020)",
        desc: "La incertidumbre inicial mantuvo una tasa de resolución favorable del 74.2% con largas estancias hospitalarias.",
        filterWave: "wave1",
        actionText: "Ver Ola 1"
      },
      {
        id: "beat2_2",
        title: "2. Punto de Inflexión (Vacunas)",
        desc: "La campaña de vacunación en Yucatán redujo la necesidad de internamiento UCI en un 78%.",
        filterWave: "waveVac",
        actionText: "Efecto Vacunación"
      },
      {
        id: "beat2_3",
        title: "3. Fase Resolutiva & Endémica",
        desc: "El 98% de los casos fueron manejados de forma ambulatoria con 99.1% de recuperación plena.",
        filterWave: "all",
        actionText: "Evolución Total"
      }
    ],
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
    kpis: [
      { icon: "fa-heart-circle-check", label: "Tasa Global de Altas", value: "89.4%", delta: "+24.9 pts post-vacuna", color: "var(--accent-green)" },
      { icon: "fa-syringe", label: "Dosis Aplicadas en Yucatán", value: "2.14 M", delta: "92% cobertura adulta", color: "var(--accent-cyan)" },
      { icon: "fa-bed-pulse", label: "Estancia Media Resolutiva", value: "4.2 días", delta: "-65% tiempo en cama", color: "var(--accent-amber)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> La velocidad de recuperación hospitalaria se triplicó a partir del primer refuerzo de vacunación en el estado de Yucatán."
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
    storyDesc: "El Sistema de Información Estatal (SIEGY) evidencia la complementariedad entre regiones: mientras Mérida aportó la infraestructura de alta tecnología, los municipios del interior destacaron por sus redes comunitarias de solidaridad y apoyo mutuo.",
    storyBeats: [
      {
        id: "beat3_1",
        title: "1. Jurisdicción 1 (Mérida)",
        desc: "Dominio en infraestructura tecnológica (95 pts en conectividad y 92 en cobertura clínica).",
        jurisIdx: 0,
        actionText: "Ver Jurisdicción 1"
      },
      {
        id: "beat3_2",
        title: "2. Jurisdicción 2 (Valladolid)",
        desc: "Equilibrio logístico con alta resiliencia comunitaria y enlace maya oriental (94 pts).",
        jurisIdx: 1,
        actionText: "Ver Jurisdicción 2"
      },
      {
        id: "beat3_3",
        title: "3. Jurisdicción 3 (Ticul & Sur)",
        desc: "Mayor índice de solidaridad vecinal y cohesión social del estado (96 pts).",
        jurisIdx: 2,
        actionText: "Ver Jurisdicción 3"
      }
    ],
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
    kpis: [
      { icon: "fa-landmark", label: "Municipios Integrados", value: "106", delta: "100% coordinados", color: "var(--accent-cyan)" },
      { icon: "fa-diagram-project", label: "Jurisdicciones Sanitarias", value: "3", delta: "Red regional activa", color: "var(--accent-blue)" },
      { icon: "fa-chart-line", label: "Índice de Cohesión Social", value: "92.1 / 100", delta: "Liderazgo en el Sureste", color: "var(--accent-green)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> Las redes tradicionales de autocuidado en las comunidades mayahablantes registraron los mayores índices de apego a medidas de higiene colectiva."
  },
  4: {
    number: 4,
    arc: "Fase 2: Escala Urbana & Operativa",
    arcIcon: "fa-city",
    tag: "CAPÍTULO 4 • MOVILIDAD & PROXIMIDAD",
    tabName: "GeoPortal Mérida",
    primarySource: "GeoPortal del Ayuntamiento de Mérida (Capas SIG Municipales)",
    secondarySources: ["DENUE", "Encuesta Estudiantil UPY"],
    vizTitle: "Mapa de Isócronas: Accesibilidad a Pie (15 min) y Comisarías",
    vizType: "bar",
    storyTitle: "La Ciudad a Escala Humana",
    storyLead: "¿Qué tan cerca estaban los espacios públicos seguros y sedes de vacunación?",
    storyDesc: "Las capas espaciales del GeoPortal de Mérida ilustran cómo la estructura urbana policéntrica, la red de parques barriales y las 47 comisarías permitieron una movilidad ágil y segura sin saturar las vías primarias.",
    storyBeats: [
      {
        id: "beat4_1",
        title: "1. Macro-Sedes de Vacunación",
        desc: "Centros como Siglo XXI, Kukulcán y Villa Palmira atendieron hasta 30,000 personas al día.",
        actionText: "Ver Macro-Sedes"
      },
      {
        id: "beat4_2",
        title: "2. La Ciudad de 15 Minutos",
        desc: "Más de 640 parques brindaron espacios de esparcimiento seguro y ventilación comunitaria.",
        actionText: "Red de Parques"
      },
      {
        id: "beat4_3",
        title: "3. Enlace con Comisarías",
        desc: "Las 47 comisarías (Komchén, Caucel, Dzityá, Chablekal) mantuvieron módulos de atención directa.",
        actionText: "Ver Comisarías"
      }
    ],
    chartData: {
      labels: ['Centro Histórico', 'Caucel', 'Komchén', 'Dzityá', 'Chablekal', 'Los Héroes', 'Chuburná'],
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
    insight: "💡 <strong>Descubrimiento Clave:</strong> La activación de macro-sedes periféricas redujo en un 42% la congestión vial hacia el centro hospitalario de la ciudad."
  },
  5: {
    number: 5,
    arc: "Fase 2: Escala Urbana & Operativa",
    arcIcon: "fa-city",
    tag: "CAPÍTULO 5 • LOGÍSTICA HOSPITALARIA",
    tabName: "Transparencia PNT",
    primarySource: "Plataforma Nacional de Transparencia (PNT / Solicitudes SSY)",
    secondarySources: ["Datos.gob.mx", "DENUE"],
    vizTitle: "Raincloud & Matriz de Abastecimiento de Insumos Hospitalarios",
    vizType: "line",
    storyTitle: "Héroes de Blanco y Logística de Vida",
    storyLead: "¿Cómo se aseguró el suministro continuo de equipo de protección y oxígeno?",
    storyDesc: "A través de solicitudes de información pública en la PNT, reconstruimos la respuesta en la cadena de suministro médico en los nosocomios ancla de Mérida: Hospital O'Horán, UMAE T1 IMSS, Hospital Regional ISSSTE y HRAEPY.",
    storyBeats: [
      {
        id: "beat5_1",
        title: "1. Respuesta en Insumos Críticos",
        desc: "El abastecimiento de Equipo de Protección Personal (EPP) escaló de 82% a 99% en menos de 8 semanas.",
        actionText: "Ver Curva EPP"
      },
      {
        id: "beat5_2",
        title: "2. Suministro de Oxígeno",
        desc: "Las rutas dedicadas garantizaron disponibilidad ininterrumpida las 24 horas del día.",
        actionText: "Rutas Logísticas"
      },
      {
        id: "beat5_3",
        title: "3. Eficiencia en Tiempo de Entrega",
        desc: "El tiempo medio de respuesta para reposición de stock se redujo a 18.5 horas.",
        actionText: "Ver Indicadores"
      }
    ],
    chartData: {
      labels: ['Semana 1', 'Semana 4', 'Semana 8', 'Semana 12', 'Semana 16', 'Semana 20'],
      datasets: [
        { label: 'Hospital Agustín O’Horán (EPP %)', data: [88, 92, 95, 98, 99, 100], borderColor: '#00f2fe', tension: 0.3, borderWidth: 3 },
        { label: 'UMAE T1 IMSS Mérida (EPP %)', data: [85, 89, 94, 97, 99, 99], borderColor: '#ff7e5f', tension: 0.3, borderWidth: 3 },
        { label: 'Hospital Regional ISSSTE (EPP %)', data: [82, 87, 91, 96, 98, 99], borderColor: '#a855f7', tension: 0.3, borderWidth: 3 }
      ]
    },
    kpis: [
      { icon: "fa-box-open", label: "Abastecimiento de EPP", value: "98.2%", delta: "Garantía de protección", color: "var(--accent-green)" },
      { icon: "fa-truck-fast", label: "Tiempo de Respuesta", value: "18.5 hrs", delta: "-50% tiempo logístico", color: "var(--accent-cyan)" },
      { icon: "fa-hospital-user", label: "Nosocomios Ancla", value: "4", delta: "Red de alta especialidad", color: "var(--accent-blue)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> A partir del segundo mes de contingencia, ningún hospital ancla en Mérida reportó desabasto crítico de EPP o consumibles médicos."
  },
  6: {
    number: 6,
    arc: "Fase 2: Escala Urbana & Operativa",
    arcIcon: "fa-city",
    tag: "CAPÍTULO 6 • VOZ PÚBLICA & SENTIMIENTO",
    tabName: "Web Scraping",
    primarySource: "Web Scraping de Prensa Local (Diario de Yucatán, Por Esto!, Gacetas)",
    secondarySources: ["Datos.gob.mx"],
    vizTitle: "Red Semántica de Co-ocurrencia (D3 Force) & Sentimiento Colectivo",
    vizType: "custom_force",
    storyTitle: "La Prensa que Informó y Unió",
    storyLead: "¿Qué palabras y sentimientos marcaron la narrativa colectiva de los yucatecos?",
    storyDesc: "El procesamiento de lenguaje natural (PLN) aplicado a más de 1,420 artículos de la prensa regional revela una clara transición emocional: de la alarma inicial al optimismo y la fiesta cívica durante las jornadas de vacunación.",
    storyBeats: [
      {
        id: "beat6_1",
        title: "1. Nodos de Mayor Co-ocurrencia",
        desc: "'Vacunación Masiva' y 'Solidaridad' fueron los términos con mayor centralidad en la red semántica.",
        actionText: "Ver Núcleo Semántico"
      },
      {
        id: "beat6_2",
        title: "2. Sentimiento Proactivo (+76.4%)",
        desc: "Las notas informativas destacaron la participación comunitaria, la ciencia y la gratitud hacia el personal de salud.",
        actionText: "Ver Sentimiento"
      },
      {
        id: "beat6_3",
        title: "3. La Voz de la Comunidad",
        desc: "Las crónicas periodísticas retrataron la esperanza ciudadana y el ambiente de fiesta en las macro-sedes.",
        actionText: "Ver Tópicos"
      }
    ],
    chartData: {
      labels: ['Vacunación Masiva', 'Solidaridad / Apoyo', 'Reapertura Segura', 'Estudiantes UPY', 'Ciencia & Salud', 'Espacios Públicos'],
      datasets: [
        { label: 'Menciones Positivas en Prensa', data: [840, 620, 510, 430, 390, 310], backgroundColor: 'rgba(0, 242, 254, 0.75)' },
        { label: 'Menciones Neutras / Informativas', data: [310, 180, 220, 150, 120, 90], backgroundColor: 'rgba(148, 163, 184, 0.4)' }
      ]
    },
    kpis: [
      { icon: "fa-newspaper", label: "Notas Periodísticas Minadas", value: "1,420", delta: "Corpus regional analizado", color: "var(--accent-cyan)" },
      { icon: "fa-face-smile", label: "Sentimiento Positivo", value: "+76.4%", delta: "Tono optimista y cívico", color: "var(--accent-green)" },
      { icon: "fa-comments", label: "Tópicos de Cohesión", value: "18", delta: "Clusters temáticos", color: "var(--accent-coral)" }
    ],
    insight: "💡 <strong>Descubrimiento Clave:</strong> El término 'Solidaridad' estuvo fuertemente correlacionado en las noticias con jóvenes universitarios y voluntariado en centros de vacunación."
  },
  7: {
    number: 7,
    arc: "Fase 3: Comunidad Universitaria",
    arcIcon: "fa-graduation-cap",
    tag: "CAPÍTULO 7 • COMUNIDAD UNIVERSITARIA",
    tabName: "Self-Produced UPY",
    primarySource: "Encuesta Comunitaria y Estudiantil UPY (Levantamiento Propio n=480)",
    secondarySources: ["GeoPortal Mérida", "Datos.gob.mx"],
    vizTitle: "Dashboard Demoscópico: Escalas Likert de Adaptación Estudiantil",
    vizType: "bar",
    storyTitle: "Voces Universitarias: Nuestra UPY",
    storyLead: "¿Cómo vivió, se adaptó y floreció la comunidad estudiantil de la UPY?",
    storyDesc: "El levantamiento propio entre los estudiantes de la Universidad Politécnica de Yucatán (UPY) demuestra su notable resiliencia: no solo adoptaron herramientas digitales avanzadas, sino que forjaron una sólida cultura de colaboración y entusiasmo por el regreso a las aulas.",
    storyBeats: [
      {
        id: "beat7_1",
        title: "1. Adaptación Tecnológica",
        desc: "El 92% de los alumnos integró herramientas de programación colaborativa y plataformas remotas con alta satisfacción.",
        actionText: "Ver Adopción Tech"
      },
      {
        id: "beat7_2",
        title: "2. Hábitos y Bienestar",
        desc: "El 82% desarrolló rutinas de estudio enfocadas en balance de salud física y mental.",
        actionText: "Ver Bienestar"
      },
      {
        id: "beat7_3",
        title: "3. Retorno Triunfal al Campus",
        desc: "El 95% expresó gran entusiasmo por el retorno a laboratorios y proyectos interdisciplinarios presenciales.",
        actionText: "Ver Retorno Campus"
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
    insight: "💡 <strong>Descubrimiento Clave:</strong> El 95% de los alumnos reportó que el trabajo en equipo y los proyectos aplicados fueron determinantes para mantener la motivación y culminar sus materias con éxito."
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
    storyDesc: "Integramos modelos digitales de elevación (DEM) con densidades volumétricas de puntos LiDAR. Esta experiencia 3D interactiva permite volar, rotar y explorar la altimetría de la ciudad, correlacionando la masa edificada con los corredores de acceso médico.",
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
    insight: "💡 <strong>Innovación Tecnológica:</strong> Renderizado 3D acelerado por GPU con control orbital interactivo para inspeccionar la morfología y densidad arquitectónica."
  },
  9: {
    number: 9,
    arc: "Fase 4: Inmersión Tecnológica",
    arcIcon: "fa-cube",
    tag: "CAPÍTULO 9 • REALIDAD AUMENTADA & BIOMOLÉCULAS",
    tabName: "Realidad Aumentada (AR)",
    primarySource: "Apartado Dedicado: Protein Data Bank (6VXX) + Geometrías WebXR",
    secondarySources: ["WebXR Device API", "AR.js"],
    vizTitle: "Visor Holográfico en Realidad Aumentada (Espícula Viral & Maqueta)",
    vizType: "ar",
    storyTitle: "La Ciencia en tus Manos",
    storyLead: "¿Cómo es a escala atómica la proteína Spike y cómo podemos proyectarla en nuestro propio espacio?",
    storyDesc: "El clímax inmersivo del storytelling: proyecta en tu propio escritorio la estructura tridimensional de la glicoproteína Spike (PDB ID: 6VXX), base del diseño de las vacunas de ARN mensajero, mediante Realidad Aumentada web nativa.",
    storyBeats: [
      {
        id: "beat9_1",
        title: "1. Dominio de Unión al Receptor (RBD)",
        desc: "Los nodos de color coral representan el dominio clave donde los anticuerpos neutralizan al virus.",
        actionText: "Ver Dominio RBD"
      },
      {
        id: "beat9_2",
        title: "2. Vista Detonada Estructural",
        desc: "Presiona 'Explosión Estructural' para observar la conformación interna y los monómeros de la espícula.",
        actionText: "Explosión Molecular"
      },
      {
        id: "beat9_3",
        title: "3. Proyección en Realidad Aumentada",
        desc: "Haz clic en 'Abrir en Móvil AR' para proyectar el holograma interactivo flotando sobre tu mesa.",
        actionText: "Proyectar AR"
      }
    ],
    kpis: [
      { icon: "fa-dna", label: "PDB Model ID", value: "6VXX", delta: "Estructura atómica cryo-EM", color: "var(--accent-purple)" },
      { icon: "fa-mobile-screen-button", label: "WebXR Native", value: "100% Web", delta: "Sin instalar apps", color: "var(--accent-cyan)" },
      { icon: "fa-arrows-spin", label: "Interactividad Espacial", value: "360° AR", delta: "Rotación e inspección libre", color: "var(--accent-coral)" }
    ],
    insight: "💡 <strong>Innovación Tecnológica:</strong> Compatible con smartphones mediante WebXR y QuickLook de Apple sin necesidad de instalar aplicaciones externas."
  }
};
