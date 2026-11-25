# Reporte Automatizado de Calidad de Datos — Equipo 3 (Mexico-DataViz-by-UPY)

**Ejecución ETL:** `2026-11-25T17:55:21Z`  
**Cobertura:** 9/9 módulos temáticos con datos reales verificables (0 archivos `sample_*` en capas Silver/Gold).

## Conciliación y Validación Bronze → Silver → Gold

| Tabla | Capa | Reg. Entrada | Reg. Salida | Nulos (%) | Duplicados | Geometrías | CRS | Estado |
| :--- | :---: | ---: | ---: | ---: | ---: | :--- | :--- | :---: |
| `dim_municipios_yucatan` | `silver` | 106 | 106 | 0.0% | 0 | 100% válidas (106/106) | `EPSG:4326` | **APROBADO** |
| `unidades_medicas_yucatan` | `silver` | 577 | 504 | 0.0% | 0 | 100% válidas (504/504) | `EPSG:4326` | **APROBADO** |
| `mart_cobertura_salud_municipal` | `gold` | 504 | 106 | 0.0% | 0 | N/A | `N/A` | **APROBADO** |
| `mart_cohesion_jurisdicciones_yucatan` | `gold` | 106 | 3 | 0.0% | 0 | N/A | `N/A` | **APROBADO** |
| `serie_epidemiologica_yucatan` | `silver` | 500 | 500 | 0.0% | 0 | N/A | `N/A` | **APROBADO** |
| `mart_evolucion_epidemiologica_mensual` | `gold` | 500 | 18 | 0.0% | 0 | N/A | `N/A` | **APROBADO** |
| `parques_accesibilidad_merida` | `silver` | 884 | 884 | 0.0% | 0 | 100% válidas (884/884) | `EPSG:4326` | **APROBADO** |
| `comisarias_isocronas_merida` | `silver` | 243 | 243 | 0.0% | 0 | 100% válidas (243/243) | `EPSG:4326` | **APROBADO** |
| `mart_accesibilidad_15min_merida` | `gold` | 243 | 5 | 0.0% | 0 | N/A | `N/A` | **APROBADO** |
| `infraestructura_hospitalaria_yucatan` | `silver` | 504 | 190 | 0.0% | 0 | N/A | `N/A` | **APROBADO** |
| `mart_logistica_hospitales_ancla` | `gold` | 190 | 57 | 0.0% | 0 | N/A | `N/A` | **APROBADO** |
| `corpus_prensa_yucatan` | `silver` | 235 | 235 | 0.0% | 0 | N/A | `N/A` | **APROBADO** |
| `mart_sentimiento_prensa_yucatan` | `gold` | 235 | 14 | 0.0% | 0 | N/A | `N/A` | **APROBADO** |
| `encuesta_upy_estudiantil` | `silver` | 166 | 166 | 0.0% | 0 | N/A | `N/A` | **APROBADO** |
| `mart_resiliencia_estudiantil_upy` | `gold` | 166 | 4 | 0.0% | 0 | N/A | `N/A` | **APROBADO** |
| `dem_altimetria_merida` | `silver` | 400 | 400 | 0.0% | 0 | 100% válidas (400/400) | `EPSG:4326` | **APROBADO** |
| `mart_altimetria_urbana_merida` | `gold` | 400 | 3 | 0.0% | 0 | N/A | `N/A` | **APROBADO** |
| `pdb_6vxx_estructura_molecular` | `silver` | 3163 | 1 | 0.0% | 0 | N/A | `N/A` | **APROBADO** |

## Reglas de Validación Aplicadas
- Codificación `UTF-8` sin BOM en todos los archivos CSV y JSON.
- Fechas normalizadas a estándar `ISO-8601` (`YYYY-MM-DD` / `YYYY-MM-DDTHH:MM:SS`).
- Claves territoriales INEGI homologadas (`cve_ent`, `cve_mun`, `cvegeo`) verificadas mediante *spatial join* contra los 106 polígonos oficiales de Yucatán.
- Geometrías vectoriales validadas con `shapely.is_valid` en proyección `EPSG:4326` (WGS84) y exportadas en `GeoJSON` + `GeoParquet`.
- Tablas analíticas exportadas en `CSV` + `Parquet` listas para ingesta directa al Data Warehouse, Looker Studio o Power BI.