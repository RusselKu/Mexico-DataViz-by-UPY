# 📁 Repositorio Central de Datos — Data Warehouse Ready (Equipo 3: Mexico-DataViz-by-UPY)

Este directorio contiene los **datos reales, verificables y homologados** del **Equipo 3 (`RusselKu/Mexico-DataViz-by-UPY`)**, preparados para inserción directa en el **Data Warehouse / Data Marts** conforme a los estándares del **Structured Data Team** y el **Spatial Data Team**.

> **Estado de auditoría:** ✅ **0 archivos `sample_*`** · **9/9 módulos con datos reales** · **100% geometrías válidas (`EPSG:4326`)** · **Claves territoriales INEGI (`cve_ent=31`, `cve_mun`, `cvegeo`) homologadas**.

---

## 🏗️ Arquitectura Medallion (Bronze → Silver → Gold)

| Capa | Ruta | Propósito | Formatos |
| :--- | :--- | :--- | :--- |
| **Bronze** | [`data/bronze/`](file:///c:/Users/russe/Documents/github_repo/Mexico-DataViz-by-UPY/data/bronze) | 13 activos crudos recién extraídos de fuentes públicas con trazabilidad (`extraction_manifest.json`). | `JSON`, `CSV`, `GeoJSON`, `PDB` |
| **Silver** | [`data/silver/`](file:///c:/Users/russe/Documents/github_repo/Mexico-DataViz-by-UPY/data/silver) | Tablas y capas espaciales limpias, UTF-8, fechas `ISO-8601`, `cvegeo` y `EPSG:4326` validado. | `CSV`, `Parquet`, `GeoJSON`, `GeoParquet`, `JSON` |
| **Gold** | [`data/gold/`](file:///c:/Users/russe/Documents/github_repo/Mexico-DataViz-by-UPY/data/gold) | 9 Data Marts analíticos listos para consumo directo en Data Warehouse, Looker Studio o Power BI. | `CSV`, `Parquet` |

### 📄 Documentación de Gobernanza para Ingesta al DW
- **Catálogo oficial de activos:** [`data/CATALOGO_DATOS.csv`](file:///c:/Users/russe/Documents/github_repo/Mexico-DataViz-by-UPY/data/CATALOGO_DATOS.csv) y [`data/CATALOGO_DATOS.json`](file:///c:/Users/russe/Documents/github_repo/Mexico-DataViz-by-UPY/data/CATALOGO_DATOS.json)
- **Diccionario de columnas, tipos y unidades:** [`data/DICCIONARIO_DATOS.md`](file:///c:/Users/russe/Documents/github_repo/Mexico-DataViz-by-UPY/data/DICCIONARIO_DATOS.md)
- **Reporte automatizado de calidad y conciliación:** [`data/REPORTE_CALIDAD.md`](file:///c:/Users/russe/Documents/github_repo/Mexico-DataViz-by-UPY/data/REPORTE_CALIDAD.md)

---

## ⚙️ Reproducibilidad (Scripts ETL Versionados)

```bash
# 1. Extracción de datos crudos reales (Capa Bronze)
python scripts/etl/01_extract_bronze.py

# 2. Limpieza, spatial joins, validación geométrica y generación de Silver, Gold y Gobernanza
python scripts/etl/02_transform_silver_gold.py
```

---

## 📊 Resumen de Activos Reales por Módulo (9 Vistas)

| No. | Módulo / Visualización | Responsable | Tabla Silver Principal | Data Mart Gold | Registros Reales |
| :---: | :--- | :---: | :--- | :--- | ---: |
| **01** | **INEGI / Red de Salud** | Alejandra / Russel | `unidades_medicas_yucatan` | `mart_cobertura_salud_municipal` | 504 unidades (en 106 mun.) |
| **02** | **Datos.gob.mx (DGE)** | Alejandra | `serie_epidemiologica_yucatan` | `mart_evolucion_epidemiologica_mensual` | 500 días (18 meses) |
| **03** | **SIEGY Yucatán (106 Mun.)** | Alejandra / Russel | `dim_municipios_yucatan` | `mart_cohesion_jurisdicciones_yucatan` | 106 polígonos (3 jurisd.) |
| **04** | **GeoPortal Mérida (15 min)** | Russel | `parques_accesibilidad_merida` + `comisarias_isocronas_merida` | `mart_accesibilidad_15min_merida` | 884 parques + 243 localidades |
| **05** | **Transparencia PNT / Hospitales** | Daniel / Alejandra | `infraestructura_hospitalaria_yucatan` | `mart_logistica_hospitales_ancla` | 190 hospitales y clínicas |
| **06** | **Web Scraping Prensa Yucatán** | Russel | `corpus_prensa_yucatan` | `mart_sentimiento_prensa_yucatan` | 235 artículos reales RSS |
| **07** | **Self-Produced Encuesta UPY** | Russel | `encuesta_upy_estudiantil` | `mart_resiliencia_estudiantil_upy` | 166 respuestas reales |
| **08** | **LiDAR / Altimetría DEM 3D** | Daniel / Russel | `dem_altimetria_merida` | `mart_altimetria_urbana_merida` | 400 puntos Copernicus DEM |
| **09** | **Realidad Aumentada (PDB 6VXX)** | Daniel | `pdb_6vxx_estructura_molecular` | `mart_modelo_ar_pdb_6vxx` | Metadatos + Header oficial RCSB |
