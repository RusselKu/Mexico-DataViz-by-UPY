# 🎓 Visualización 07: Self-Produced Data — La Voz Universitaria UPY

- **Integrante Responsable:** 👤 **Russel (Russelsin)**
- **Vista en la Plataforma:** `Vista 7 - Módulo Self-Produced Data`
- **Tipo de Visualización:** Dashboard Demoscópico Interactivo con Barras Divergentes (Escalas Likert Dinámicas: Aprendizaje Remoto, Bienestar Mental, Hábitos Saludables) + Flujos de Movilidad Estudiantil hacia el Campus UPY.

---

## 📂 Fuentes de Datos Incluidas

### 1. Fuente Origen (Principal): `01_fuente_origen_encuesta_upy/`
- **Nombre de la Fuente:** Levantamiento Demoscópico Propio - Encuesta Digital Estudiantil UPY (Comunidad de Ingeniería en Datos, Ciberseguridad, Robótica y Sistemas Embebidos).
- **Tipo de Dato:** Archivo Tabular / Export de Formularios (`CSV` o `JSON`).
- **Método de Recolección:** Formulario estructurado (Google Forms / Typeform / Encuesta Propia UPY) aplicado a la comunidad universitaria.
- **Campos Clave / Esquema:**
  - `id_estudiante`: Folio anónimo.
  - `carrera`: Ingeniería de Datos, Robótica, etc.
  - `cuatrimestre`: Nivel académico cursado.
  - `adaptacion_digital_likert`: Escala 1 (Muy difícil) a 5 (Excelente adaptación).
  - `bienestar_emocional_likert`: Escala 1 (Alto estrés) a 5 (Pleno bienestar).
  - `habitos_saludables_horas_sueno`: Horas promedio de descanso.
  - `actividad_fisica_dias_semana`: Días de ejercicio semanal.
  - `colonia_residencia`: Fraccionamiento o colonia de origen en Mérida.
  - `tiempo_traslado_campus_min`: Minutos de viaje hacia el campus UPY.

### 2. Fuente Extra 1 (Apoyo): `02_fuente_extra_geoportal/`
- **Nombre de la Fuente:** GeoPortal del Ayuntamiento de Mérida (Red de Ciclovías, Rutas Va-y-Ven y Corredores hacia Ucú/UPY).
- **Tipo de Dato:** Archivo Vectorial Geoespacial (`GeoJSON` o `Shapefile`).
- **Justificación del Cruce:** Mapear las rutas físicas de desplazamiento de los estudiantes desde las distintas zonas de Mérida hacia las instalaciones de la UPY.
- **Campos Clave:** `nombre_ruta`, `longitud_km`, `tiempo_estimado_transporte`, `geometria_lineal`.

### 3. Fuente Extra 2 (Apoyo): `03_fuente_extra_datos_salud/`
- **Nombre de la Fuente:** ENSANUT / Datos.gob.mx (Encuesta Nacional de Salud y Nutrición - Parámetros de Referencia Juvenil).
- **Tipo de Dato:** Archivo Tabular (`CSV`).
- **Justificación del Cruce:** Servir como línea base comparativa para medir la resiliencia y salud física/mental de la comunidad UPY frente a la media estatal y nacional.
- **Campos Clave:** `indicador_salud`, `media_nacional_jovenes`, `media_estatal_yucatan`.
