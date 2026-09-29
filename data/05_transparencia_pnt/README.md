# 📦 Visualización 05: Transparencia (PNT) — Logística Hospitalaria e Insumos Médicos

- **Integrante Responsable:** 👤 **Daniel**
- **Vista en la Plataforma:** `Vista 5 - Módulo Transparencia (PNT)`
- **Tipo de Visualización:** Raincloud Plots Interactivos (Distribución estadística de tiempos de entrega y lotes de EPP) + Matriz de Dotación por Hospital Ancla (O'Horán, T1 IMSS, ISSSTE).

---

## 📂 Fuentes de Datos Incluidas

### 1. Fuente Origen (Principal): `01_fuente_origen_pnt/`
- **Nombre de la Fuente:** Plataforma Nacional de Transparencia (PNT / Infomex - SSY, IMSS, ISSSTE).
- **Tipo de Dato:** Archivo Tabular / Datos Abiertos de Contrataciones (`CSV` o `XLSX`).
- **Enlace de Origen:** [Plataforma Nacional de Transparencia](https://www.plataformadetransparencia.org.mx/)
- **Filtro Aplicado:** Solicitudes y contratos de adquisición y suministro de Equipo de Protección Personal (cubrebocas N95, trajes biológicos, caretas), medicamentos e insumos hospitalarios en Yucatán (2020-2023).
- **Campos Clave / Esquema:**
  - `id_contrato`: Número de folio o contrato PNT.
  - `hospital_destino`: Hospital Dr. Agustín O'Horán, Hospital General Regional T1 IMSS, etc.
  - `tipo_insumo`: EPP (Mascarillas N95, Batas quirúrgicas, Guantes de nitrilo, Medicamentos).
  - `cantidad_piezas`: Volumen suministrado.
  - `tiempo_entrega_dias`: Días transcurridos entre solicitud y entrega efectiva en almacén.
  - `monto_total_mxn`: Valor económico de la partida.
  - `proveedor`: Empresa o distribuidor adjudicado.

### 2. Fuente Extra 1 (Apoyo): `02_fuente_extra_datos_gob/`
- **Nombre de la Fuente:** Sistema de Información de la Red IRAG / Datos.gob.mx (Porcentaje de Ocupación Hospitalaria y Demanda Crítica).
- **Tipo de Dato:** Archivo Tabular / `API REST` (`CSV`).
- **Justificación del Cruce:** Evaluar si el aumento en la velocidad de surtimiento de insumos respondió eficazmente a los picos de ocupación de camas generales e intermedias.
- **Campos Clave:** `fecha`, `cve_unidad`, `porcentaje_ocupacion_camas`, `estatus_alerta`.

### 3. Fuente Extra 2 (Apoyo): `03_fuente_extra_denue/`
- **Nombre de la Fuente:** INEGI DENUE (Directorio de Infraestructura Hospitalaria y Almacenes Centrales).
- **Tipo de Dato:** Archivo Tabular / Geoespacial (`CSV` o `GeoJSON`).
- **Justificación del Cruce:** Mapear los centros de distribución logística y hospitales receptores para calcular rutas de abastecimiento prioritario.
- **Campos Clave:** `nom_estab`, `latitud`, `longitud`, `estatus_operativo`.
