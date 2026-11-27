# 📁 Repositorio Central de Datos — Equipo 3 (`Mexico-DataViz-by-UPY`)

Este directorio almacena los **datos reales, verificables y homologados** del **Equipo 3**, organizados en arquitectura **Medallion (Bronze → Silver → Gold)** para inserción en el Data Warehouse y consumo directo por el capítulo del booklet en [`../booklet/`](../booklet/).

> **Estado de calidad:** **0 archivos `sample_*`** · **100 % geometrías válidas (`EPSG:4326`)** · **Claves territoriales INEGI (`cve_ent = 31`, `cve_mun`, `cvegeo`) homologadas** · **Encuesta UPY excluida del booklet por transparencia metodológica**.

---

## 🏗️ Capas de Datos

| Capa | Ruta | Propósito | Formatos |
| :--- | :--- | :--- | :--- |
| **Bronze** | [`./bronze/`](./bronze/) | Activos crudos reales descargados de fuentes públicas con trazabilidad (`extraction_manifest.json`), incluyendo Censo 2020 oficial de INEGI (ITER y AGEB urbanas de Mérida). | `JSON`, `CSV`, `GeoJSON`, `PDB` |
| **Silver** | [`./silver/`](./silver/) | Tablas y capas espaciales limpias en `UTF-8`, fechas `ISO-8601`, `cvegeo` y `EPSG:4326` validado. | `CSV`, `Parquet`, `GeoJSON`, `GeoParquet`, `JSON` |
| **Gold** | [`./gold/`](./gold/) | Tablas analíticas (Data Marts) consumidas por el sitio web y por `booklet/datos/`. | `CSV`, `Parquet` |

### 📄 Documentación de Gobernanza
- **Catálogo de activos:** [`./CATALOGO_DATOS.csv`](./CATALOGO_DATOS.csv) y [`./CATALOGO_DATOS.json`](./CATALOGO_DATOS.json)
- **Diccionario de variables:** [`./DICCIONARIO_DATOS.md`](./DICCIONARIO_DATOS.md)
- **Reporte de calidad:** [`./REPORTE_CALIDAD.md`](./REPORTE_CALIDAD.md)
- **Fuentes detalladas del booklet (incluyendo cita explícita de espejos de terceros):** [`../booklet/datos/FUENTES.md`](../booklet/datos/FUENTES.md)

---

## ⚙️ Reproducibilidad (Scripts ETL)

```bash
python scripts/etl/01_extract_bronze.py
python scripts/etl/02_transform_silver_gold.py
python scripts/etl/03_build_booklet_data.py
```

---

## 📊 Activos Reales Principales

| No. | Módulo | Tabla Silver Principal | Tabla Gold / Booklet | Registros Reales |
| :---: | :--- | :--- | :--- | ---: |
| **01** | **Red de Salud Yucatán** | `unidades_medicas_yucatan` | `mart_cobertura_salud_municipal` / `escena-1.csv` | 482 unidades en 106 municipios |
| **02** | **Epidemiología DGE** | `serie_epidemiologica_yucatan` | `mart_evolucion_epidemiologica_mensual` / `escena-4.csv` | 500 días / 18 meses (ene 2020–jun 2021) |
| **03** | **Municipios y Censo 2020** | `dim_municipios_yucatan` + `censo2020_afiliacion_ageb_merida` | `mart_sin_afiliacion_ageb_merida` / `escena-2.csv` | 106 municipios + 515 AGEB urbanas de Mérida |
| **04** | **Accesibilidad 15 min Mérida** | `comisarias_isocronas_merida` + `parques_accesibilidad_merida` | `mart_accesibilidad_15min_merida` / `escena-3.csv` | 185 localidades en Mérida (`31050`) + 884 parques |
| **05** | **Infraestructura Hospitalaria** | `infraestructura_hospitalaria_yucatan` | `mart_logistica_hospitales_ancla` | 190 hospitales y clínicas |
| **06** | **Prensa Regional Yucatán** | `corpus_prensa_yucatan` | `mart_sentimiento_prensa_yucatan` | 235 artículos reales RSS |
| **07** | **Altimetría DEM 3D Mérida** | `dem_altimetria_merida` | `mart_altimetria_urbana_merida` | 400 puntos Copernicus DEM GLO-90 |
| **08** | **Modelo Molecular AR (`6VXX`)** | `pdb_6vxx_estructura_molecular` | `mart_modelo_ar_pdb_6vxx` | Metadatos y cabecera oficial RCSB PDB |
