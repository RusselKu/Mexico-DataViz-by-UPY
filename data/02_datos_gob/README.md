# 📊 Visualización 02: Datos.gob.mx — Pulso Epidemiológico y Curva de Recuperación

- **Integrante Responsable:** 👤 **Ale**
- **Vista en la Plataforma:** `Vista 2 - Módulo Datos.gob.mx`
- **Tipo de Visualización:** Diagrama de Sankey de Rutas de Pacientes (Detección -> Tratamiento -> Recuperación) + Curvas de Recuperación Temporal con Scrubbing Interactivo.

---

## 📂 Fuentes de Datos Incluidas

### 1. Fuente Origen (Principal): `01_fuente_origen_datos_gob/`
- **Nombre de la Fuente:** Datos.gob.mx / Dirección General de Epidemiología (DGE - Secretaría de Salud Federal).
- **Tipo de Dato:** Archivo Tabular Masivo (`CSV` o `API REST JSON` de Datos Abiertos México).
- **Enlace de Origen:** [Datos Abiertos de Salud México](https://datos.gob.mx/busca/dataset/informacion-referente-a-casos-covid-19-en-mexico)
- **Filtro Aplicado:** Registros con `ENTIDAD_UM == 31` (Yucatán) o nivel nacional agregado para comparativa temporal.
- **Campos Clave / Esquema:**
  - `ID_REGISTRO`: Identificador anonimizado.
  - `ENTIDAD_RES`, `MUNICIPIO_RES`: Ubicación de residencia del paciente.
  - `EDAD`, `SEXO`: Datos demográficos.
  - `TIPO_PACIENTE`: 1 (Ambulatorio), 2 (Hospitalizado).
  - `INTUBADO`, `UCI`: Indicadores de gravedad y cuidados intensivos.
  - `FECHA_SINTOMAS`, `FECHA_INGRESO`, `FECHA_DEF`: Fechas de evolución clínica.
  - `CLASIFICACION_FINAL`: Estatus de confirmación médica.

### 2. Fuente Extra 1 (Apoyo): `02_fuente_extra_inegi/`
- **Nombre de la Fuente:** INEGI - Censo de Población y Vivienda 2020 (Estructura por Grupos de Edad).
- **Tipo de Dato:** Archivo Tabular (`CSV`).
- **Justificación del Cruce:** Normalizar las tasas de recuperación y atención médica por cada 100,000 habitantes según la pirámide poblacional de Yucatán y México.
- **Campos Clave:** `rango_edad`, `poblacion_masculina`, `poblacion_femenina`, `total_poblacion`.

### 3. Fuente Extra 2 (Apoyo): `03_fuente_extra_transparencia/`
- **Nombre de la Fuente:** Plataforma Nacional de Transparencia (Capacidad Instalada de Camas de Hospitalización y UCI).
- **Tipo de Dato:** Archivo Tabular (`CSV` o `XLSX`).
- **Justificación del Cruce:** Contrastar el flujo de pacientes hospitalizados en el Sankey con la capacidad instalada y la tasa de desahogo de camas.
- **Campos Clave:** `unidad_medica`, `camas_generales_totales`, `camas_uci_totales`, `promedio_dias_estancia`.
