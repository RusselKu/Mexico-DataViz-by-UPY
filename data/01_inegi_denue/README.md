# 🏥 Visualización 01: INEGI DENUE — Cartografía Económica y Vulnerabilidad

- **Integrante Responsable:** 👤 **Ale**
- **Vista en la Plataforma:** `Vista 1 - Módulo INEGI`
- **Tipo de Visualización:** Explorador Cartográfico Multiescalar con Clusters Dinámicos y Cálculo de Cobertura Médica (Radio 15 min).

---

## 📂 Fuentes de Datos Incluidas

### 1. Fuente Origen (Principal): `01_fuente_origen_inegi/`
- **Nombre de la Fuente:** INEGI - Directorio Nacional de Unidades Económicas (DENUE) 2020-2024 & Censo de Población y Vivienda 2020.
- **Tipo de Dato:** Archivo Tabular / Geoespacial (`CSV` o `GeoJSON`) / `API DENUE INEGI`.
- **Enlace de Origen:** [INEGI DENUE Interactivo](https://www.inegi.org.mx/app/descarga/)
- **Filtro Aplicado:** Sector 62 (Servicios de salud y de asistencia social) para el Estado de Yucatán (Cve Entidad `31`) y Municipio de Mérida (`050`).
- **Campos Clave / Esquema:**
  - `id`: Identificador único de la unidad económica.
  - `nom_estab`: Nombre o razón social del establecimiento (clínica, farmacia, hospital, consultorio).
  - `codigo_act`: Código SCIAN de actividad económica (e.g., `621111` Consultorios de medicina general).
  - `nombre_act`: Descripción de la actividad económica.
  - `latitud`, `longitud`: Coordenadas geográficas decimales (EPSG:4326).
  - `tipo_asent`: Colonia, fraccionamiento o comisaría.
  - `municipio`: Clave y nombre de municipio (Mérida, Valladolid, etc.).

### 2. Fuente Extra 1 (Apoyo): `02_fuente_extra_datos_gob/`
- **Nombre de la Fuente:** Base Abierta de Salud Federal (Datos.gob.mx / Dirección General de Epidemiología).
- **Tipo de Dato:** Archivo Tabular (`CSV` o `API REST JSON`).
- **Justificación del Cruce:** Cruzar la oferta física hospitalaria (DENUE) contra la demanda histórica y tasas de recuperación registradas a nivel municipal.
- **Campos Clave:** `ENTIDAD_RES`, `MUNICIPIO_RES`, `FECHA_SINTOMAS`, `CLASIFICACION_FINAL`, `TIPO_PACIENTE`.

### 3. Fuente Extra 2 (Apoyo): `03_fuente_extra_siegy/`
- **Nombre de la Fuente:** SIEGY Yucatán (Índices de Marginación y Población Vulnerable por AGEB/Municipio).
- **Tipo de Dato:** Archivo Tabular / Hoja de Cálculo (`CSV` o `XLSX`).
- **Justificación del Cruce:** Evaluar la equidad en el acceso a la red de salud frente al grado de marginación social de cada sector territorial.
- **Campos Clave:** `cve_mun`, `municipio`, `pob_total`, `indice_marginacion`, `grado_marginacion`.
