# Fuentes y Metodología de Datos — Booklet Equipo 3 (Acto 5 · Cuidarnos)

Cada archivo CSV dentro de `booklet/datos/` corresponde exactamente a una escena del capítulo, está codificado en `UTF-8`, tiene columnas en español (`snake_case`) y se genera de forma reproducible mediante `scripts/etl/01_extract_bronze.py`, `scripts/etl/02_transform_silver_gold.py` y `scripts/etl/03_build_booklet_data.py`.

---

## 1. `escena-1.csv` y `yucatan_municipios.geojson`
- **Contenido:** Unidades de salud mapeadas por municipio, población total, tasa por cada 10,000 habitantes y porcentaje sin afiliación en los 106 municipios de Yucatán (`cvegeo` `31001` a `31106`).
- **Fuente primaria 1 (Unidades de salud):** OpenStreetMap vía Overpass API (`amenity` en `hospital|clinic|doctors|pharmacy|dentist` y etiqueta `healthcare` en el cuadrante de Yucatán).
  - URL de consulta: `https://maps.mail.ru/osm/tools/overpass/api/interpreter`
  - Licencia: ODbL 1.0 · Fecha de corte: `2026-11-25`.
- **Fuente primaria 2 (Población y afiliación municipal):** INEGI, Censo de Población y Vivienda 2020 — Principales resultados por localidad (ITER Yucatán, filtrado a totales municipales `LOC = 0000`).
  - URL oficial directa: `https://www.inegi.org.mx/contenidos/programas/ccpv/2020/datosabiertos/iter/iter_31_cpv2020_csv.zip`
  - Licencia: Libre uso INEGI · Fecha de corte: `2020`.
- **Fuente de polígonos municipales (espejo de terceros):** División política municipal basada en el Marco Geoestadístico del INEGI, obtenida a través del repositorio de terceros `JuveCampos/Shapes_Resiliencia_CDMX_CIDE` (filtrada a `CVE_ENT = 31` y simplificada con tolerancia `0.004°` preservando topología).
  - URL del espejo: `https://raw.githubusercontent.com/JuveCampos/Shapes_Resiliencia_CDMX_CIDE/master/geojsons/Division%20Politica/mpios2.geojson`
- **Cálculo:** Unión espacial (`geopandas.sjoin`, predicado `within`) de los establecimientos de salud sobre los 106 polígonos de Yucatán; tasa calculada como `(total_unidades_salud / poblacion_total) * 10000`.

---

## 2. `escena-2.csv`
- **Contenido:** Población total (`POBTOT`), población sin afiliación (`PSINDER`), población con afiliación (`PDER_SS`) y porcentaje sin afiliación (`pct_sin_afiliacion`) en las **515 AGEB urbanas con población** del municipio de Mérida (`CVEGEO 31050`).
- **Fuente oficial directa:** INEGI, Censo de Población y Vivienda 2020 — Principales resultados por AGEB y manzana urbana de Yucatán (`RESAGEBURB_31CSV20.csv`).
  - URL oficial directa: `https://www.inegi.org.mx/contenidos/programas/ccpv/2020/datosabiertos/ageb_manzana/ageb_mza_urbana_31_cpv2020_csv.zip`
  - Licencia: Libre uso INEGI · Fecha de corte: `2020`.
- **Cálculo:** Filtrado a `MUN = '050'`, `MZA = '000'`, `AGEB != '0000'` y `POBTOT > 0` (se excluyen 11 AGEB con población confidencial/cero en el tabulado). `pct_sin_afiliacion = round(100 * PSINDER / POBTOT, 2)`.

---

## 3. `escena-3.csv`
- **Contenido:** Distancia en metros y tiempo estimado caminando hacia la unidad de salud más cercana y el parque más cercano para las **185 localidades, colonias, barrios y comisarías ubicadas estrictamente dentro del polígono oficial de Mérida (`CVEGEO 31050`)**.
- **Fuentes:**
  - Localidades, colonias y comisarías (`place` en `suburb|village|hamlet|town|neighbourhood`), parques (`leisure=park`) y unidades de salud de OpenStreetMap (Overpass API).
  - URL: `https://maps.mail.ru/osm/tools/overpass/api/interpreter` · Licencia: ODbL 1.0 · Fecha de corte: `2026-11-25`.
  - Polígono límite municipal `31050` de INEGI (vía espejo `JuveCampos/Shapes_Resiliencia_CDMX_CIDE`).
- **Cálculo:** Reproyección a UTM Zona 16N (`EPSG:32616`), recorte espacial exacto al polígono de Mérida (`within`) y vecino más cercano (`geopandas.sjoin_nearest`). Tiempo estimado a pie: `distancia_salud_m / 80` (velocidad peatonal estándar de 4.8 km/h = 80 m/min). Umbral de ciudad de 15 minutos: `minutos_pie_salud <= 15.0`.

---

## 4. `escena-4.csv`
- **Contenido:** Serie mensual de casos confirmados nuevos, defunciones nuevas, acumulados y tasa de letalidad mensual por COVID-19 en Yucatán (`CVE_ENT = 31`), de enero de 2020 a junio de 2021 (18 meses).
- **Fuente primaria:** Dirección General de Epidemiología (DGE), Secretaría de Salud Federal.
- **Fuente secundaria / repositorio espejo utilizado:** `mariorz/covid19-mx-time-series` (GitHub).
  - URLs:
    - `https://raw.githubusercontent.com/mariorz/covid19-mx-time-series/master/data/covid19_confirmed_mx.csv`
    - `https://raw.githubusercontent.com/mariorz/covid19-mx-time-series/master/data/covid19_deaths_mx.csv`
  - Licencia: Datos Abiertos MX / MIT · Fecha de corte de la serie: `2021-06-12`.
- **Cálculo:** Dado que las columnas diarias del archivo espejo son acumulados estatales, se calculan los incrementos diarios reales mediante diferencia de primer orden (`diff()`, acotada en `>= 0`) y luego se agregan por `anio_mes`.

---

## Datos excluidos intencionalmente del booklet
- **Encuesta estudiantil UPY (`encuesta_upy_respuestas_live.csv`):** Excluida porque existía en el historial del repositorio un script de llenado automático (`scripts/survey_bot/google_forms_filler.py`, ya eliminado) y no es posible demostrar que la totalidad de las respuestas correspondan a personas reales.
