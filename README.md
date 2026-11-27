# El Viaje de la Resiliencia: Acceso a la Salud en Mérida y Yucatán
### *Equipo 3 · Universidad Politécnica de Yucatán (UPY) · Acto 5: Cuidarnos*

---

## 📖 Entrega Oficial del Booklet (`booklet/`)

El capítulo asignado al Equipo 3 (**Acto 5 · Cuidarnos: «¿Qué tan lejos queda el médico?»**) se encuentra completo y listo para integración en la carpeta [`booklet/`](./booklet/):

- **Vista previa integrada (pantalla e impresión):** [`booklet/index.html`](./booklet/index.html)
- **Ficha editorial del capítulo:** [`booklet/ficha.md`](./booklet/ficha.md)
- **Datos finales en CSV (1 archivo por escena):** [`booklet/datos/`](./booklet/datos/) (`escena-1.csv`, `escena-2.csv`, `escena-3.csv`, `escena-4.csv`, `yucatan_municipios.geojson`)
- **Trazabilidad de fuentes primarias y espejos:** [`booklet/datos/FUENTES.md`](./booklet/datos/FUENTES.md)
- **Gráficas en D3 v7.9.0 (paleta oficial morado `#600d8b` y oro `#ed9f22`, tipografía Outfit):** [`booklet/graficas/`](./booklet/graficas/)

---

## 📊 Hallazgos Principales Verificados (Acto 5 · Cuidarnos)

| Escena | Archivo CSV | Hallazgo Verificado | Fuente y Corte |
| :---: | :--- | :--- | :--- |
| **1** | [`booklet/datos/escena-1.csv`](./booklet/datos/escena-1.csv) | Mérida concentra **49.6 %** de las unidades de salud mapeadas en Yucatán (**239 de 482**); **56 de 106 municipios** tienen 0 registros en la cartografía abierta. | OpenStreetMap (Overpass) + INEGI Censo 2020 (ITER) · Corte: nov 2026 |
| **2** | [`booklet/datos/escena-2.csv`](./booklet/datos/escena-2.csv) | **211,556 habitantes** en las 515 AGEB urbanas de Mérida (**22.1 %**) carecen de afiliación a servicios de salud; **61 AGEB** superan el 30 %. | INEGI Censo de Población y Vivienda 2020 (AGEB urbanas) · Corte: 2020 |
| **3** | [`booklet/datos/escena-3.csv`](./booklet/datos/escena-3.csv) | **54.6 %** de las 185 localidades dentro de Mérida (`CVEGEO 31050`) queda a más de 15 minutos a pie al médico: mediana de **56.6 min** en 44 comisarías contra **11.0 min** en 136 colonias y barrios. | OpenStreetMap + Límite municipal INEGI `31050` (UTM 16N) · Corte: nov 2026 |
| **4** | [`booklet/datos/escena-4.csv`](./booklet/datos/escena-4.csv) | Yucatán acumuló **41,179 casos confirmados** y **4,078 defunciones** entre enero de 2020 y junio de 2021 (pico mensual: julio 2020 con 5,280 casos). | DGE Secretaría de Salud (vía espejo `mariorz/covid19-mx-time-series`) · Corte: jun 2021 |

---

## 🏗️ Arquitectura del Repositorio

```text
Mexico-DataViz-by-UPY/
├── booklet/                         # Entrega oficial del capítulo (Acto 5 · Cuidarnos)
│   ├── index.html                   # Vista previa integrada del capítulo
│   ├── ficha.md                     # Ficha editorial completa y corrección de fallas
│   ├── datos/                       # CSV finales por escena + GeoJSON + FUENTES.md
│   └── graficas/                    # 4 escenas en D3 v7.9.0 con paleta morado/oro
├── data/                            # Repositorio estructurado Medallion (Bronze → Silver → Gold)
│   ├── bronze/                      # Datos crudos reales con extraction_manifest.json
│   ├── silver/                      # Tablas y capas espaciales limpias (CSV/Parquet/GeoJSON/GeoParquet)
│   ├── gold/                        # Data Marts listos para Data Warehouse y BI
│   ├── CATALOGO_DATOS.csv           # Catálogo oficial de activos
│   ├── DICCIONARIO_DATOS.md         # Diccionario de variables, tipos y unidades
│   ├── REPORTE_CALIDAD.md           # Conciliación y validación automatizada
│   └── README.md                    # Documentación de capas y reproducibilidad
├── scripts/
│   ├── etl/                         # Pipeline reproducible (01_extract_bronze, 02_transform_silver_gold, 03_build_booklet_data)
│   └── scraper/                     # Extractor RSS de prensa regional de Yucatán
├── index.html                       # Sitio web interactivo conectado a data/gold/ y data/silver/
├── css/                             # Hojas de estilo modulares
└── js/                              # Módulos JS (lectura dinámica de Gold/Silver, sin Math.random)
```

---

## 👥 Integrantes del Equipo 3

- **Russel** — Datos geoespaciales, accesibilidad Mérida, prensa regional e integración D3/booklet.
- **Alejandra** — Red de salud, datos abiertos epidemiológicos y Censo 2020 / municipios de Yucatán.
- **Daniel** — Infraestructura hospitalaria, altimetría DEM 3D y modelo estructural PDB `6VXX`.

---

## ⚙️ Reproducibilidad del Pipeline ETL

```bash
# 1. Extraer datos crudos reales (Capa Bronze)
python scripts/etl/01_extract_bronze.py

# 2. Limpiar, validar geometrías y generar capas Silver/Gold y gobernanza
python scripts/etl/02_transform_silver_gold.py

# 3. Integrar Censo 2020 oficial (AGEB/municipios) y generar CSV finales del booklet
python scripts/etl/03_build_booklet_data.py
```
