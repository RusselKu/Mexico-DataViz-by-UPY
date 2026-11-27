# CAPÍTULO 09 · ACCESO A LA SALUD · ACTO 5: CUIDARNOS

## Título-hallazgo
**Mérida concentra 55.7 % de los hospitales de Yucatán, pero 87.3 % de sus comisarías camina más de 15 minutos al médico**

## Entrada
**¿Qué tan lejos queda el médico en una ciudad que crece hacia afuera?** Según el catálogo oficial CLUES de la Secretaría de Salud (octubre 2026, sin farmacias), Mérida concentra **42.3 %** de las unidades médicas en operación y **55.7 %** de los hospitales de Yucatán; sin embargo, **22.1 %** de la población en sus AGEB urbanas no tiene afiliación médica y **144 de sus 165 comisarías y subcomisarías** (**32,959 habitantes**) quedan a más de 15 minutos a pie de la unidad médica más cercana.

---

## La historia en 10 segundos

1. **42.3 % (284 de 672 unidades) y 55.7 % de hospitales (34 de 61)** — Proporción de unidades médicas en operación (consulta externa y hospitalización, sin farmacias) que se concentran en Mérida, mientras **93 de 106 municipios** de Yucatán no tienen hospital.  
   *Fuente: Secretaría de Salud (DGIS), Catálogo CLUES (`escena-1.csv`) · Corte: octubre de 2026.*

2. **22.1 % (211,556 habitantes)** — Población sin afiliación a servicios de salud en las 515 AGEB urbanas con habitantes del municipio de Mérida (61 AGEB superan el 30 %).  
   *Fuente: INEGI, Censo de Población y Vivienda 2020, principales resultados por AGEB y manzana urbana (`escena-2.csv`) · Corte: 2020.*

3. **87.3 % (144 de 165 comisarías y subcomisarías; 32,959 hab.)** — Localidades oficiales fuera de la cabecera de Mérida que quedan a más de 15 minutos caminando de la unidad médica CLUES más cercana, con una mediana de **43.6 minutos** (frente a **1.3 minutos** en las 5 comisarías de 2,500 o más habitantes que sí tienen centro de salud local).  
   *Fuente: INEGI Censo 2020 (ITER, localidades MUN = 050) cruzado en UTM 16N con CLUES octubre 2026 (`escena-3.csv`) · Corte: octubre de 2026.*

---

## Escenas del capítulo

### Escena 1 · Concentración territorial de unidades médicas y hospitales (CLUES)
- **Título-hallazgo:** Mérida concentra 42.3 % de las unidades médicas de Yucatán (284 de 672) y 55.7 % de los hospitales
- **Subtítulo:** Unidades médicas en operación (consulta externa y hospitalización, sin farmacias) en los 106 municipios de Yucatán · CLUES octubre 2026
- **Archivo de datos:** `booklet/datos/escena-1.csv` + `booklet/datos/yucatan_municipios.geojson`
- **Gráfica D3:** `booklet/graficas/escena-1.html` (`escena-1.js`)
- **Frase de lectura:** Aunque los 106 municipios cuentan con al menos una unidad de consulta externa en CLUES, 93 de 106 no tienen hospital; además, en Mérida 230 de las 284 unidades son privadas y solo 54 son públicas.
- **Pie de fuente:** Secretaría de Salud (DGIS), Catálogo CLUES (octubre 2026) + INEGI Censo 2020 (ITER) y polígonos municipales (vía espejo GitHub JuveCampos).

### Escena 2 · Brecha de afiliación a servicios de salud en Mérida
- **Título-hallazgo:** 211,556 personas en las AGEB urbanas de Mérida (22.1 %) no tienen afiliación médica
- **Subtítulo:** Distribución de las 515 AGEB urbanas con población en Mérida según porcentaje sin afiliación (`PSINDER`) · Censo 2020
- **Archivo de datos:** `booklet/datos/escena-2.csv`
- **Gráfica D3:** `booklet/graficas/escena-2.html` (`escena-2.js`)
- **Frase de lectura:** El promedio de las 515 AGEB urbanas de Mérida (22.1 %) oculta brechas internas: 61 AGEB superan el 30 % de habitantes sin afiliación a servicios de salud.
- **Pie de fuente:** INEGI, Censo de Población y Vivienda 2020, principales resultados por AGEB y manzana urbana de Yucatán (`ageb_mza_urbana_31_cpv2020`) · Corte: 2020.

### Escena 3 · Distancia a pie a la unidad médica CLUES en Mérida
- **Título-hallazgo:** 87.3 % de las comisarías y subcomisarías de Mérida rebasa los 15 minutos a pie al médico (32,959 habitantes)
- **Subtítulo:** Mediana de minutos caminando (80 m/min) desde las 166 localidades oficiales de Mérida (INEGI ITER 2020, MUN 050) hasta la unidad médica CLUES en operación más cercana (sin farmacias)
- **Archivo de datos:** `booklet/datos/escena-3.csv`
- **Gráfica D3:** `booklet/graficas/escena-3.html` (`escena-3.js`)
- **Frase de lectura:** De las 165 localidades oficiales fuera de la cabecera municipal, 144 quedan a más de 15 minutos a pie de una unidad médica CLUES (mediana de 43.6 min); solo las 5 comisarías de 2,500 o más habitantes tienen unidad médica local (mediana de 1.3 min).
- **Pie de fuente:** INEGI Censo 2020 (ITER, MUN = 050) cruzado en UTM 16N (`EPSG:32616`) con Secretaría de Salud (DGIS, CLUES octubre 2026).

### Escena 4 · Presión epidemiológica en Yucatán
- **Título-hallazgo:** Yucatán acumuló 41,179 casos confirmados y 4,078 defunciones hasta junio de 2021
- **Subtítulo:** Casos confirmados nuevos (barras moradas) y defunciones nuevas (línea oro) por mes en Yucatán (`CVE_ENT = 31`), enero 2020 a junio 2021
- **Archivo de datos:** `booklet/datos/escena-4.csv`
- **Gráfica D3:** `booklet/graficas/escena-4.html` (`escena-4.js`)
- **Frase de lectura:** El pico mensual ocurrió en julio de 2020 con 5,280 casos confirmados y 460 defunciones. La suma de los 18 meses coincide exactamente con el acumulado estatal (41,179 casos y 4,078 defunciones).
- **Pie de fuente:** Dirección General de Epidemiología (DGE, Secretaría de Salud), serie histórica obtenida vía repositorio espejo de terceros (`mariorz/covid19-mx-time-series`) · Corte: 12 de junio de 2021.

---

## Lo que estos datos no dicen

- **Consultorios adyacentes a farmacias y médicos independientes no registrados en CLUES:** Al usar el catálogo oficial CLUES en operación (consulta externa y hospitalización) se excluyen farmacias y consultorios sin clave CLUES, así como unidades administrativas o de apoyo (57 unidades de apoyo y 11 de asistencia social en Yucatán).
- **Distancia en línea recta, no por ruta caminable:** Los minutos a pie de la Escena 3 se estimaron con distancia euclidiana en proyección UTM 16N a 80 m/min (4.8 km/h) desde el centroide oficial de cada localidad ITER hasta la unidad CLUES más cercana; la falta de banquetas, el calor y los rodeos viales aumentan el tiempo real.
- **Vigencia del Censo 2020:** Los datos de afiliación por AGEB y población por localidad corresponden al Censo 2020 y no reflejan cambios posteriores a 2020 (transición de INSABI a IMSS-Bienestar ni nuevos fraccionamientos construidos entre 2021 y 2026).
- **Corte de la serie epidemiológica:** La serie mensual DGE cubre del 23 de enero de 2020 al 12 de junio de 2021 (primeras olas previas a Ómicron) y proviene de un repositorio espejo de terceros citado en `booklet/datos/FUENTES.md`.
- **Exclusión de la encuesta estudiantil UPY:** La encuesta estudiantil queda fuera del booklet porque existía en el historial del repositorio un script automatizado (`survey_bot`, ya eliminado) que impide certificar que todas las respuestas correspondan a personas reales.

---

## Puente al cierre

Cuando el suelo se encarece en el centro, el transporte no alcanza, el agua se estanca y el médico queda a más de 40 minutos a pie en la mayoría de las comisarías, las brechas dejan de ser aisladas: **el mapa de síntesis del cierre muestra en qué AGEB de Mérida se juntan todas estas presiones al mismo tiempo.**

---

## Nota de corrección de fallas y observaciones de revisión

1. **Migración a CLUES oficial (sin farmacias) e ITER oficial de Mérida (`MUN = 050`):** Se sustituyó OpenStreetMap por el catálogo oficial **CLUES de la Secretaría de Salud (DGIS, octubre 2026)** filtrando únicamente unidades médicas en operación (consulta externa y hospitalización, 0 farmacias, sin teléfonos ni domicilios personales) y se cruzaron con las **166 localidades oficiales de Mérida del ITER 2020 (INEGI)**, eliminando localidades de otros municipios como Sotuta de Peón (Tecoh).
2. **Conciliación exacta en Escena 4 (DGE):** Se calcularon los totales mensuales por diferencia de acumulados de fin de mes para que la suma de los 18 meses sea exactamente `41,179` confirmados y `4,078` defunciones.
3. **Legibilidad impresa (≥ 8 pt reales) y etiquetas limpias:** Se reajustaron las 4 escenas D3 a `viewBox="0 0 680 H"` con fuentes `11.5–12.5 px` (8.6–9.4 pt reales al imprimir en carta), eliminando textos cortados en Escena 1 y separando limpiamente las etiquetas del pico en Escena 4.
4. **Fallas previas de la sección 6 corregidas:** Sitio principal conectado a `data/gold/` y `data/silver/`, `0` `Math.random`, `scripts/survey_bot/` eliminado, fuentes espejo citadas explícitamente, 100 % en español y `0` rutas locales.
