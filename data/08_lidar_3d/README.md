# 🏔️ Visualización 08: LiDAR 3D — Morfología Urbana y Relieve de Mérida

- **Integrante Responsable:** 👤 **Daniel**
- **Vista en la Plataforma:** `Vista 8 - Módulo LiDAR 3D`
- **Tipo de Visualización:** Maqueta Altimétrica y Morfológica 3D Interactiva (Deck.gl / Three.js con OrbitControls, rotación, inclinación y elevación de nubes de puntos / mallas extruidas).

---

## 📂 Fuentes de Datos Incluidas

### 1. Fuente Origen (Principal): `01_fuente_origen_lidar_inegi/`
- **Nombre de la Fuente:** Continuo de Elevaciones Mexicano (CEM 3.0 INEGI) & Mallas Altimétricas LiDAR de la Península de Yucatán y Mérida.
- **Tipo de Dato:** Datos Raster Altimétricos (`GeoTIFF` / `DEM`), Nubes de Puntos (`.las` / `.laz`) o Matrices Estructuradas WebGL (`JSON` / Float32Array).
- **Enlace de Origen:** [INEGI Continuo de Elevaciones](https://www.inegi.org.mx/app/geoep/cem/)
- **Filtro Aplicado:** Sector metropolitano de Mérida y corredor norponiente.
- **Campos Clave / Esquema:**
  - `grid_x`, `grid_y`: Coordenadas de la retícula tridimensional.
  - `elevation_z`: Altura topográfica sobre el nivel del mar en metros (m.s.n.m.).
  - `canopy_height`: Altura de la cobertura vegetal / arbolado urbano.
  - `building_height`: Altura estructural de las edificaciones extruidas.

### 2. Fuente Extra 1 (Apoyo): `02_fuente_extra_geoportal_malla/`
- **Nombre de la Fuente:** GeoPortal del Ayuntamiento de Mérida (Catastro y Malla de Manzanas con Alturas de Construcción).
- **Tipo de Dato:** Archivo Vectorial Geoespacial (`GeoJSON` con propiedad `height` o `.obj` / `.gltf`).
- **Justificación del Cruce:** Extruir las siluetas vectoriales de las manzanas urbanas sobre la superficie topográfica continua para crear la maqueta de la ciudad.
- **Campos Clave:** `id_manzana`, `niveles_construccion`, `altura_metros`, `geometry`.

### 3. Fuente Extra 2 (Apoyo): `03_fuente_extra_denue_elevacion/`
- **Nombre de la Fuente:** INEGI DENUE (Puntos de Equipamiento de Salud Vinculados a Cotas Altimétricas).
- **Tipo de Dato:** Archivo Tabular / Geoespacial (`CSV` o `GeoJSON`).
- **Justificación del Cruce:** Georreferenciar los puntos de atención médica en 3D para evaluar la accesibilidad en terrenos planos y zonas de evacuación.
- **Campos Clave:** `nom_estab`, `latitud`, `longitud`, `cota_elevacion_msnm`.
