# 🥽 Visualización 09: Realidad Aumentada (AR) — Inmersión Molecular y Proyección Espacial

- **Integrante Responsable:** 👤 **Daniel**
- **Vista en la Plataforma:** `Vista 9 - Módulo Realidad Aumentada (AR)`
- **Tipo de Visualización:** Holograma Molecular Tridimensional en Realidad Aumentada (WebXR / Three.js / AR.js) del Complejo de la Espícula Viral Spike + Proyección Espacial de la Maqueta Territorial sobre la mesa del usuario.

---

## 📂 Fuentes de Datos Incluidas

### 1. Fuente Origen (Principal): `01_fuente_origen_pdb_molecular/`
- **Nombre de la Fuente:** Protein Data Bank (PDB ID: `6VXX` - Estructura Crio-EM de la Glicoproteína Espicular Spike en conformación cerrada / diseño de vacunas de ARNm).
- **Tipo de Dato:** Archivo Biológico Estructural (`PDB`, `mmCIF`) o Modelo Optimizado 3D Web (`.gltf`, `.glb`, `.usdz`).
- **Enlace de Origen:** [RCSB Protein Data Bank - PDB 6VXX](https://www.rcsb.org/structure/6VXX)
- **Campos Clave / Esquema:**
  - `atom_id`: Número secuencial del átomo.
  - `atom_name`: Nombre del átomo químico (N, CA, C, O, CB).
  - `residue_name`: Aminoácido (GLY, SER, VAL, etc.).
  - `chain_id`: Cadena polipeptídica (A, B, C del trímero).
  - `coord_x`, `coord_y`, `coord_z`: Coordenadas atómicas en Ångströms (Å).

### 2. Fuente Extra 1 (Apoyo): `02_fuente_extra_modelos_urbanos/`
- **Nombre de la Fuente:** Malla Geométrica Volumétrica de Mérida y Campus UPY (GeoPortal + Three.js Geometry).
- **Tipo de Dato:** Archivo de Modelo Tridimensional (`GLTF`, `GLB`, `OBJ`).
- **Justificación del Cruce:** Permitir al usuario alternar en Realidad Aumentada entre la escala nanométrica (proteína de la vacuna) y la escala macro-urbana (maqueta holográfica de la ciudad).
- **Campos Clave:** `mesh_name`, `vertices_count`, `textures`, `scale_factor`.

### 3. Fuente Extra 2 (Apoyo): `03_fuente_extra_webxr_markers/`
- **Nombre de la Fuente:** Marcadores de Anclaje Visual y Archivos de Configuración WebXR / AR Hit-Test.
- **Tipo de Dato:** Archivos de Calibración (`PNG`, `.patt` Hiro/Barcode, `JSON` de parámetros de anclaje espacial).
- **Justificación del Cruce:** Garantizar la estabilidad de la proyección en pantallas móviles y visores WebXR sin deriva de imagen.
- **Campos Clave:** `pattern_url`, `matrix_code_type`, `hit_test_surface_plane`.
