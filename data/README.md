# 📁 Repositorio Central de Datos: Data Storytelling México -> Yucatán -> UPY

Este directorio alberga la estructura unificada de datos para las **9 Vistas / Módulos de Visualización** de la plataforma. Cada carpeta corresponde a una visualización específica y contiene la **Fuente Principal (Origen)** y al menos **Dos Fuentes Secundarias de Apoyo (Cruce de Datos)**, asignadas a los integrantes del equipo: **Ale**, **Russel (Russelsin)** y **Daniel**.

---

## 👥 Matriz de Asignaciones y Responsabilidades del Equipo

| No. | Módulo / Visualización | Carpeta del Repositorio | Integrante Responsable | Fuente Origen (Principal) | Fuente Extra 1 | Fuente Extra 2 |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- |
| **01** | **INEGI DENUE** | [`01_inegi_denue/`](file:///c:/Users/russe/Documents/github_repo/Mexico-DataViz-by-UPY/data/01_inegi_denue) | **Ale** | INEGI DENUE Sector 62 (`CSV` / `API` / `GeoJSON`) | Base Abierta DGE Salud (`CSV` / `API`) | Índices Marginación SIEGY (`CSV` / `XLSX`) |
| **02** | **Datos.gob.mx** | [`02_datos_gob/`](file:///c:/Users/russe/Documents/github_repo/Mexico-DataViz-by-UPY/data/02_datos_gob) | **Ale** | DGE Salud Epidemiológica (`CSV` / `API`) | Censo 2020 INEGI Demografía (`CSV`) | Capacidad Hospitalaria PNT (`CSV` / `XLSX`) |
| **03** | **SIEGY Yucatán** | [`03_siegy_yucatan/`](file:///c:/Users/russe/Documents/github_repo/Mexico-DataViz-by-UPY/data/03_siegy_yucatan) | **Ale** | SIEGY CEIEG 106 Municipios (`CSV` / `SHP` / `GeoJSON`) | Incidencia Estatal Salud (`CSV`) | Red Médica Municipal DENUE (`CSV` / `GeoJSON`) |
| **04** | **GeoPortal Mérida** | [`04_geoportal_merida/`](file:///c:/Users/russe/Documents/github_repo/Mexico-DataViz-by-UPY/data/04_geoportal_merida) | **Russel** | GeoPortal Mérida SIG / Comisarías (`GeoJSON` / `SHP` / `WFS`) | Puntos de Vacunación / DENUE (`CSV` / `GeoJSON`) | Movilidad y Rutas Vecinales UPY (`CSV` / `GeoJSON`) |
| **05** | **PNT / Transparencia** | [`05_transparencia_pnt/`](file:///c:/Users/russe/Documents/github_repo/Mexico-DataViz-by-UPY/data/05_transparencia_pnt) | **Daniel** | PNT / Infomex Insumos Hospitalarios (`CSV` / `XLSX`) | Ocupación UCI IRAG Datos.gob (`CSV` / `API`) | Coordenadas Hospitales O'Horán/T1 (`CSV` / `GeoJSON`) |
| **06** | **Web Scraping Prensa** | [`06_web_scraping/`](file:///c:/Users/russe/Documents/github_repo/Mexico-DataViz-by-UPY/data/06_web_scraping) | **Russel** | Minería de Prensa Diario/Por Esto! (`JSON` / `CSV` Text Corpus) | Cronología Vacunación Datos.gob (`CSV`) | Boletines y Gacetas Oficiales (`JSON` / `CSV`) |
| **07** | **Self-Produced UPY** | [`07_self_produced_upy/`](file:///c:/Users/russe/Documents/github_repo/Mexico-DataViz-by-UPY/data/07_self_produced_upy) | **Russel** | Encuesta Estudiantil UPY (`CSV` / `JSON`) | Polígonos de Rutas Campus GeoPortal (`GeoJSON`) | Benchmark Bienestar ENSANUT (`CSV`) |
| **08** | **LiDAR 3D** | [`08_lidar_3d/`](file:///c:/Users/russe/Documents/github_repo/Mexico-DataViz-by-UPY/data/08_lidar_3d) | **Daniel** | Continuo Elevación CEM / LiDAR (`GeoTIFF` / `DEM` / `LAS` / `JSON Matrix`) | Traza Urbana 3D GeoPortal (`GeoJSON` / `OBJ`) | Cotas de Altura DENUE (`CSV` / `GeoJSON`) |
| **09** | **Realidad Aumentada (AR)** | [`09_realidad_aumentada_ar/`](file:///c:/Users/russe/Documents/github_repo/Mexico-DataViz-by-UPY/data/09_realidad_aumentada_ar) | **Daniel** | Protein Data Bank Spike PDB 6VXX (`PDB` / `GLTF` / `GLB` / `USDZ`) | Malla Espacial Mérida / Campus UPY (`GLTF` / `OBJ`) | Marcadores WebXR y Anchors (`PNG` / `JSON`) |

---

## 📋 Reglas de Subida y Estandarización de Archivos para GitHub

1. **Formato preferido:**
   - **Datos tabulares:** Archivos delimitados por comas (`.csv`) en codificación `UTF-8`.
   - **Datos geoespaciales:** GeoJSON (`.geojson`) con proyección WGS84 (`EPSG:4326`).
   - **Datos no estructurados/textuales:** JSON estructurado (`.json`).
   - **Modelos 3D y AR:** Formato GLTF/GLB binario optimizado (`.glb` / `.gltf`) y archivos de marcadores (`.png` / `.patt`).
2. **Límite de tamaño en GitHub:**
   - No subir archivos individuales mayores a **50 MB** directamente. Si el archivo crudo es muy pesado (e.g. nubes de puntos `.las` completas de varios GB o CSVs masivos de millones de filas), aplicar un script de preprocesamiento/filtrado para extraer la muestra relevante (e.g. Yucatán / Mérida) y subir la versión optimizada o comprimida.
3. **Documentación requerida en cada carpeta:**
   - Cada carpeta contiene su propio `README.md` donde se debe documentar el tipo de dato, origen, método de obtención (descarga directa, scraper o API), fecha de consulta y diccionario de variables.
