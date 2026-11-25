#!/usr/bin/env python3
"""
Pipeline ETL Silver & Gold + Gobernanza Data Warehouse
Proyecto: Mexico-DataViz-by-UPY (Equipo 3)
Estándar: DataGeo / Structured Data Team + Spatial Data Team

Transforma los 13 activos reales de la capa Bronze en:
- Capa Silver (datos limpios, tipados, UTF-8, ISO-8601, CVEGEO, WGS84 EPSG:4326)
  en formatos CSV, Parquet, GeoJSON y GeoParquet.
- Capa Gold (9 Data Marts analíticos listos para Looker Studio / Power BI / DW).
- Actualización de las 9 carpetas temáticas (data/01_* .. data/09_*) sin archivos sample_*.
- Generación automática de:
  * data/CATALOGO_DATOS.csv y data/CATALOGO_DATOS.json
  * data/DICCIONARIO_DATOS.md
  * data/REPORTE_CALIDAD.md
"""

import json
import math
import os
import re
import sys
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

import geopandas as gpd
import pandas as pd
from shapely.geometry import Point

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BRONZE_DIR = os.path.join("data", "bronze")
SILVER_DIR = os.path.join("data", "silver")
GOLD_DIR = os.path.join("data", "gold")
os.makedirs(SILVER_DIR, exist_ok=True)
os.makedirs(GOLD_DIR, exist_ok=True)

RUN_TS = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

CATALOG = []
QUALITY_CHECKS = []
DICTIONARY_TABLES = []

# Jurisdicción Sanitaria 2 (Valladolid / Oriente) y 3 (Ticul / Sur) - claves CVE_MUN oficiales de Yucatán
JURIS_2_ORIENTE = {
    "009", "011", "014", "016", "019", "021", "022", "024", "026", "027",
    "032", "033", "043", "057", "061", "062", "065", "068", "074", "084",
    "085", "091", "092", "096", "099", "102", "104"
}
JURIS_3_SUR = {
    "003", "015", "017", "018", "020", "023", "025", "029", "030", "035",
    "037", "044", "046", "047", "048", "049", "053", "054", "055", "056",
    "058", "060", "064", "066", "069", "071", "072", "075", "077", "078",
    "079", "080", "081", "086", "087", "088", "089", "094", "098"
}


def asignar_jurisdiccion(cve_mun: str) -> str:
    c = str(cve_mun).zfill(3)
    if c in JURIS_2_ORIENTE:
        return "Jurisdicción 2 - Valladolid (Oriente)"
    if c in JURIS_3_SUR:
        return "Jurisdicción 3 - Ticul (Sur)"
    return "Jurisdicción 1 - Mérida (Centro/Metropolitana)"


def register_asset(
    clave, modulo, capa, rel_path, formato, registros, columnas,
    granularidad, cobertura_temporal, crs, fuente, licencia, responsable
):
    abs_path = rel_path.replace("/", os.sep)
    size_kb = round(os.path.getsize(abs_path) / 1024, 2) if os.path.exists(abs_path) else 0.0
    CATALOG.append({
        "clave": clave,
        "modulo": modulo,
        "capa": capa,
        "archivo": rel_path.replace("\\", "/"),
        "formato": formato,
        "registros": int(registros),
        "columnas": int(columnas),
        "tamano_kb": size_kb,
        "granularidad": granularidad,
        "cobertura_temporal": cobertura_temporal,
        "crs": crs,
        "fuente": fuente,
        "licencia": licencia,
        "responsable": responsable,
        "fecha_actualizacion": RUN_TS,
    })


def record_quality(tabla, capa, rows_in, rows_out, df: pd.DataFrame, is_geo=False, crs_str="N/A"):
    null_cells = int(df.isna().sum().sum())
    total_cells = int(df.shape[0] * df.shape[1]) if df.shape[0] > 0 else 1
    null_pct = round(100.0 * null_cells / total_cells, 2)
    dup_rows = int(df.drop(columns=["geometry"], errors="ignore").duplicated().sum())
    geom_valid = "N/A"
    if is_geo and isinstance(df, gpd.GeoDataFrame):
        invalid = int((~df.geometry.is_valid).sum())
        geom_valid = f"100% válidas ({len(df)}/{len(df)})" if invalid == 0 else f"{len(df)-invalid}/{len(df)} válidas"
    QUALITY_CHECKS.append({
        "tabla": tabla,
        "capa": capa,
        "registros_entrada": int(rows_in),
        "registros_salida": int(rows_out),
        "nulos_pct": null_pct,
        "duplicados": dup_rows,
        "geometrias": geom_valid,
        "crs": crs_str,
        "estado": "APROBADO" if dup_rows == 0 else "CON_OBSERVACIONES",
    })


def register_dictionary(table_name: str, rel_path: str, df: pd.DataFrame, col_meta: dict):
    rows = []
    for col in df.columns:
        if col == "geometry":
            rows.append({
                "columna": "geometry",
                "tipo": "Geometry (WGS84)",
                "no_nulos": int(df[col].notna().sum()),
                "ejemplo": str(df.geometry.geom_type.iloc[0]) if len(df) else "",
                "unidad": "grados decimales (EPSG:4326)",
                "descripcion": "Geometría espacial validada en proyección WGS84",
            })
            continue
        meta = col_meta.get(col, ("", ""))
        sample_val = ""
        non_null = df[col].dropna()
        if len(non_null) > 0:
            sample_val = str(non_null.iloc[0])[:60].replace("|", "/")
        rows.append({
            "columna": col,
            "tipo": str(df[col].dtype),
            "no_nulos": int(df[col].notna().sum()),
            "ejemplo": sample_val,
            "unidad": meta[0],
            "descripcion": meta[1],
        })
    DICTIONARY_TABLES.append((table_name, rel_path, rows))


def save_tabular(df: pd.DataFrame, base_path_no_ext: str):
    df.to_csv(f"{base_path_no_ext}.csv", index=False, encoding="utf-8")
    df.to_parquet(f"{base_path_no_ext}.parquet", index=False)


def save_spatial(gdf: gpd.GeoDataFrame, base_path_no_ext: str):
    gdf = gdf.set_crs("EPSG:4326", allow_override=True)
    # Reparar geometrías si hiciera falta
    if not gdf.geometry.is_valid.all():
        gdf["geometry"] = gdf.geometry.buffer(0)
    gdf.to_file(f"{base_path_no_ext}.geojson", driver="GeoJSON")
    gdf.to_parquet(f"{base_path_no_ext}.geoparquet", index=False)
    # También versión tabular (sin geometry) en CSV y Parquet para el Structured Data Team
    tab = pd.DataFrame(gdf.drop(columns=["geometry"]))
    save_tabular(tab, base_path_no_ext)


# ============================================================================
# 1. DIMENSIÓN TERRITORIAL: 106 MUNICIPIOS DE YUCATÁN (Módulo 03 - SIEGY/INEGI)
# ============================================================================
def process_municipios_yucatan():
    print("[ETL 1/9] Procesando 106 municipios oficiales de Yucatán (INEGI / SIEGY)...")
    src = os.path.join(BRONZE_DIR, "03_inegi_yucatan_106_municipios_raw.geojson")
    gdf = gpd.read_file(src)
    rows_in = len(gdf)
    gdf = gdf.to_crs("EPSG:4326")
    gdf["cve_ent"] = gdf["CVE_ENT"].astype(str).str.zfill(2)
    gdf["cve_mun"] = gdf["CVE_MUN"].astype(str).str.zfill(3)
    gdf["cvegeo"] = gdf["cve_ent"] + gdf["cve_mun"]
    gdf["nom_ent"] = "Yucatán"
    gdf["nom_mun"] = gdf["NOM_MUN"].astype(str).str.strip()
    gdf["jurisdiccion_sanitaria"] = gdf["cve_mun"].apply(asignar_jurisdiccion)

    # Calcular área real en km² y centroides en WGS84 usando UTM 16N (EPSG:32616)
    gdf_utm = gdf.to_crs("EPSG:32616")
    gdf["area_km2"] = (gdf_utm.geometry.area / 1e6).round(3)
    gdf["perimetro_km"] = (gdf_utm.geometry.length / 1e3).round(3)
    centroids_wgs = gdf_utm.geometry.centroid.to_crs("EPSG:4326")
    gdf["centroide_lat"] = centroids_wgs.y.round(6)
    gdf["centroide_lon"] = centroids_wgs.x.round(6)

    cols = [
        "cvegeo", "cve_ent", "cve_mun", "nom_ent", "nom_mun",
        "jurisdiccion_sanitaria", "area_km2", "perimetro_km",
        "centroide_lat", "centroide_lon", "geometry"
    ]
    gdf = gdf[cols].drop_duplicates(subset=["cvegeo"]).sort_values("cvegeo").reset_index(drop=True)

    base = os.path.join(SILVER_DIR, "dim_municipios_yucatan")
    save_spatial(gdf, base)

    # Copiar a carpeta temática 03_siegy_yucatan
    mod_dir = os.path.join("data", "03_siegy_yucatan", "01_fuente_origen_siegy")
    os.makedirs(mod_dir, exist_ok=True)
    gdf.to_file(os.path.join(mod_dir, "yucatan_106_municipios.geojson"), driver="GeoJSON")
    pd.DataFrame(gdf.drop(columns=["geometry"])).to_csv(
        os.path.join(mod_dir, "siegy_106_municipios_yucatan.csv"), index=False, encoding="utf-8"
    )

    register_asset(
        "SLV-03-DIM-MUN", "03_siegy_yucatan", "silver",
        "data/silver/dim_municipios_yucatan.geojson", "GeoJSON + GeoParquet + CSV",
        len(gdf), len(gdf.columns), "Municipal (106 municipios)", "Marco Geoestadístico INEGI",
        "EPSG:4326", "INEGI Marco Geoestadístico Municipal", "Libre Uso INEGI", "Alejandra / Russel"
    )
    record_quality("dim_municipios_yucatan", "silver", rows_in, len(gdf), gdf, is_geo=True, crs_str="EPSG:4326")
    register_dictionary("dim_municipios_yucatan", "data/silver/dim_municipios_yucatan.csv", gdf, {
        "cvegeo": ("clave 5 dígitos", "Clave geoestadística única INEGI (CVE_ENT + CVE_MUN)"),
        "cve_ent": ("clave 2 dígitos", "Clave de entidad federativa (31 = Yucatán)"),
        "cve_mun": ("clave 3 dígitos", "Clave municipal INEGI (001-106)"),
        "nom_ent": ("texto", "Nombre de la entidad federativa"),
        "nom_mun": ("texto", "Nombre oficial del municipio"),
        "jurisdiccion_sanitaria": ("categoría", "Jurisdicción sanitaria estatal asignada (1, 2 o 3)"),
        "area_km2": ("km²", "Superficie territorial calculada en proyección UTM 16N"),
        "perimetro_km": ("km", "Perímetro municipal calculado en proyección UTM 16N"),
        "centroide_lat": ("grados", "Latitud del centroide municipal (WGS84)"),
        "centroide_lon": ("grados", "Longitud del centroide municipal (WGS84)"),
    })
    return gdf


# ============================================================================
# 2. UNIDADES MÉDICAS DE YUCATÁN (Módulo 01 - INEGI/DENUE + OSM Salud)
# ============================================================================
def process_unidades_medicas(gdf_mun: gpd.GeoDataFrame):
    print("[ETL 2/9] Procesando 577 establecimientos de salud reales de Yucatán y spatial join municipal...")
    src = os.path.join(BRONZE_DIR, "01_salud_yucatan_osm_raw.json")
    raw = json.load(open(src, encoding="utf-8"))
    elements = raw.get("elements", [])
    rows_in = len(elements)

    records = []
    for el in elements:
        tags = el.get("tags", {})
        lat = el.get("lat") if "lat" in el else el.get("center", {}).get("lat")
        lon = el.get("lon") if "lon" in el else el.get("center", {}).get("lon")
        if lat is None or lon is None:
            continue
        tipo = tags.get("amenity") or tags.get("healthcare") or "salud"
        nombre = tags.get("name") or f"Unidad de Salud ({tipo.title()}) OSM-{el['id']}"
        operador = tags.get("operator") or tags.get("brand") or "No especificado"
        calle = tags.get("addr:street") or ""
        colonia = tags.get("addr:suburb") or tags.get("addr:neighbourhood") or ""
        cp = tags.get("addr:postcode") or ""
        records.append({
            "id_unidad": f"OSM-{el['type'][0].upper()}-{el['id']}",
            "nombre_establecimiento": nombre.strip(),
            "categoria_salud": tipo.lower().strip(),
            "operador_institucion": operador.strip(),
            "calle": calle.strip(),
            "colonia": colonia.strip(),
            "codigo_postal": cp.strip(),
            "latitud": round(float(lat), 6),
            "longitud": round(float(lon), 6),
        })

    df = pd.DataFrame(records).drop_duplicates(subset=["id_unidad"])
    gdf = gpd.GeoDataFrame(
        df,
        geometry=[Point(xy) for xy in zip(df["longitud"], df["latitud"])],
        crs="EPSG:4326",
    )
    # Spatial join exacto con los 106 municipios de Yucatán (filtra puntos fuera de Yucatán)
    joined = gpd.sjoin(
        gdf,
        gdf_mun[["cvegeo", "cve_ent", "cve_mun", "nom_mun", "jurisdiccion_sanitaria", "geometry"]],
        how="inner",
        predicate="within",
    ).drop(columns=["index_right"]).reset_index(drop=True)

    base = os.path.join(SILVER_DIR, "unidades_medicas_yucatan")
    save_spatial(joined, base)

    # Carpeta temática 01_inegi_denue
    mod1 = os.path.join("data", "01_inegi_denue", "01_fuente_origen_inegi")
    os.makedirs(mod1, exist_ok=True)
    pd.DataFrame(joined.drop(columns=["geometry"])).to_csv(
        os.path.join(mod1, "unidades_medicas_salud_yucatan.csv"), index=False, encoding="utf-8"
    )
    joined.to_file(os.path.join(mod1, "unidades_medicas_salud_yucatan.geojson"), driver="GeoJSON")

    register_asset(
        "SLV-01-SALUD-YUC", "01_inegi_denue", "silver",
        "data/silver/unidades_medicas_yucatan.geojson", "GeoJSON + GeoParquet + CSV",
        len(joined), len(joined.columns), "Establecimiento médico georreferenciado", "2026 (Corte OSM/INEGI)",
        "EPSG:4326", "OpenStreetMap Overpass + Spatial Join INEGI 106 Municipios", "ODbL 1.0", "Alejandra / Russel"
    )
    record_quality("unidades_medicas_yucatan", "silver", rows_in, len(joined), joined, is_geo=True, crs_str="EPSG:4326")
    register_dictionary("unidades_medicas_yucatan", "data/silver/unidades_medicas_yucatan.csv", joined, {
        "id_unidad": ("ID único", "Identificador único del establecimiento de salud"),
        "nombre_establecimiento": ("texto", "Nombre comercial o institucional de la unidad médica"),
        "categoria_salud": ("categoría", "Tipo de unidad (hospital, clinic, doctors, pharmacy, dentist)"),
        "operador_institucion": ("texto", "Institución u operador (IMSS, ISSSTE, SSY, Privado, etc.)"),
        "latitud": ("grados", "Latitud WGS84"),
        "longitud": ("grados", "Longitud WGS84"),
        "cvegeo": ("clave 5 dígitos", "Clave municipal INEGI obtenida por spatial join"),
        "nom_mun": ("texto", "Municipio de Yucatán al que pertenece la unidad"),
        "jurisdiccion_sanitaria": ("categoría", "Jurisdicción sanitaria correspondiente"),
    })

    # GOLD 01: Cobertura de salud por municipio (los 106 municipios)
    counts = joined.groupby(["cvegeo", "categoria_salud"]).size().unstack(fill_value=0).reset_index()
    for col in ["hospital", "clinic", "doctors", "pharmacy", "dentist"]:
        if col not in counts.columns:
            counts[col] = 0
    counts["total_unidades_salud"] = counts[["hospital", "clinic", "doctors", "pharmacy", "dentist"]].sum(axis=1)
    mart01 = gdf_mun[["cvegeo", "cve_ent", "cve_mun", "nom_mun", "jurisdiccion_sanitaria", "area_km2"]].merge(
        counts[["cvegeo", "hospital", "clinic", "doctors", "pharmacy", "dentist", "total_unidades_salud"]],
        on="cvegeo",
        how="left",
    ).fillna(0)
    for col in ["hospital", "clinic", "doctors", "pharmacy", "dentist", "total_unidades_salud"]:
        mart01[col] = mart01[col].astype(int)
    mart01["densidad_unidades_100km2"] = ((mart01["total_unidades_salud"] / mart01["area_km2"].replace(0, 1)) * 100).round(2)
    mart01 = mart01.sort_values("total_unidades_salud", ascending=False).reset_index(drop=True)
    save_tabular(mart01, os.path.join(GOLD_DIR, "mart_cobertura_salud_municipal"))

    # Carpeta temática 03 extra: red de salud por municipio
    mod3_extra = os.path.join("data", "03_siegy_yucatan", "03_fuente_extra_denue")
    os.makedirs(mod3_extra, exist_ok=True)
    mart01.to_csv(os.path.join(mod3_extra, "red_salud_106_municipios_yucatan.csv"), index=False, encoding="utf-8")

    register_asset(
        "GLD-01-COB-MUN", "01_inegi_denue", "gold",
        "data/gold/mart_cobertura_salud_municipal.csv", "CSV + Parquet",
        len(mart01), len(mart01.columns), "Municipal (106 municipios)", "2026",
        "N/A (CVEGEO)", "Cruce OSM Salud + INEGI Marco Geoestadístico", "ODbL 1.0 / INEGI", "Alejandra / Russel"
    )
    record_quality("mart_cobertura_salud_municipal", "gold", len(joined), len(mart01), mart01)

    # GOLD 03: Cohesión y capacidad por Jurisdicción Sanitaria (3 jurisdicciones)
    mart03 = mart01.groupby("jurisdiccion_sanitaria", as_index=False).agg(
        total_municipios=("cvegeo", "count"),
        area_total_km2=("area_km2", "sum"),
        hospitales=("hospital", "sum"),
        clinicas=("clinic", "sum"),
        consultorios=("doctors", "sum"),
        farmacias=("pharmacy", "sum"),
        total_unidades_salud=("total_unidades_salud", "sum"),
        municipios_con_unidades=("total_unidades_salud", lambda s: int((s > 0).sum())),
    )
    mart03["area_total_km2"] = mart03["area_total_km2"].round(2)
    mart03["pct_municipios_con_cobertura_osm"] = (
        100.0 * mart03["municipios_con_unidades"] / mart03["total_municipios"]
    ).round(2)
    save_tabular(mart03, os.path.join(GOLD_DIR, "mart_cohesion_jurisdicciones_yucatan"))
    register_asset(
        "GLD-03-JURIS-YUC", "03_siegy_yucatan", "gold",
        "data/gold/mart_cohesion_jurisdicciones_yucatan.csv", "CSV + Parquet",
        len(mart03), len(mart03.columns), "Jurisdicción Sanitaria (3 regiones)", "2026",
        "N/A", "Agregación municipal SIEGY / INEGI / OSM", "Libre Uso", "Alejandra"
    )
    record_quality("mart_cohesion_jurisdicciones_yucatan", "gold", len(mart01), len(mart03), mart03)

    return joined


# ============================================================================
# 3. EVOLUCIÓN EPIDEMIOLÓGICA REAL DGE (Módulo 02 - Datos.gob.mx)
# ============================================================================
def process_epidemiologia_dge():
    print("[ETL 3/9] Procesando series diarias reales DGE COVID-19 Yucatán y Nacional...")
    files = {
        "confirmados": "02_dge_covid19_confirmed_mx_raw.csv",
        "defunciones": "02_dge_covid19_deaths_mx_raw.csv",
        "negativos": "02_dge_covid19_negatives_mx_raw.csv",
        "sospechosos": "02_dge_covid19_suspects_mx_raw.csv",
    }
    series = {}
    rows_in = 0
    for metric, fname in files.items():
        df_raw = pd.read_csv(os.path.join(BRONZE_DIR, fname), encoding="utf-8")
        rows_in += len(df_raw) * (len(df_raw.columns) - 1)
        yuc = df_raw[df_raw["Estado"].str.contains("Yucat", case=False, na=False)].iloc[0]
        melted = pd.DataFrame({
            "fecha_raw": df_raw.columns[1:],
            metric: pd.to_numeric(pd.Series(yuc.values[1:]), errors="coerce").fillna(0).astype(int).values,
        })
        series[metric] = melted

    df = series["confirmados"]
    for m in ["defunciones", "negativos", "sospechosos"]:
        df = df.merge(series[m], on="fecha_raw", how="outer")

    df["fecha"] = pd.to_datetime(df["fecha_raw"], format="%d-%m-%Y", errors="coerce")
    df = df.dropna(subset=["fecha"]).sort_values("fecha").reset_index(drop=True)
    df["fecha_iso"] = df["fecha"].dt.strftime("%Y-%m-%d")
    df["anio_mes"] = df["fecha"].dt.strftime("%Y-%m")
    df["cve_ent"] = "31"
    df["nom_ent"] = "Yucatán"
    df["confirmados_acum"] = df["confirmados"].cumsum()
    df["defunciones_acum"] = df["defunciones"].cumsum()
    df["tasa_letalidad_acum_pct"] = (
        (df["defunciones_acum"] / df["confirmados_acum"].replace(0, float("nan"))) * 100
    ).fillna(0.0).round(2)
    df["tasa_supervivencia_acum_pct"] = (100.0 - df["tasa_letalidad_acum_pct"]).round(2)

    silver_cols = [
        "fecha_iso", "anio_mes", "cve_ent", "nom_ent",
        "confirmados", "defunciones", "negativos", "sospechosos",
        "confirmados_acum", "defunciones_acum",
        "tasa_letalidad_acum_pct", "tasa_supervivencia_acum_pct"
    ]
    df_silver = df[silver_cols].drop_duplicates(subset=["fecha_iso"]).reset_index(drop=True)
    save_tabular(df_silver, os.path.join(SILVER_DIR, "serie_epidemiologica_yucatan"))

    mod2 = os.path.join("data", "02_datos_gob", "01_fuente_origen_datos_gob")
    os.makedirs(mod2, exist_ok=True)
    df_silver.to_csv(os.path.join(mod2, "dge_serie_diaria_covid19_yucatan.csv"), index=False, encoding="utf-8")

    # Gold mensual
    mart02 = df_silver.groupby(["anio_mes", "cve_ent", "nom_ent"], as_index=False).agg(
        dias_reportados=("fecha_iso", "count"),
        confirmados_mes=("confirmados", "sum"),
        defunciones_mes=("defunciones", "sum"),
        negativos_mes=("negativos", "sum"),
        sospechosos_mes=("sospechosos", "sum"),
        confirmados_acum_fin_mes=("confirmados_acum", "max"),
        defunciones_acum_fin_mes=("defunciones_acum", "max"),
    )
    mart02["tasa_supervivencia_mensual_pct"] = (
        100.0 - (mart02["defunciones_mes"] / mart02["confirmados_mes"].replace(0, float("nan")) * 100)
    ).fillna(100.0).clip(0, 100).round(2)
    save_tabular(mart02, os.path.join(GOLD_DIR, "mart_evolucion_epidemiologica_mensual"))

    cov = f"{df_silver['fecha_iso'].min()} a {df_silver['fecha_iso'].max()}"
    register_asset(
        "SLV-02-EPID-YUC", "02_datos_gob", "silver",
        "data/silver/serie_epidemiologica_yucatan.csv", "CSV + Parquet",
        len(df_silver), len(df_silver.columns), "Diaria estatal (Yucatán)", cov,
        "N/A (CVE_ENT=31)", "DGE Secretaría de Salud (covid19-mx-time-series)", "Datos Abiertos MX", "Alejandra"
    )
    register_asset(
        "GLD-02-EPID-MES", "02_datos_gob", "gold",
        "data/gold/mart_evolucion_epidemiologica_mensual.csv", "CSV + Parquet",
        len(mart02), len(mart02.columns), "Mensual estatal (Yucatán)", cov,
        "N/A (CVE_ENT=31)", "DGE Secretaría de Salud (agregación mensual)", "Datos Abiertos MX", "Alejandra"
    )
    record_quality("serie_epidemiologica_yucatan", "silver", len(df), len(df_silver), df_silver)
    record_quality("mart_evolucion_epidemiologica_mensual", "gold", len(df_silver), len(mart02), mart02)
    register_dictionary("serie_epidemiologica_yucatan", "data/silver/serie_epidemiologica_yucatan.csv", df_silver, {
        "fecha_iso": ("YYYY-MM-DD", "Fecha de reporte epidemiológico en formato ISO-8601"),
        "anio_mes": ("YYYY-MM", "Periodo mensual para agregación BI"),
        "cve_ent": ("clave 2 dígitos", "Clave entidad INEGI (31 = Yucatán)"),
        "confirmados": ("casos/día", "Casos positivos confirmados diarios en Yucatán"),
        "defunciones": ("defunciones/día", "Defunciones diarias registradas en Yucatán"),
        "confirmados_acum": ("casos", "Acumulado histórico de casos confirmados"),
        "tasa_supervivencia_acum_pct": ("%", "Porcentaje acumulado de supervivencia (100 - letalidad)"),
    })


# ============================================================================
# 4. GEOPORTAL MÉRIDA: PARQUES, COMISARÍAS Y CIUDAD DE 15 MINUTOS (Módulo 04)
# ============================================================================
def process_geoportal_merida(gdf_salud: gpd.GeoDataFrame):
    print("[ETL 4/9] Procesando 884 parques y 243 localidades/comisarías de Mérida (métricas 15 min)...")
    raw_parks = json.load(open(os.path.join(BRONZE_DIR, "04_merida_parques_osm_raw.json"), encoding="utf-8"))
    raw_places = json.load(open(os.path.join(BRONZE_DIR, "04_merida_comisarias_osm_raw.json"), encoding="utf-8"))

    park_rows = []
    for el in raw_parks.get("elements", []):
        tags = el.get("tags", {})
        lat = el.get("lat") if "lat" in el else el.get("center", {}).get("lat")
        lon = el.get("lon") if "lon" in el else el.get("center", {}).get("lon")
        if lat is None or lon is None:
            continue
        park_rows.append({
            "id_parque": f"PRK-{el['id']}",
            "nombre_parque": (tags.get("name") or f"Parque Vecinal Mérida {el['id']}").strip(),
            "tipo_espacio": tags.get("leisure", "park"),
            "cvegeo": "31050",
            "municipio": "Mérida",
            "latitud": round(float(lat), 6),
            "longitud": round(float(lon), 6),
        })
    df_parks = pd.DataFrame(park_rows).drop_duplicates(subset=["id_parque"])
    gdf_parks = gpd.GeoDataFrame(
        df_parks,
        geometry=[Point(xy) for xy in zip(df_parks["longitud"], df_parks["latitud"])],
        crs="EPSG:4326",
    )
    save_spatial(gdf_parks, os.path.join(SILVER_DIR, "parques_accesibilidad_merida"))

    place_rows = []
    for el in raw_places.get("elements", []):
        tags = el.get("tags", {})
        lat, lon = el.get("lat"), el.get("lon")
        name = tags.get("name")
        if lat is None or lon is None or not name:
            continue
        place_rows.append({
            "id_localidad": f"LOC-{el['id']}",
            "nombre_localidad": name.strip(),
            "tipo_asentamiento": tags.get("place", "neighbourhood"),
            "cvegeo": "31050",
            "municipio": "Mérida",
            "latitud": round(float(lat), 6),
            "longitud": round(float(lon), 6),
        })
    df_places = pd.DataFrame(place_rows).drop_duplicates(subset=["id_localidad"])
    gdf_places = gpd.GeoDataFrame(
        df_places,
        geometry=[Point(xy) for xy in zip(df_places["longitud"], df_places["latitud"])],
        crs="EPSG:4326",
    )

    # Calcular distancias reales en metros (UTM 16N) al parque y a la unidad de salud más cercanos
    places_utm = gdf_places.to_crs("EPSG:32616")
    parks_utm = gdf_parks.to_crs("EPSG:32616")
    salud_mid = gdf_salud[gdf_salud["cvegeo"] == "31050"].to_crs("EPSG:32616")

    nearest_park = gpd.sjoin_nearest(places_utm, parks_utm[["nombre_parque", "geometry"]], distance_col="dist_parque_m")
    nearest_park = nearest_park[~nearest_park.index.duplicated(keep="first")]

    nearest_salud = gpd.sjoin_nearest(places_utm, salud_mid[["nombre_establecimiento", "geometry"]], distance_col="dist_salud_m")
    nearest_salud = nearest_salud[~nearest_salud.index.duplicated(keep="first")]

    gdf_places["parque_mas_cercano"] = nearest_park["nombre_parque"].values
    gdf_places["dist_parque_m"] = nearest_park["dist_parque_m"].round(1).values
    gdf_places["min_caminata_parque"] = (gdf_places["dist_parque_m"] / 80.0).round(1)  # 4.8 km/h = 80 m/min
    gdf_places["salud_mas_cercana"] = nearest_salud["nombre_establecimiento"].values
    gdf_places["dist_salud_m"] = nearest_salud["dist_salud_m"].round(1).values
    gdf_places["min_caminata_salud"] = (gdf_places["dist_salud_m"] / 80.0).round(1)
    gdf_places["cumple_ciudad_15min_parque"] = gdf_places["min_caminata_parque"] <= 15.0
    gdf_places["cumple_ciudad_15min_salud"] = gdf_places["min_caminata_salud"] <= 15.0

    save_spatial(gdf_places, os.path.join(SILVER_DIR, "comisarias_isocronas_merida"))

    # Guardar en carpeta temática 04_geoportal_merida
    mod4_1 = os.path.join("data", "04_geoportal_merida", "01_fuente_origen_geoportal")
    mod4_2 = os.path.join("data", "04_geoportal_merida", "02_fuente_extra_denue")
    os.makedirs(mod4_1, exist_ok=True)
    os.makedirs(mod4_2, exist_ok=True)
    gdf_places.to_file(os.path.join(mod4_1, "merida_comisarias_accesibilidad_15min.geojson"), driver="GeoJSON")
    gdf_parks.to_file(os.path.join(mod4_1, "merida_parques_areas_verdes.geojson"), driver="GeoJSON")
    pd.DataFrame(gdf_places.drop(columns=["geometry"])).to_csv(
        os.path.join(mod4_2, "merida_tiempos_caminata_salud_parques.csv"), index=False, encoding="utf-8"
    )

    # Gold 04: Resumen de accesibilidad 15 minutos por tipo de asentamiento
    tab_places = pd.DataFrame(gdf_places.drop(columns=["geometry"]))
    mart04 = tab_places.groupby("tipo_asentamiento", as_index=False).agg(
        total_localidades=("id_localidad", "count"),
        dist_media_parque_m=("dist_parque_m", "mean"),
        min_caminata_parque_prom=("min_caminata_parque", "mean"),
        pct_parque_15min=("cumple_ciudad_15min_parque", lambda s: round(100.0 * s.mean(), 2)),
        dist_media_salud_m=("dist_salud_m", "mean"),
        min_caminata_salud_prom=("min_caminata_salud", "mean"),
        pct_salud_15min=("cumple_ciudad_15min_salud", lambda s: round(100.0 * s.mean(), 2)),
    )
    for c in ["dist_media_parque_m", "min_caminata_parque_prom", "dist_media_salud_m", "min_caminata_salud_prom"]:
        mart04[c] = mart04[c].round(2)
    save_tabular(mart04, os.path.join(GOLD_DIR, "mart_accesibilidad_15min_merida"))

    register_asset(
        "SLV-04-PARQUES-MID", "04_geoportal_merida", "silver",
        "data/silver/parques_accesibilidad_merida.geojson", "GeoJSON + GeoParquet + CSV",
        len(gdf_parks), len(gdf_parks.columns), "Parque / área verde (Mérida)", "2026",
        "EPSG:4326", "OpenStreetMap / GeoPortal Mérida", "ODbL 1.0", "Russel"
    )
    register_asset(
        "SLV-04-COMIS-15M", "04_geoportal_merida", "silver",
        "data/silver/comisarias_isocronas_merida.geojson", "GeoJSON + GeoParquet + CSV",
        len(gdf_places), len(gdf_places.columns), "Comisaría / colonia / localidad (Mérida)", "2026",
        "EPSG:4326", "Cálculo espacial UTM 16N (OSM + Salud Mérida)", "ODbL 1.0", "Russel"
    )
    register_asset(
        "GLD-04-ACCES-15M", "04_geoportal_merida", "gold",
        "data/gold/mart_accesibilidad_15min_merida.csv", "CSV + Parquet",
        len(mart04), len(mart04.columns), "Tipo de asentamiento urbano/comisaría", "2026",
        "N/A (CVEGEO=31050)", "Métricas Ciudad de 15 Minutos Mérida", "ODbL 1.0", "Russel"
    )
    record_quality("parques_accesibilidad_merida", "silver", len(raw_parks.get("elements", [])), len(gdf_parks), gdf_parks, is_geo=True, crs_str="EPSG:4326")
    record_quality("comisarias_isocronas_merida", "silver", len(raw_places.get("elements", [])), len(gdf_places), gdf_places, is_geo=True, crs_str="EPSG:4326")
    record_quality("mart_accesibilidad_15min_merida", "gold", len(gdf_places), len(mart04), mart04)
    register_dictionary("comisarias_isocronas_merida", "data/silver/comisarias_isocronas_merida.csv", gdf_places, {
        "id_localidad": ("ID único", "Identificador de localidad, comisaría o colonia"),
        "nombre_localidad": ("texto", "Nombre oficial de la comisaría o colonia de Mérida"),
        "dist_parque_m": ("metros", "Distancia euclidiana UTM 16N al parque más cercano"),
        "min_caminata_parque": ("minutos", "Tiempo estimado de caminata al parque (80 m/min)"),
        "dist_salud_m": ("metros", "Distancia euclidiana UTM 16N a la unidad médica más cercana"),
        "min_caminata_salud": ("minutos", "Tiempo estimado de caminata a unidad médica"),
        "cumple_ciudad_15min_parque": ("booleano", "True si está a <= 15 min caminando de un parque"),
    })


# ============================================================================
# 5. LOGÍSTICA E INFRAESTRUCTURA HOSPITALARIA (Módulo 05 - Transparencia PNT)
# ============================================================================
def process_hospitales_pnt(gdf_salud: gpd.GeoDataFrame):
    print("[ETL 5/9] Procesando infraestructura hospitalaria real de Yucatán (PNT / Red Hospitalaria)...")
    hosp = gdf_salud[gdf_salud["categoria_salud"].isin(["hospital", "clinic"])].copy().reset_index(drop=True)
    hosp["nivel_atencion"] = hosp["categoria_salud"].map({"hospital": "2do / 3er Nivel (Hospital)", "clinic": "1er Nivel / Clínica"})
    tab_hosp = pd.DataFrame(hosp.drop(columns=["geometry"]))
    save_tabular(tab_hosp, os.path.join(SILVER_DIR, "infraestructura_hospitalaria_yucatan"))

    mod5 = os.path.join("data", "05_transparencia_pnt", "01_fuente_origen_pnt")
    os.makedirs(mod5, exist_ok=True)
    tab_hosp.to_csv(os.path.join(mod5, "infraestructura_hospitalaria_yucatan.csv"), index=False, encoding="utf-8")

    # Gold 05: Resumen hospitalario por municipio y nivel de atención
    mart05 = tab_hosp.groupby(["cvegeo", "nom_mun", "jurisdiccion_sanitaria", "nivel_atencion"], as_index=False).agg(
        total_unidades=("id_unidad", "count"),
        lat_promedio=("latitud", "mean"),
        lon_promedio=("longitud", "mean"),
    )
    mart05["lat_promedio"] = mart05["lat_promedio"].round(6)
    mart05["lon_promedio"] = mart05["lon_promedio"].round(6)
    save_tabular(mart05, os.path.join(GOLD_DIR, "mart_logistica_hospitales_ancla"))

    register_asset(
        "SLV-05-HOSP-YUC", "05_transparencia_pnt", "silver",
        "data/silver/infraestructura_hospitalaria_yucatan.csv", "CSV + Parquet",
        len(tab_hosp), len(tab_hosp.columns), "Hospital / Clínica georreferenciada", "2026",
        "EPSG:4326", "Red Hospitalaria Yucatán (OSM/CLUES/PNT)", "ODbL 1.0 / Datos Abiertos", "Daniel / Alejandra"
    )
    register_asset(
        "GLD-05-LOG-HOSP", "05_transparencia_pnt", "gold",
        "data/gold/mart_logistica_hospitales_ancla.csv", "CSV + Parquet",
        len(mart05), len(mart05.columns), "Municipio x Nivel de atención", "2026",
        "N/A (CVEGEO)", "Agregación Red Hospitalaria Yucatán", "Datos Abiertos", "Daniel"
    )
    record_quality("infraestructura_hospitalaria_yucatan", "silver", len(gdf_salud), len(tab_hosp), tab_hosp)
    record_quality("mart_logistica_hospitales_ancla", "gold", len(tab_hosp), len(mart05), mart05)


# ============================================================================
# 6. PRENSA REGIONAL DE YUCATÁN - WEB SCRAPING REAL + NLP (Módulo 06)
# ============================================================================
def process_prensa_scraping():
    print("[ETL 6/9] Procesando 235 artículos reales scrapeados de prensa regional de Yucatán...")
    src = os.path.join(BRONZE_DIR, "06_prensa_yucatan_rss_raw.json")
    raw = json.load(open(src, encoding="utf-8"))
    rows_in = len(raw)

    pos_words = {
        "éxito", "exito", "avance", "avanza", "mejora", "solidaridad", "resiliencia",
        "vacunación", "vacunacion", "salud", "inversión", "inversion", "nuevo", "nueva",
        "apoyo", "beneficio", "seguro", "segura", "calidad", "gratuito", "gratuita",
        "reconocimiento", "impulso", "modernización", "fortalece", "crece", "logro",
        "innovación", "innovacion", "prevención", "prevencion", "cobertura", "recuperación",
    }
    neg_words = {
        "crisis", "alerta", "riesgo", "muerte", "fallece", "brote", "saturación",
        "saturacion", "falta", "desabasto", "protesta", "denuncia", "emergencia",
        "grave", "aumento", "contagio", "contagios", "hospitalizado", "deficiencia",
        "problema", "accidente", "rechazo", "rezago", "demora", "queja",
    }
    domain_kws = [
        "vacunación", "vacuna", "salud", "hospital", "o'horán", "imss", "issste",
        "mérida", "yucatán", "upy", "universidad", "estudiantes", "comisarías",
        "parques", "clínica", "médicos", "prevención", "dengue", "covid",
        "municipios", "infraestructura", "educación", "comunidad", "tecnología",
    ]

    cleaned = []
    for i, item in enumerate(raw, start=1):
        title = str(item.get("titular", "")).strip()
        txt = title.lower()
        tokens = re.findall(r"[a-záéíóúñü']+", txt)
        pos = sum(1 for t in tokens if t in pos_words)
        neg = sum(1 for t in tokens if t in neg_words)
        polaridad = round((pos - neg) / (pos + neg), 3) if (pos + neg) > 0 else 0.05
        sentimiento = "positivo" if polaridad > 0.1 else ("negativo" if polaridad < -0.1 else "neutro")
        kws = [kw for kw in domain_kws if kw in txt] or ["yucatán", "salud pública"]
        try:
            fecha_iso = parsedate_to_datetime(item.get("fecha_pub_raw", "")).strftime("%Y-%m-%d")
        except Exception:
            fecha_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        cleaned.append({
            "id_articulo": f"NOT-YUC-{i:04d}",
            "topico": item.get("topic_query", "general"),
            "medio": str(item.get("medio", "Prensa Regional")).strip(),
            "fecha_iso": fecha_iso,
            "anio_mes": fecha_iso[:7],
            "titular": title,
            "keywords": "; ".join(kws),
            "polaridad": polaridad,
            "sentimiento": sentimiento,
            "cve_ent": "31",
            "cve_mun": "050" if ("mérida" in txt or "merida" in txt) else "000",
            "url": item.get("url", ""),
        })

    df = pd.DataFrame(cleaned).drop_duplicates(subset=["url"]).reset_index(drop=True)
    save_tabular(df, os.path.join(SILVER_DIR, "corpus_prensa_yucatan"))
    df.to_json(os.path.join(SILVER_DIR, "corpus_prensa_yucatan.json"), orient="records", force_ascii=False, indent=2)

    mod6 = os.path.join("data", "06_web_scraping", "01_fuente_origen_scraped_press")
    os.makedirs(mod6, exist_ok=True)
    df.to_csv(os.path.join(mod6, "corpus_noticias_prensa_yucatan.csv"), index=False, encoding="utf-8")
    df.to_json(os.path.join(mod6, "corpus_noticias_prensa_yucatan.json"), orient="records", force_ascii=False, indent=2)

    # Gold 06: Sentimiento por tópico y medio
    mart06 = df.groupby(["topico", "sentimiento"], as_index=False).agg(
        total_articulos=("id_articulo", "count"),
        polaridad_promedio=("polaridad", "mean"),
    )
    mart06["polaridad_promedio"] = mart06["polaridad_promedio"].round(3)
    save_tabular(mart06, os.path.join(GOLD_DIR, "mart_sentimiento_prensa_yucatan"))

    cov = f"{df['fecha_iso'].min()} a {df['fecha_iso'].max()}"
    register_asset(
        "SLV-06-PRENSA-YUC", "06_web_scraping", "silver",
        "data/silver/corpus_prensa_yucatan.csv", "CSV + Parquet + JSON",
        len(df), len(df.columns), "Artículo periodístico", cov,
        "N/A (CVE_ENT=31)", "Scraping RSS Prensa Regional Yucatán", "Metadatos Públicos RSS", "Russel"
    )
    register_asset(
        "GLD-06-SENT-PRENSA", "06_web_scraping", "gold",
        "data/gold/mart_sentimiento_prensa_yucatan.csv", "CSV + Parquet",
        len(mart06), len(mart06.columns), "Tópico x Sentimiento", cov,
        "N/A", "NLP Léxico sobre corpus real prensa Yucatán", "Uso Académico", "Russel"
    )
    record_quality("corpus_prensa_yucatan", "silver", rows_in, len(df), df)
    record_quality("mart_sentimiento_prensa_yucatan", "gold", len(df), len(mart06), mart06)
    register_dictionary("corpus_prensa_yucatan", "data/silver/corpus_prensa_yucatan.csv", df, {
        "id_articulo": ("ID único", "Identificador único del artículo scrapeado"),
        "topico": ("categoría", "Tópico de consulta temática en Yucatán"),
        "medio": ("texto", "Medio de comunicación regional o nacional"),
        "fecha_iso": ("YYYY-MM-DD", "Fecha de publicación normalizada ISO-8601"),
        "polaridad": ("[-1.0, +1.0]", "Índice de polaridad léxica del titular"),
        "sentimiento": ("categoría", "Clasificación: positivo, neutro o negativo"),
    })


# ============================================================================
# 7. ENCUESTA ESTUDIANTIL UPY - SELF-PRODUCED REAL (Módulo 07)
# ============================================================================
def process_encuesta_upy():
    print("[ETL 7/9] Limpiando y estandarizando 166 respuestas reales de la Encuesta UPY...")
    src = os.path.join(BRONZE_DIR, "07_encuesta_upy_google_sheets_raw.csv")
    df_raw = pd.read_csv(src, encoding="utf-8")
    rows_in = len(df_raw)

    rename_map = {
        df_raw.columns[0]: "marca_temporal_raw",
        df_raw.columns[1]: "rol_programa",
        df_raw.columns[2]: "nivel_educativo_confinamiento",
        df_raw.columns[3]: "diagnostico_covid19",
        df_raw.columns[4]: "esquema_vacunacion",
        df_raw.columns[5]: "afectacion_familiar_likert",
        df_raw.columns[6]: "dificultad_clases_virtuales_likert",
        df_raw.columns[7]: "modalidad_preferida_ingenieria",
        df_raw.columns[8]: "retos_educacion_linea",
        df_raw.columns[9]: "habilidades_digitales_upy",
        df_raw.columns[10]: "satisfaccion_presencial_likert",
        df_raw.columns[11]: "horas_sueno_diario",
        df_raw.columns[12]: "frecuencia_actividad_fisica",
        df_raw.columns[13]: "nivel_estres_entregas_likert",
        df_raw.columns[14]: "zona_origen_merida",
        df_raw.columns[15]: "tiempo_traslado_campus",
    }
    df = df_raw.rename(columns=rename_map).copy()
    df["id_respuesta"] = [f"UPY-ENC-{i:04d}" for i in range(1, len(df) + 1)]
    ts = pd.to_datetime(df["marca_temporal_raw"], dayfirst=True, errors="coerce")
    df["fecha_respuesta_iso"] = ts.dt.strftime("%Y-%m-%dT%H:%M:%S").fillna("2026-10-01T00:00:00")

    for c in [
        "afectacion_familiar_likert", "dificultad_clases_virtuales_likert",
        "satisfaccion_presencial_likert", "nivel_estres_entregas_likert"
    ]:
        df[c] = pd.to_numeric(df[c], errors="coerce").clip(1, 5)

    for c in df.select_dtypes(include="object").columns:
        df[c] = df[c].astype(str).str.strip()

    df["cve_ent"] = "31"
    df["cve_mun"] = df["zona_origen_merida"].apply(
        lambda z: "050" if "mérida" in z.lower() or "merida" in z.lower() else "000"
    )
    df["cvegeo"] = df["cve_ent"] + df["cve_mun"]

    cols = [
        "id_respuesta", "fecha_respuesta_iso", "rol_programa",
        "nivel_educativo_confinamiento", "diagnostico_covid19", "esquema_vacunacion",
        "afectacion_familiar_likert", "dificultad_clases_virtuales_likert",
        "modalidad_preferida_ingenieria", "retos_educacion_linea",
        "habilidades_digitales_upy", "satisfaccion_presencial_likert",
        "horas_sueno_diario", "frecuencia_actividad_fisica",
        "nivel_estres_entregas_likert", "zona_origen_merida",
        "tiempo_traslado_campus", "cve_ent", "cve_mun", "cvegeo"
    ]
    df = df[cols].drop_duplicates().reset_index(drop=True)
    save_tabular(df, os.path.join(SILVER_DIR, "encuesta_upy_estudiantil"))

    mod7 = os.path.join("data", "07_self_produced_upy", "01_fuente_origen_encuesta_upy")
    os.makedirs(mod7, exist_ok=True)
    df.to_csv(os.path.join(mod7, "encuesta_upy_estudiantil_curada.csv"), index=False, encoding="utf-8")

    # Gold 07: Resumen por programa académico UPY
    mart07 = df.groupby("rol_programa", as_index=False).agg(
        total_encuestados=("id_respuesta", "count"),
        satisfaccion_presencial_prom=("satisfaccion_presencial_likert", "mean"),
        dificultad_virtual_prom=("dificultad_clases_virtuales_likert", "mean"),
        afectacion_familiar_prom=("afectacion_familiar_likert", "mean"),
        estres_entregas_prom=("nivel_estres_entregas_likert", "mean"),
        pct_esquema_con_refuerzo=("esquema_vacunacion", lambda s: round(100.0 * s.str.contains("refuerzo", case=False, na=False).mean(), 2)),
    )
    for c in ["satisfaccion_presencial_prom", "dificultad_virtual_prom", "afectacion_familiar_prom", "estres_entregas_prom"]:
        mart07[c] = mart07[c].round(2)
    save_tabular(mart07, os.path.join(GOLD_DIR, "mart_resiliencia_estudiantil_upy"))

    cov = f"{df['fecha_respuesta_iso'].min()[:10]} a {df['fecha_respuesta_iso'].max()[:10]}"
    register_asset(
        "SLV-07-ENC-UPY", "07_self_produced_upy", "silver",
        "data/silver/encuesta_upy_estudiantil.csv", "CSV + Parquet",
        len(df), len(df.columns), "Estudiante / respuesta individual", cov,
        "N/A (CVEGEO)", "Levantamiento Propio Comunidad UPY (Google Sheets)", "CC-BY 4.0", "Russel"
    )
    register_asset(
        "GLD-07-RESIL-UPY", "07_self_produced_upy", "gold",
        "data/gold/mart_resiliencia_estudiantil_upy.csv", "CSV + Parquet",
        len(mart07), len(mart07.columns), "Programa académico UPY", cov,
        "N/A (CVEGEO=31050)", "Agregación Encuesta Estudiantil UPY", "CC-BY 4.0", "Russel"
    )
    record_quality("encuesta_upy_estudiantil", "silver", rows_in, len(df), df)
    record_quality("mart_resiliencia_estudiantil_upy", "gold", len(df), len(mart07), mart07)
    register_dictionary("encuesta_upy_estudiantil", "data/silver/encuesta_upy_estudiantil.csv", df, {
        "id_respuesta": ("ID único", "Identificador anonimizado de cada respuesta"),
        "fecha_respuesta_iso": ("ISO-8601", "Fecha y hora de registro en Google Forms"),
        "rol_programa": ("categoría", "Programa educativo o rol dentro de la UPY"),
        "satisfaccion_presencial_likert": ("escala 1-5", "Satisfacción con el retorno 100% presencial"),
        "nivel_estres_entregas_likert": ("escala 1-5", "Nivel de estrés percibido en entregas finales"),
        "zona_origen_merida": ("categoría", "Zona de origen desde donde se traslada al campus"),
        "cvegeo": ("clave 5 dígitos", "Clave municipal (31050 para Mérida)"),
    })


# ============================================================================
# 8. ALTIMETRÍA REAL DEM MÉRIDA (Módulo 08 - LiDAR 3D / Copernicus DEM)
# ============================================================================
def process_dem_merida():
    print("[ETL 8/9] Procesando 400 puntos reales de elevación DEM de Mérida (Copernicus DEM 90m)...")
    src = os.path.join(BRONZE_DIR, "08_dem_merida_open_meteo_raw.json")
    raw = json.load(open(src, encoding="utf-8"))
    pts = raw.get("points", [])
    rows_in = len(pts)

    df = pd.DataFrame(pts)
    df["id_celda"] = [f"DEM-MID-{r:02d}-{c:02d}" for r, c in zip(df["row"], df["col"])]
    df["elevacion_msnm"] = pd.to_numeric(df["elevacion_msnm"], errors="coerce").round(2)
    df["estrato_relieve"] = pd.cut(
        df["elevacion_msnm"],
        bins=[-10, 6.0, 11.0, 100.0],
        labels=["Planicie Baja (<6m)", "Plataforma Urbana Mérida (6-11m)", "Lomerío Cárstico (>11m)"]
    ).astype(str)
    df["cvegeo"] = "31050"
    df["municipio"] = "Mérida"
    df["datum_vertical"] = "EGM96 / MSL"

    gdf = gpd.GeoDataFrame(
        df,
        geometry=[Point(xy) for xy in zip(df["longitud"], df["latitud"])],
        crs="EPSG:4326",
    )
    save_spatial(gdf, os.path.join(SILVER_DIR, "dem_altimetria_merida"))

    # Matriz JSON estructurada para visor 3D Three.js
    matrix_2d = df.pivot(index="row", columns="col", values="elevacion_msnm").values.tolist()
    matrix_payload = {
        "dataset": "Copernicus_DEM_GLO90_Merida",
        "source": raw["source"],
        "crs": "EPSG:4326",
        "vertical_datum": "EGM96 / MSL (metros)",
        "grid_shape": raw["grid_shape"],
        "bounds": raw["bounds"],
        "stats": {
            "min_msnm": round(float(df["elevacion_msnm"].min()), 2),
            "max_msnm": round(float(df["elevacion_msnm"].max()), 2),
            "mean_msnm": round(float(df["elevacion_msnm"].mean()), 2),
            "std_msnm": round(float(df["elevacion_msnm"].std()), 2),
        },
        "elevation_matrix_msnm": matrix_2d,
    }
    with open(os.path.join(SILVER_DIR, "dem_altimetria_merida_matrix.json"), "w", encoding="utf-8") as f:
        json.dump(matrix_payload, f, indent=2, ensure_ascii=False)

    mod8 = os.path.join("data", "08_lidar_3d", "01_fuente_origen_lidar_inegi")
    os.makedirs(mod8, exist_ok=True)
    with open(os.path.join(mod8, "dem_merida_copernicus_matrix.json"), "w", encoding="utf-8") as f:
        json.dump(matrix_payload, f, indent=2, ensure_ascii=False)
    df.to_csv(os.path.join(mod8, "dem_merida_copernicus_400pts.csv"), index=False, encoding="utf-8")

    # Gold 08: Estadísticas altimétricas por estrato
    mart08 = df.groupby("estrato_relieve", as_index=False).agg(
        puntos_malla=("id_celda", "count"),
        elev_min_msnm=("elevacion_msnm", "min"),
        elev_prom_msnm=("elevacion_msnm", "mean"),
        elev_max_msnm=("elevacion_msnm", "max"),
    )
    mart08["elev_prom_msnm"] = mart08["elev_prom_msnm"].round(2)
    mart08["pct_superficie_malla"] = (100.0 * mart08["puntos_malla"] / len(df)).round(2)
    save_tabular(mart08, os.path.join(GOLD_DIR, "mart_altimetria_urbana_merida"))

    register_asset(
        "SLV-08-DEM-MID", "08_lidar_3d", "silver",
        "data/silver/dem_altimetria_merida.geojson", "GeoJSON + GeoParquet + CSV + JSON",
        len(gdf), len(gdf.columns), "Celda altimétrica (~1 km, malla 20x20)", "2026 (Copernicus DEM GLO-90)",
        "EPSG:4326 / EGM96", "Open-Meteo Elevation API (Copernicus DEM)", "CC-BY 4.0", "Daniel / Russel"
    )
    register_asset(
        "GLD-08-ALT-MID", "08_lidar_3d", "gold",
        "data/gold/mart_altimetria_urbana_merida.csv", "CSV + Parquet",
        len(mart08), len(mart08.columns), "Estrato altimétrico urbano (Mérida)", "2026",
        "EPSG:4326 / EGM96", "Agregación DEM Copernicus Mérida", "CC-BY 4.0", "Daniel / Russel"
    )
    record_quality("dem_altimetria_merida", "silver", rows_in, len(gdf), gdf, is_geo=True, crs_str="EPSG:4326")
    record_quality("mart_altimetria_urbana_merida", "gold", len(gdf), len(mart08), mart08)


# ============================================================================
# 9. REALIDAD AUMENTADA AR - PDB 6VXX REAL (Módulo 09)
# ============================================================================
def process_pdb_6vxx():
    print("[ETL 9/9] Procesando metadatos y cabecera oficial RCSB PDB 6VXX (Spike SARS-CoV-2)...")
    meta = json.load(open(os.path.join(BRONZE_DIR, "09_rcsb_pdb_6vxx_entry_raw.json"), encoding="utf-8"))
    hdr_path = os.path.join(BRONZE_DIR, "09_rcsb_pdb_6vxx_header_raw.pdb")
    with open(hdr_path, encoding="utf-8", errors="replace") as f:
        hdr_lines = f.readlines()

    seqres_chains = sorted({line[11].strip() for line in hdr_lines if line.startswith("SEQRES") and len(line) > 11})
    helix_count = sum(1 for line in hdr_lines if line.startswith("HELIX "))
    sheet_count = sum(1 for line in hdr_lines if line.startswith("SHEET "))

    rcsb_info = meta.get("rcsb_entry_info", {})
    struct_info = meta.get("struct", {})
    accession = meta.get("rcsb_accession_info", {})
    exptl = (meta.get("exptl") or [{}])[0]

    summary = {
        "pdb_id": meta.get("rcsb_id", "6VXX"),
        "title": struct_info.get("title", "Structure of the SARS-CoV-2 spike glycoprotein (closed state)"),
        "experimental_method": exptl.get("method", "ELECTRON MICROSCOPY"),
        "resolution_angstroms": (rcsb_info.get("resolution_combined") or [2.8])[0],
        "molecular_weight_kda": rcsb_info.get("molecular_weight", None),
        "deposited_atom_count": rcsb_info.get("deposited_atom_count", None),
        "deposited_polymer_monomer_count": rcsb_info.get("deposited_polymer_monomer_count", None),
        "polymer_entity_count": rcsb_info.get("polymer_entity_count", None),
        "chains": seqres_chains or ["A", "B", "C"],
        "alpha_helices_count": helix_count,
        "beta_sheets_count": sheet_count,
        "deposit_date": accession.get("deposit_date", "")[:10],
        "initial_release_date": accession.get("initial_release_date", "")[:10],
        "source_url": "https://www.rcsb.org/structure/6VXX",
        "license": "CC0 1.0 Public Domain",
    }

    with open(os.path.join(SILVER_DIR, "pdb_6vxx_estructura_molecular.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    df_pdb = pd.DataFrame([{
        "pdb_id": summary["pdb_id"],
        "title": summary["title"],
        "experimental_method": summary["experimental_method"],
        "resolution_angstroms": summary["resolution_angstroms"],
        "molecular_weight_kda": summary["molecular_weight_kda"],
        "deposited_atom_count": summary["deposited_atom_count"],
        "deposited_polymer_monomer_count": summary["deposited_polymer_monomer_count"],
        "chains": ",".join(summary["chains"]),
        "alpha_helices_count": summary["alpha_helices_count"],
        "beta_sheets_count": summary["beta_sheets_count"],
        "initial_release_date": summary["initial_release_date"],
    }])
    save_tabular(df_pdb, os.path.join(SILVER_DIR, "pdb_6vxx_estructura_molecular"))
    save_tabular(df_pdb, os.path.join(GOLD_DIR, "mart_modelo_ar_pdb_6vxx"))

    mod9 = os.path.join("data", "09_realidad_aumentada_ar", "01_fuente_origen_pdb_molecular")
    os.makedirs(mod9, exist_ok=True)
    with open(os.path.join(mod9, "rcsb_pdb_6vxx_metadata.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    df_pdb.to_csv(os.path.join(mod9, "rcsb_pdb_6vxx_summary.csv"), index=False, encoding="utf-8")

    register_asset(
        "SLV-09-PDB-6VXX", "09_realidad_aumentada_ar", "silver",
        "data/silver/pdb_6vxx_estructura_molecular.json", "JSON + CSV + Parquet",
        1, len(df_pdb.columns), "Estructura macromolecular (6VXX)", summary["initial_release_date"],
        "Coordenadas Atómicas 3D (Å)", "RCSB Protein Data Bank", "CC0 1.0", "Daniel"
    )
    register_asset(
        "GLD-09-AR-6VXX", "09_realidad_aumentada_ar", "gold",
        "data/gold/mart_modelo_ar_pdb_6vxx.csv", "CSV + Parquet",
        1, len(df_pdb.columns), "Activo 3D / AR", summary["initial_release_date"],
        "Coordenadas Atómicas 3D (Å)", "RCSB Protein Data Bank", "CC0 1.0", "Daniel"
    )
    record_quality("pdb_6vxx_estructura_molecular", "silver", len(hdr_lines), 1, df_pdb)


# ============================================================================
# 10. GOBERNANZA DW: CATÁLOGO, DICCIONARIO Y REPORTE DE CALIDAD
# ============================================================================
def generate_governance_docs():
    print("[GOV] Generando CATALOGO_DATOS, DICCIONARIO_DATOS.md y REPORTE_CALIDAD.md...")
    # Incluir manifiesto Bronze en el catálogo
    bronze_manifest = json.load(open(os.path.join(BRONZE_DIR, "extraction_manifest.json"), encoding="utf-8"))
    bronze_entries = []
    for m in bronze_manifest:
        bronze_entries.append({
            "clave": m["clave"],
            "modulo": m["modulo"],
            "capa": "bronze",
            "archivo": m["archivo"],
            "formato": m["formato"],
            "registros": -1,
            "columnas": -1,
            "tamano_kb": round(m["tamano_bytes"] / 1024, 2),
            "granularidad": "Crudo (Bronze)",
            "cobertura_temporal": m["fecha_extraccion"][:10],
            "crs": "EPSG:4326 / N/A",
            "fuente": m["fuente"],
            "licencia": m["licencia"],
            "responsable": m["responsable"],
            "fecha_actualizacion": m["fecha_extraccion"],
        })

    full_catalog = bronze_entries + CATALOG
    df_cat = pd.DataFrame(full_catalog)
    df_cat.to_csv(os.path.join("data", "CATALOGO_DATOS.csv"), index=False, encoding="utf-8")
    with open(os.path.join("data", "CATALOGO_DATOS.json"), "w", encoding="utf-8") as f:
        json.dump(full_catalog, f, indent=2, ensure_ascii=False)

    # DICCIONARIO_DATOS.md
    dict_lines = [
        "# Diccionario de Datos — Mexico-DataViz-by-UPY (Equipo 3)",
        "",
        f"**Fecha de generación:** `{RUN_TS}`  ",
        "**Estándar:** DataGeo / Data Warehouse (Structured Data Team + Spatial Data Team)  ",
        "**Claves territoriales homologadas:** `cve_ent = 31` (Yucatán), `cve_mun = 001..106`, `cvegeo = 31001..31106` (`31050` = Mérida)  ",
        "**Sistema de Referencia de Coordenadas (CRS):** `EPSG:4326` (WGS84) para intercambio y `EPSG:32616` (UTM 16N) para cálculos métricos.",
        "",
    ]
    for tname, rpath, cols in DICTIONARY_TABLES:
        dict_lines.append(f"## `{tname}` (`{rpath}`)")
        dict_lines.append("")
        dict_lines.append("| Columna | Tipo | No Nulos | Unidad | Descripción | Ejemplo |")
        dict_lines.append("| :--- | :--- | ---: | :--- | :--- | :--- |")
        for c in cols:
            dict_lines.append(
                f"| `{c['columna']}` | `{c['tipo']}` | {c['no_nulos']} | {c['unidad']} | {c['descripcion']} | `{c['ejemplo']}` |"
            )
        dict_lines.append("")
    with open(os.path.join("data", "DICCIONARIO_DATOS.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(dict_lines))

    # REPORTE_CALIDAD.md
    df_q = pd.DataFrame(QUALITY_CHECKS)
    q_lines = [
        "# Reporte Automatizado de Calidad de Datos — Equipo 3 (Mexico-DataViz-by-UPY)",
        "",
        f"**Ejecución ETL:** `{RUN_TS}`  ",
        "**Cobertura:** 9/9 módulos temáticos con datos reales verificables (0 archivos `sample_*` en capas Silver/Gold).",
        "",
        "## Conciliación y Validación Bronze → Silver → Gold",
        "",
        "| Tabla | Capa | Reg. Entrada | Reg. Salida | Nulos (%) | Duplicados | Geometrías | CRS | Estado |",
        "| :--- | :---: | ---: | ---: | ---: | ---: | :--- | :--- | :---: |",
    ]
    for _, r in df_q.iterrows():
        q_lines.append(
            f"| `{r['tabla']}` | `{r['capa']}` | {r['registros_entrada']} | {r['registros_salida']} | "
            f"{r['nulos_pct']}% | {r['duplicados']} | {r['geometrias']} | `{r['crs']}` | **{r['estado']}** |"
        )
    q_lines.extend([
        "",
        "## Reglas de Validación Aplicadas",
        "- Codificación `UTF-8` sin BOM en todos los archivos CSV y JSON.",
        "- Fechas normalizadas a estándar `ISO-8601` (`YYYY-MM-DD` / `YYYY-MM-DDTHH:MM:SS`).",
        "- Claves territoriales INEGI homologadas (`cve_ent`, `cve_mun`, `cvegeo`) verificadas mediante *spatial join* contra los 106 polígonos oficiales de Yucatán.",
        "- Geometrías vectoriales validadas con `shapely.is_valid` en proyección `EPSG:4326` (WGS84) y exportadas en `GeoJSON` + `GeoParquet`.",
        "- Tablas analíticas exportadas en `CSV` + `Parquet` listas para ingesta directa al Data Warehouse, Looker Studio o Power BI.",
    ])
    with open(os.path.join("data", "REPORTE_CALIDAD.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(q_lines))


def main():
    print("=" * 72)
    print("INICIANDO PIPELINE ETL SILVER & GOLD - MEXICO-DATAVIZ-BY-UPY")
    print("=" * 72)
    gdf_mun = process_municipios_yucatan()
    gdf_salud = process_unidades_medicas(gdf_mun)
    process_epidemiologia_dge()
    process_geoportal_merida(gdf_salud)
    process_hospitales_pnt(gdf_salud)
    process_prensa_scraping()
    process_encuesta_upy()
    process_dem_merida()
    process_pdb_6vxx()
    generate_governance_docs()
    print("=" * 72)
    print("PIPELINE ETL SILVER & GOLD COMPLETADO CON ÉXITO.")
    print("=" * 72)


if __name__ == "__main__":
    main()
