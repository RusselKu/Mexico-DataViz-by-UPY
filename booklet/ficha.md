# CAPÍTULO 09 · ACCESO A LA SALUD · ACTO 5: CUIDARNOS

## Título-hallazgo
**En Mérida, 1 de cada 5 personas no tiene afiliación médica y las comisarías caminan 56.6 minutos al centro de salud**

## Entrada
**¿Qué tan lejos queda el médico en una ciudad que crece hacia afuera?** Aunque Mérida concentra casi la mitad de las unidades médicas mapeadas en todo Yucatán (**49.6 %**), el acceso no se reparte igual: **22.1 %** de la población en sus AGEB urbanas carece de afiliación a servicios de salud y **54.6 %** de sus localidades, colonias y comisarías queda a más de 15 minutos a pie de la unidad médica más cercana.

---

## La historia en 10 segundos

1. **49.6 % (239 de 482 unidades)** — Proporción de unidades de salud registradas en Yucatán que se concentran en el municipio de Mérida, mientras 56 de 106 municipios registran cero unidades en el mapa abierto.  
   *Fuente: OpenStreetMap (Overpass) cruzado con Marco Geoestadístico INEGI (`escena-1.csv`) · Corte: 25 de noviembre de 2026.*

2. **22.1 % (211,556 habitantes)** — Población sin afiliación a servicios de salud en las 515 AGEB urbanas con habitantes del municipio de Mérida (61 AGEB superan el 30 %).  
   *Fuente: INEGI, Censo de Población y Vivienda 2020, principales resultados por AGEB y manzana urbana (`escena-2.csv`) · Corte: 2020.*

3. **56.6 min contra 11.0 min** — Mediana de caminata a la unidad de salud más cercana en las 44 comisarías y subcomisarías de Mérida frente a las 136 colonias y barrios urbanos (5.1 veces más lejos).  
   *Fuente: Cálculo espacial en proyección UTM 16N (`EPSG:32616`) con OpenStreetMap y límite municipal INEGI `31050` (`escena-3.csv`) · Corte: 25 de noviembre de 2026.*

---

## Escenas del capítulo

### Escena 1 · Concentración territorial de unidades de salud
- **Título-hallazgo:** Mérida concentra 49.6 % de las unidades de salud de Yucatán: 239 de 482
- **Subtítulo:** Unidades médicas mapeadas por municipio en los 106 municipios de Yucatán · Corte: noviembre de 2026
- **Archivo de datos:** `booklet/datos/escena-1.csv` + `booklet/datos/yucatan_municipios.geojson`
- **Gráfica D3:** `booklet/graficas/escena-1.html` (`escena-1.js`)
- **Frase de lectura:** El mapa estatal muestra un solo gran polo en Mérida (239 unidades) seguido a distancia por Valladolid (86) y Tizimín (23), mientras que 56 municipios del interior no cuentan con registro en la cartografía abierta.
- **Pie de fuente:** OpenStreetMap (Overpass API) + INEGI Censo 2020 (ITER) y Marco Geoestadístico (vía espejo GitHub JuveCampos) · Corte: 25 de noviembre de 2026.

### Escena 2 · Brecha de afiliación a servicios de salud en Mérida
- **Título-hallazgo:** 211,556 personas en las AGEB urbanas de Mérida (22.1 %) no tienen afiliación médica
- **Subtítulo:** Distribución del porcentaje de población sin afiliación (`PSINDER`) en las 515 AGEB urbanas de Mérida · Censo 2020
- **Archivo de datos:** `booklet/datos/escena-2.csv`
- **Gráfica D3:** `booklet/graficas/escena-2.html` (`escena-2.js`)
- **Frase de lectura:** Aunque el promedio municipal (22.1 %) es similar al estatal (21.8 %), la desigualdad interna es marcada: 61 AGEB urbanas de Mérida superan el 30 % de población sin derecho a servicios de salud.
- **Pie de fuente:** INEGI, Censo de Población y Vivienda 2020, conjunto de datos por AGEB y manzana urbana de Yucatán (`ageb_mza_urbana_31_cpv2020`) · Corte: 2020.

### Escena 3 · Distancia a pie a la unidad de salud en Mérida
- **Título-hallazgo:** Más de la mitad de las localidades de Mérida (54.6 %) rebasa los 15 minutos a pie al médico
- **Subtítulo:** Mediana de minutos caminando (80 m/min) a la unidad médica más cercana en 185 localidades, colonias y comisarías dentro de Mérida (`CVEGEO 31050`) · Corte: noviembre de 2026
- **Archivo de datos:** `booklet/datos/escena-3.csv`
- **Gráfica D3:** `booklet/graficas/escena-3.html` (`escena-3.js`)
- **Frase de lectura:** En las colonias y barrios consolidados la mediana es de 11.0 minutos a pie, dentro de la ciudad de 15 minutos; en las 44 comisarías y subcomisarías la mediana se dispara a 56.6 minutos.
- **Pie de fuente:** OpenStreetMap (Overpass API) filtrado al polígono municipal `31050` (INEGI) con cálculo de distancia euclidiana en UTM 16N (`EPSG:32616`) · Corte: 25 de noviembre de 2026.

### Escena 4 · Presión epidemiológica en Yucatán
- **Título-hallazgo:** Yucatán acumuló 41,179 casos confirmados y 4,078 defunciones hasta junio de 2021
- **Subtítulo:** Casos confirmados y defunciones nuevas por mes en Yucatán (`CVE_ENT = 31`), enero 2020 a junio 2021
- **Archivo de datos:** `booklet/datos/escena-4.csv`
- **Gráfica D3:** `booklet/graficas/escena-4.html` (`escena-4.js`)
- **Frase de lectura:** El mayor pico mensual ocurrió en julio de 2020 con 5,280 casos confirmados y 460 defunciones en un solo mes, poniendo a prueba la capacidad hospitalaria concentrada en la capital.
- **Pie de fuente:** Dirección General de Epidemiología (DGE, Secretaría de Salud), serie histórica obtenida vía repositorio espejo de terceros (`mariorz/covid19-mx-time-series`) · Corte: 12 de junio de 2021.

---

## Lo que estos datos no dicen

- **Subregistro cartográfico en OpenStreetMap:** Los 482 registros de salud provienen de cartografía colaborativa abierta (OpenStreetMap), no del directorio censal completo DENUE/CLUES; que un municipio aparezca con 0 registros refleja ausencia de mapeo abierto, no necesariamente ausencia total de consultorios o casas de salud rurales.
- **Distancia en línea recta, no por ruta caminable:** Los minutos a pie de la Escena 3 se estimaron con distancia euclidiana en proyección UTM 16N a 80 m/min (4.8 km/h); en la práctica, la falta de banquetas, el calor extremo y los rodeos viales alargan el trayecto real.
- **Vigencia del Censo 2020:** Los datos de afiliación por AGEB corresponden al Censo de Población y Vivienda 2020 y no capturan los cambios institucionales posteriores (transición de INSABI a IMSS-Bienestar ni nuevos fraccionamientos construidos entre 2021 y 2026).
- **Corte de la serie epidemiológica:** La serie mensual DGE cubre del 23 de enero de 2020 al 12 de junio de 2021 (primeras olas previas a la variante Ómicron) y proviene de un repositorio espejo de terceros debidamente citado en `booklet/datos/FUENTES.md`.
- **Exclusión de la encuesta estudiantil UPY:** Aunque el repositorio conservó en capas previas un archivo de Google Sheets, **esta encuesta queda fuera del booklet** porque existía en el repositorio un script automatizado de llenado (`survey_bot`) que impide certificar al 100 % que todas las respuestas provengan de personas reales. Dicho script fue eliminado del repositorio.

---

## Puente al cierre

Cuando el suelo se encarece en el centro, el transporte no alcanza, el agua se estanca y el médico queda a casi una hora de camino en las comisarías, las brechas dejan de ser aisladas: **el mapa de síntesis del cierre muestra en qué AGEB de Mérida se juntan todas estas presiones al mismo tiempo.**

---

## Nota de corrección de fallas (Sección 6 del Plan del Booklet)

1. **Sitio principal conectado a datos reales (`data/gold/` y `data/silver/`):** Se actualizó `js/` para leer los CSV y JSON reales del repositorio y recalcular los indicadores dinámicamente, retirando las cifras sin respaldo (`89.4 %`, `2.1 M dosis`).
2. **Cero `Math.random`:** Se eliminaron todas las llamadas a `Math.random()` en `js/modules/threeVisuals.js`, sustituyéndolas por geometría determinística derivada de `data/silver/dem_altimetria_merida_matrix.json` y `data/silver/pdb_6vxx_estructura_molecular.json`.
3. **Encuesta y bot:** Se eliminó `scripts/survey_bot/google_forms_filler.py` y se excluyó la encuesta del booklet conforme a la regla de veracidad.
4. **Fuentes de segunda mano y Censo oficial:** Se citan explícitamente los espejos de terceros (`mariorz/covid19-mx-time-series` y `JuveCampos/Shapes_Resiliencia_CDMX_CIDE`) en `booklet/datos/FUENTES.md` y se descargó directamente de `inegi.org.mx` el Censo 2020 oficial por municipio y por AGEB urbana de Mérida (`escena-2.csv`).
5. **Idioma 100 % en español y cero rutas locales:** Se tradujeron los textos visibles en `index.html`, `js/`, `README.md` y `booklet/` (eliminando «Data Storytelling», «Auto-Tour», «Export», «Self-Produced») y se reemplazaron las rutas locales `file:///c:/...` por enlaces relativos.
