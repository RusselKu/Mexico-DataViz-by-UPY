# 🗺️ Visualización 03: SIEGY Yucatán — Cohesión Territorial de los 106 Municipios

- **Integrante Responsable:** 👤 **Ale**
- **Vista en la Plataforma:** `Vista 3 - Módulo SIEGY Yucatán`
- **Tipo de Visualización:** Radar Multidimensional (Spider Chart Interactivo) por Jurisdicciones Sanitarias (Mérida, Valladolid, Ticul) + Mapa Coroplético de Cohesión y Resiliencia Social.

---

## 📂 Fuentes de Datos Incluidas

### 1. Fuente Origen (Principal): `01_fuente_origen_siegy/`
- **Nombre de la Fuente:** SIEGY (Sistema de Información Estadística y Geográfica de Yucatán / CEIEG - Gobierno del Estado de Yucatán).
- **Tipo de Dato:** Archivo Tabular / Vectorial Geoespacial (`CSV`, `GeoJSON` o `Shapefile .shp`).
- **Enlace de Origen:** [Portal SIEGY Yucatán](https://siegy.yucatan.gob.mx/)
- **Filtro Aplicado:** Indicadores de desarrollo municipal, cohesión comunitaria, accesibilidad a servicios básicos y división por 3 Jurisdicciones Sanitarias del Estado de Yucatán.
- **Campos Clave / Esquema:**
  - `cve_mun`: Clave municipal INEGI (3 dígitos).
  - `nom_mun`: Nombre del municipio (e.g. Mérida, Valladolid, Ticul, Motul, Izamal, Tizimín).
  - `jurisdiccion_sanitaria`: Jurisdicción 1 (Mérida), Jurisdicción 2 (Valladolid), Jurisdicción 3 (Ticul).
  - `indice_cohesion_social`: Puntuación normalizada (0 - 100).
  - `acceso_salud_pct`: Porcentaje de población con cobertura médica.
  - `conectividad_digital_pct`: Porcentaje de hogares con acceso a internet.
  - `equipamiento_comunitario`: Puntuación de infraestructura de apoyo vecinal.

### 2. Fuente Extra 1 (Apoyo): `02_fuente_extra_datos_gob/`
- **Nombre de la Fuente:** Datos.gob.mx / DGE Secretaría de Salud (Incidencia Epidemiológica y Tasas de Recuperación Estatal).
- **Tipo de Dato:** Archivo Tabular (`CSV`).
- **Justificación del Cruce:** Correlacionar la cohesión municipal con la velocidad de recuperación de pacientes en el interior del estado frente a la capital.
- **Campos Clave:** `cve_mun`, `casos_totales`, `casos_recuperados`, `tasa_recuperacion_pct`.

### 3. Fuente Extra 2 (Apoyo): `03_fuente_extra_denue/`
- **Nombre de la Fuente:** INEGI - DENUE Sector 62 (Centros de Salud y Dispensarios Rurales).
- **Tipo de Dato:** Archivo Tabular / Geoespacial (`CSV` o `GeoJSON`).
- **Justificación del Cruce:** Mapear la presencia de dispensarios comunitarios y casas de salud en las cabeceras y comisarías de los 106 municipios.
- **Campos Clave:** `cve_mun`, `tipo_unidad_medica`, `conteo_unidades`, `medicos_disponibles`.
