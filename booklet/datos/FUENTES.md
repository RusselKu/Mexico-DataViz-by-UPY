# Fuentes y Metodología de Datos — Booklet Equipo 3 (Acto 5 · Cuidarnos)

Cada archivo CSV dentro de `booklet/datos/` corresponde exactamente a una escena del capítulo, está codificado en `UTF-8`, tiene columnas en español (`snake_case`), cero datos personales (sin nombres de personas físicas, teléfonos ni domicilios) y se genera de forma reproducible mediante `scripts/etl/03_build_booklet_data.py`.

---

## 1. `escena-1.csv` y `yucatan_municipios.geojson`
- **Contenido:** Unidades médicas en operación (`DE CONSULTA EXTERNA` y `DE HOSPITALIZACIÓN`, sin farmacias ni oficinas administrativas), desglose público/privado, hospitales, población total y tasa por cada 10,000 habitantes en los 106 municipios de Yucatán (`cvegeo` `31001` a `31106`).
- **Fuente oficial directa 1 (Unidades médicas):** Secretaría de Salud — Dirección General de Información en Salud (DGIS), Catálogo Maestro CLUES (`ESTABLECIMIENTO_SALUD_202610.xlsx`), filtrado a `CLAVE DE LA ENTIDAD = 31`, `CLAVE ESTATUS DE OPERACION = 1` (`EN OPERACION`) y `CLAVE DEL TIPO ESTABLECIMIENTO` en `1` (Consulta Externa) o `2` (Hospitalización). Se eliminaron columnas de RFC, teléfonos y domicilio desde la capa Bronze.
  - URL oficial directa: `http://gobi.salud.gob.mx/gobi/catalogos/catalogosmaestros/ESTABLECIMIENTO_SALUD_202610.xlsx?V=2026.11.11`
  - Página oficial: `http://www.dgis.salud.gob.mx/contenidos/intercambio/clues_gobmx.html`
  - Licencia: Datos Abiertos MX · Fecha de corte: `octubre de 2026` (publicación `2026-11-11`).
- **Fuente oficial directa 2 (Población municipal):** INEGI, Censo de Población y Vivienda 2020 — Principales resultados por localidad (ITER Yucatán, filtrado a totales municipales `LOC = 0000`).
  - URL oficial directa: `https://www.inegi.org.mx/contenidos/programas/ccpv/2020/datosabiertos/iter/iter_31_cpv2020_csv.zip`
  - Licencia: Libre uso INEGI · Fecha de corte: `2020`.
- **Fuente de polígonos municipales (espejo de terceros):** División política municipal basada en el Marco Geoestadístico del INEGI, obtenida vía repositorio de terceros `JuveCampos/Shapes_Resiliencia_CDMX_CIDE` (filtrada a `CVE_ENT = 31` y simplificada con tolerancia `0.004°`).
  - URL del espejo: `https://raw.githubusercontent.com/JuveCampos/Shapes_Resiliencia_CDMX_CIDE/master/geojsons/Division%20Politica/mpios2.geojson`
- **Cálculo:** Agregación por `cvegeo` (`31` + clave municipal) de las 672 unidades médicas CLUES en operación; tasa calculada como `(unidades_medicas / poblacion_total) * 10000`.

---

## 2. `escena-2.csv`
- **Contenido:** Población total (`POBTOT`), población sin afiliación (`PSINDER`), población con afiliación (`PDER_SS`) y porcentaje sin afiliación (`pct_sin_afiliacion`) en las **515 AGEB urbanas con población** del municipio de Mérida (`CVEGEO 31050`).
- **Fuente oficial directa:** INEGI, Censo de Población y Vivienda 2020 — Principales resultados por AGEB y manzana urbana de Yucatán (`RESAGEBURB_31CSV20.csv`).
  - URL oficial directa: `https://www.inegi.org.mx/contenidos/programas/ccpv/2020/datosabiertos/ageb_manzana/ageb_mza_urbana_31_cpv2020_csv.zip`
  - Licencia: Libre uso INEGI · Fecha de corte: `2020`.
- **Cálculo:** Filtrado a `MUN = '050'`, `MZA = '000'`, `AGEB != '0000'` y `POBTOT > 0`. `pct_sin_afiliacion = round(100 * PSINDER / POBTOT, 2)`.

---

## 3. `escena-3.csv`
- **Contenido:** Distancia en metros y tiempo estimado caminando desde cada una de las **166 localidades oficiales con población del municipio de Mérida (`MUN = 050`, incluyendo 165 comisarías y subcomisarías fuera de la cabecera)** hasta la unidad médica CLUES en operación más cercana (sin farmacias), así como la unidad pública CLUES más cercana.
- **Fuentes oficiales directas:**
  - Localidades oficiales de Mérida (`MUN = 050`, excluyendo `0000`, `9998`, `9999`): INEGI, Censo de Población y Vivienda 2020 (ITER Yucatán). Esto garantiza que no entren localidades de municipios vecinos (como Sotuta de Peón, que en ITER corresponde a Tecoh `MUN = 076`).
  - Unidades médicas georreferenciadas: Secretaría de Salud (DGIS), Catálogo CLUES octubre 2026 (`EN OPERACION`, consulta externa y hospitalización).
- **Cálculo:** Conversión de coordenadas DMS de ITER a WGS84 (`EPSG:4326`), reproyección a UTM Zona 16N (`EPSG:32616`) y vecino más cercano (`geopandas.sjoin_nearest`). Tiempo estimado a pie: `distancia_medica_m / 80` (velocidad peatonal estándar de 4.8 km/h = 80 m/min). Umbral de 15 minutos: `minutos_pie_medico <= 15.0`.

---

## 4. `escena-4.csv`
- **Contenido:** Serie mensual de casos confirmados nuevos, defunciones nuevas, acumulados de fin de mes y tasa de letalidad mensual por COVID-19 en Yucatán (`CVE_ENT = 31`), de enero de 2020 a junio de 2021 (18 meses).
- **Fuente primaria:** Dirección General de Epidemiología (DGE), Secretaría de Salud Federal.
- **Fuente secundaria / repositorio espejo utilizado:** `mariorz/covid19-mx-time-series` (GitHub).
  - URLs:
    - `https://raw.githubusercontent.com/mariorz/covid19-mx-time-series/master/data/covid19_confirmed_mx.csv`
    - `https://raw.githubusercontent.com/mariorz/covid19-mx-time-series/master/data/covid19_deaths_mx.csv`
  - Licencia: Datos Abiertos MX / MIT · Fecha de corte de la serie: `2021-06-12`.
- **Cálculo:** Se toma el acumulado oficial al último día reportado de cada mes y se calcula `confirmados_mes = confirmados_acum_mes - confirmados_acum_mes_anterior` (y análogo para defunciones), garantizando conciliación exacta: la suma de los 18 meses es exactamente `41,179` casos confirmados y `4,078` defunciones.

---

## Datos excluidos intencionalmente del booklet
- **Farmacias:** Excluidas al migrar al catálogo oficial CLUES (que registra únicamente establecimientos de atención médica).
- **Encuesta estudiantil UPY (`encuesta_upy_respuestas_live.csv`):** Excluida porque existía en el historial del repositorio un script de llenado automático (`scripts/survey_bot/google_forms_filler.py`, ya eliminado) y no es posible demostrar que todas las respuestas correspondan a personas reales.
