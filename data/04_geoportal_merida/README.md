# 🏙️ Visualización 04: GeoPortal Mérida — Accesibilidad Urbana, Barrios y Comisarías

- **Integrante Responsable:** 👤 **Russel (Russelsin)**
- **Vista en la Plataforma:** `Vista 4 - Módulo GeoPortal Mérida`
- **Tipo de Visualización:** Mapa Interactivo de Isócronas Urbanas (Caminabilidad 5, 10, 15 y 20 minutos) + Explorador Territorial de Comisarías de Mérida (Caucel, Komchén, Dzityá, Chablekal, Cholul, Los Héroes).

---

## 📂 Fuentes de Datos Incluidas

### 1. Fuente Origen (Principal): `01_fuente_origen_geoportal/`
- **Nombre de la Fuente:** GeoPortal del Ayuntamiento de Mérida (Dirección de Desarrollo Urbano / Catastro Municipal / Servicios Públicos).
- **Tipo de Dato:** Vectorial Geoespacial (`GeoJSON`, `Shapefile .shp`, o servicio `WFS GeoServer`).
- **Enlace de Origen:** [GeoPortal Ayuntamiento de Mérida](https://geoportal.merida.gob.mx/)
- **Filtro Aplicado:** Capas de polígonos de colonias, fraccionamientos, 47 comisarías del municipio de Mérida, traza vial y parques/equipamiento barrial.
- **Campos Clave / Esquema:**
  - `id_poligono`: Identificador del barrio o comisaría.
  - `nombre`: Nombre oficial (e.g. Cholul, Komchén, Dzityá, Ciudad Caucel, Los Héroes).
  - `tipo_zona`: Urbana consolidada / Comisaría periurbana.
  - `tiempo_caminata_min`: Isócrona estimada a puntos de servicio esencial (5, 10, 15, 20 min).
  - `geometry`: Coordenadas de polígonos (GeoJSON MultiPolygon / Polygon en EPSG:4326).

### 2. Fuente Extra 1 (Apoyo): `02_fuente_extra_denue/`
- **Nombre de la Fuente:** INEGI DENUE (Puntos de Vacunación Masiva, Módulos Comunitarios y Farmacias de Barrio).
- **Tipo de Dato:** Archivo Tabular / Geoespacial (`CSV` o `GeoJSON`).
- **Justificación del Cruce:** Calcular la distancia real y tiempo de acceso a pie desde los hogares en comisarías y colonias hacia su módulo de atención más cercano.
- **Campos Clave:** `nombre_sede`, `latitud`, `longitud`, `tipo_servicio`, `capacidad_diaria`.

### 3. Fuente Extra 2 (Apoyo): `03_fuente_extra_self_produced/`
- **Nombre de la Fuente:** Datos de Movilidad Estudiantil y Percepción Vecinal UPY.
- **Tipo de Dato:** Archivo Tabular / Puntos Geoespaciales (`CSV` o `GeoJSON`).
- **Justificación del Cruce:** Validar los polígonos teóricos de isócronas con los tiempos reales reportados por estudiantes y vecinos en sus traslados diarios.
- **Campos Clave:** `zona_origen`, `medio_transporte`, `tiempo_real_minutos`, `nivel_accesibilidad_score`.
