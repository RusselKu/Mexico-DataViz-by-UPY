# Diccionario de Datos — Mexico-DataViz-by-UPY (Equipo 3)

**Fecha de generación:** `2026-11-25T17:55:21Z`  
**Estándar:** DataGeo / Data Warehouse (Structured Data Team + Spatial Data Team)  
**Claves territoriales homologadas:** `cve_ent = 31` (Yucatán), `cve_mun = 001..106`, `cvegeo = 31001..31106` (`31050` = Mérida)  
**Sistema de Referencia de Coordenadas (CRS):** `EPSG:4326` (WGS84) para intercambio y `EPSG:32616` (UTM 16N) para cálculos métricos.

## `dim_municipios_yucatan` (`data/silver/dim_municipios_yucatan.csv`)

| Columna | Tipo | No Nulos | Unidad | Descripción | Ejemplo |
| :--- | :--- | ---: | :--- | :--- | :--- |
| `cvegeo` | `object` | 106 | clave 5 dígitos | Clave geoestadística única INEGI (CVE_ENT + CVE_MUN) | `31001` |
| `cve_ent` | `object` | 106 | clave 2 dígitos | Clave de entidad federativa (31 = Yucatán) | `31` |
| `cve_mun` | `object` | 106 | clave 3 dígitos | Clave municipal INEGI (001-106) | `001` |
| `nom_ent` | `object` | 106 | texto | Nombre de la entidad federativa | `Yucatán` |
| `nom_mun` | `object` | 106 | texto | Nombre oficial del municipio | `Abalá` |
| `jurisdiccion_sanitaria` | `object` | 106 | categoría | Jurisdicción sanitaria estatal asignada (1, 2 o 3) | `Jurisdicción 1 - Mérida (Centro/Metropolitana)` |
| `area_km2` | `float64` | 106 | km² | Superficie territorial calculada en proyección UTM 16N | `293.161` |
| `perimetro_km` | `float64` | 106 | km | Perímetro municipal calculado en proyección UTM 16N | `121.538` |
| `centroide_lat` | `float64` | 106 | grados | Latitud del centroide municipal (WGS84) | `20.655274` |
| `centroide_lon` | `float64` | 106 | grados | Longitud del centroide municipal (WGS84) | `-89.650412` |
| `geometry` | `Geometry (WGS84)` | 106 | grados decimales (EPSG:4326) | Geometría espacial validada en proyección WGS84 | `Polygon` |

## `unidades_medicas_yucatan` (`data/silver/unidades_medicas_yucatan.csv`)

| Columna | Tipo | No Nulos | Unidad | Descripción | Ejemplo |
| :--- | :--- | ---: | :--- | :--- | :--- |
| `id_unidad` | `object` | 504 | ID único | Identificador único del establecimiento de salud | `OSM-N-885196054` |
| `nombre_establecimiento` | `object` | 504 | texto | Nombre comercial o institucional de la unidad médica | `Clínica de Merida` |
| `categoria_salud` | `object` | 504 | categoría | Tipo de unidad (hospital, clinic, doctors, pharmacy, dentist) | `hospital` |
| `operador_institucion` | `object` | 504 | texto | Institución u operador (IMSS, ISSSTE, SSY, Privado, etc.) | `No especificado` |
| `calle` | `object` | 504 |  |  | `` |
| `colonia` | `object` | 504 |  |  | `` |
| `codigo_postal` | `object` | 504 |  |  | `` |
| `latitud` | `float64` | 504 | grados | Latitud WGS84 | `20.986428` |
| `longitud` | `float64` | 504 | grados | Longitud WGS84 | `-89.638427` |
| `geometry` | `Geometry (WGS84)` | 504 | grados decimales (EPSG:4326) | Geometría espacial validada en proyección WGS84 | `Point` |
| `cvegeo` | `object` | 504 | clave 5 dígitos | Clave municipal INEGI obtenida por spatial join | `31050` |
| `cve_ent` | `object` | 504 |  |  | `31` |
| `cve_mun` | `object` | 504 |  |  | `050` |
| `nom_mun` | `object` | 504 | texto | Municipio de Yucatán al que pertenece la unidad | `Mérida` |
| `jurisdiccion_sanitaria` | `object` | 504 | categoría | Jurisdicción sanitaria correspondiente | `Jurisdicción 1 - Mérida (Centro/Metropolitana)` |

## `serie_epidemiologica_yucatan` (`data/silver/serie_epidemiologica_yucatan.csv`)

| Columna | Tipo | No Nulos | Unidad | Descripción | Ejemplo |
| :--- | :--- | ---: | :--- | :--- | :--- |
| `fecha_iso` | `object` | 500 | YYYY-MM-DD | Fecha de reporte epidemiológico en formato ISO-8601 | `2020-01-23` |
| `anio_mes` | `object` | 500 | YYYY-MM | Periodo mensual para agregación BI | `2020-01` |
| `cve_ent` | `object` | 500 | clave 2 dígitos | Clave entidad INEGI (31 = Yucatán) | `31` |
| `nom_ent` | `object` | 500 |  |  | `Yucatán` |
| `confirmados` | `int64` | 500 | casos/día | Casos positivos confirmados diarios en Yucatán | `0` |
| `defunciones` | `int64` | 500 | defunciones/día | Defunciones diarias registradas en Yucatán | `0` |
| `negativos` | `int64` | 500 |  |  | `0` |
| `sospechosos` | `int64` | 500 |  |  | `0` |
| `confirmados_acum` | `int64` | 500 | casos | Acumulado histórico de casos confirmados | `0` |
| `defunciones_acum` | `int64` | 500 |  |  | `0` |
| `tasa_letalidad_acum_pct` | `float64` | 500 |  |  | `0.0` |
| `tasa_supervivencia_acum_pct` | `float64` | 500 | % | Porcentaje acumulado de supervivencia (100 - letalidad) | `100.0` |

## `comisarias_isocronas_merida` (`data/silver/comisarias_isocronas_merida.csv`)

| Columna | Tipo | No Nulos | Unidad | Descripción | Ejemplo |
| :--- | :--- | ---: | :--- | :--- | :--- |
| `id_localidad` | `object` | 243 | ID único | Identificador de localidad, comisaría o colonia | `LOC-287021318` |
| `nombre_localidad` | `object` | 243 | texto | Nombre oficial de la comisaría o colonia de Mérida | `Umán` |
| `tipo_asentamiento` | `object` | 243 |  |  | `town` |
| `cvegeo` | `object` | 243 |  |  | `31050` |
| `municipio` | `object` | 243 |  |  | `Mérida` |
| `latitud` | `float64` | 243 |  |  | `20.881369` |
| `longitud` | `float64` | 243 |  |  | `-89.746186` |
| `geometry` | `Geometry (WGS84)` | 243 | grados decimales (EPSG:4326) | Geometría espacial validada en proyección WGS84 | `Point` |
| `parque_mas_cercano` | `object` | 243 |  |  | `Parque principal del Centro de Umán` |
| `dist_parque_m` | `float64` | 243 | metros | Distancia euclidiana UTM 16N al parque más cercano | `114.7` |
| `min_caminata_parque` | `float64` | 243 | minutos | Tiempo estimado de caminata al parque (80 m/min) | `1.4` |
| `salud_mas_cercana` | `object` | 243 |  |  | `Farmacia Guadalajara` |
| `dist_salud_m` | `float64` | 243 | metros | Distancia euclidiana UTM 16N a la unidad médica más cercana | `9524.1` |
| `min_caminata_salud` | `float64` | 243 | minutos | Tiempo estimado de caminata a unidad médica | `119.1` |
| `cumple_ciudad_15min_parque` | `bool` | 243 | booleano | True si está a <= 15 min caminando de un parque | `True` |
| `cumple_ciudad_15min_salud` | `bool` | 243 |  |  | `False` |

## `corpus_prensa_yucatan` (`data/silver/corpus_prensa_yucatan.csv`)

| Columna | Tipo | No Nulos | Unidad | Descripción | Ejemplo |
| :--- | :--- | ---: | :--- | :--- | :--- |
| `id_articulo` | `object` | 235 | ID único | Identificador único del artículo scrapeado | `NOT-YUC-0001` |
| `topico` | `object` | 235 | categoría | Tópico de consulta temática en Yucatán | `vacunacion_yucatan` |
| `medio` | `object` | 235 | texto | Medio de comunicación regional o nacional | `Gobierno del Estado de Yucatán` |
| `fecha_iso` | `object` | 235 | YYYY-MM-DD | Fecha de publicación normalizada ISO-8601 | `2026-04-25` |
| `anio_mes` | `object` | 235 |  |  | `2026-04` |
| `titular` | `object` | 235 |  |  | `Inicia en Yucatán la Semana Nacional de Vacunación 2026 "Vac` |
| `keywords` | `object` | 235 |  |  | `vacunación; vacuna; yucatán` |
| `polaridad` | `float64` | 235 | [-1.0, +1.0] | Índice de polaridad léxica del titular | `1.0` |
| `sentimiento` | `object` | 235 | categoría | Clasificación: positivo, neutro o negativo | `positivo` |
| `cve_ent` | `object` | 235 |  |  | `31` |
| `cve_mun` | `object` | 235 |  |  | `000` |
| `url` | `object` | 235 |  |  | `https://news.google.com/rss/articles/CBMibkFVX3lxTFBrSjFKQ3c` |

## `encuesta_upy_estudiantil` (`data/silver/encuesta_upy_estudiantil.csv`)

| Columna | Tipo | No Nulos | Unidad | Descripción | Ejemplo |
| :--- | :--- | ---: | :--- | :--- | :--- |
| `id_respuesta` | `object` | 166 | ID único | Identificador anonimizado de cada respuesta | `UPY-ENC-0001` |
| `fecha_respuesta_iso` | `object` | 166 | ISO-8601 | Fecha y hora de registro en Google Forms | `2026-09-30T19:03:41` |
| `rol_programa` | `object` | 166 | categoría | Programa educativo o rol dentro de la UPY | `Estudiante Ing. en Datos` |
| `nivel_educativo_confinamiento` | `object` | 166 |  |  | `Secundaria` |
| `diagnostico_covid19` | `object` | 166 |  |  | `Sí con síntomas evidentes sin prueba` |
| `esquema_vacunacion` | `object` | 166 |  |  | `Esquema completo con refuerzo(s)` |
| `afectacion_familiar_likert` | `int64` | 166 |  |  | `3` |
| `dificultad_clases_virtuales_likert` | `int64` | 166 |  |  | `4` |
| `modalidad_preferida_ingenieria` | `object` | 166 |  |  | `100% Presencial en laboratorio` |
| `retos_educacion_linea` | `object` | 166 |  |  | `Conexión a internet inestable / fallas eléctricas` |
| `habilidades_digitales_upy` | `object` | 166 |  |  | `Manejo de plataformas en la nube, Autodidactismo / tutoriale` |
| `satisfaccion_presencial_likert` | `int64` | 166 | escala 1-5 | Satisfacción con el retorno 100% presencial | `3` |
| `horas_sueno_diario` | `object` | 166 |  |  | `Menos de 5 horas` |
| `frecuencia_actividad_fisica` | `object` | 166 |  |  | `5 o más días a la semana` |
| `nivel_estres_entregas_likert` | `int64` | 166 | escala 1-5 | Nivel de estrés percibido en entregas finales | `4` |
| `zona_origen_merida` | `object` | 166 | categoría | Zona de origen desde donde se traslada al campus | `Mérida Centro` |
| `tiempo_traslado_campus` | `object` | 166 |  |  | `Menos de 30 minutos` |
| `cve_ent` | `object` | 166 |  |  | `31` |
| `cve_mun` | `object` | 166 |  |  | `050` |
| `cvegeo` | `object` | 166 | clave 5 dígitos | Clave municipal (31050 para Mérida) | `31050` |
