# 📰 Visualización 06: Web Scraping — Minería Semántica y la Voz de la Prensa

- **Integrante Responsable:** 👤 **Russel (Russelsin)**
- **Vista en la Plataforma:** `Vista 6 - Módulo Web Scraping`
- **Tipo de Visualización:** Red Interactiva de Co-ocurrencia Semántica (D3 Force-Directed Graph) + Curva de Sentimiento Colectivo (Evolución de polaridad positiva/resiliencia comunitaria).

---

## 📂 Fuentes de Datos Incluidas

### 1. Fuente Origen (Principal): `01_fuente_origen_scraped_press/`
- **Nombre de la Fuente:** Corpus Textual Minado mediante Web Scraping en Medios de Prensa Regional del Sur de México (*Diario de Yucatán*, *Por Esto!*, *La Jornada Maya*, *Prensa Yucatán*).
- **Tipo de Dato:** Archivos de Texto No Estructurado / JSON Semántico (`JSON` o `CSV`).
- **Método de Extracción:** Scripts Python con `BeautifulSoup`, `Playwright` o `Scrapy` recopilando artículos de noticias (2020-2023).
- **Campos Clave / Esquema:**
  - `id_articulo`: Identificador único de la nota de prensa.
  - `medio`: Nombre del periódico o medio de comunicación.
  - `fecha_publicacion`: Fecha de la noticia (formato `YYYY-MM-DD`).
  - `titular`: Encabezado del artículo.
  - `cuerpo_texto`: Texto completo procesado.
  - `keywords_coocurrencia`: Lista de términos clave identificados (`vacunación`, `esperanza`, `Siglo XXI`, `UPY`, `solidaridad`, `juventud`, `apertura`).
  - `score_polaridad`: Puntuación de sentimiento (de -1.0 negativo a +1.0 altamente positivo/esperanzador).

### 2. Fuente Extra 1 (Apoyo): `02_fuente_extra_datos_gob/`
- **Nombre de la Fuente:** Línea de Tiempo Oficial de Fases Sanitarias y Jornadas Masivas de Vacunación (Datos.gob.mx / SSY).
- **Tipo de Dato:** Archivo Tabular (`CSV`).
- **Justificación del Cruce:** Contrastar los picos de noticias y el cambio en el tono de optimismo mediático con las fechas oficiales de arranque de vacunación por grupos etarios.
- **Campos Clave:** `fecha_inicio_fase`, `nombre_fase`, `grupo_etario_objetivo`, `dosis_aplicadas_acumuladas`.

### 3. Fuente Extra 2 (Apoyo): `03_fuente_extra_gacetas/`
- **Nombre de la Fuente:** Boletines de Prensa Oficial del Gobierno del Estado de Yucatán y Diario Oficial.
- **Tipo de Dato:** Corpus Estructurado NLP (`JSON` o `CSV`).
- **Justificación del Cruce:** Comparar el discurso institucional formal contra la cobertura ciudadana y periodística de los medios independientes.
- **Campos Clave:** `folio_boletin`, `dependencia_emisora`, `eje_tematico`, `sentimiento_institucional`.
