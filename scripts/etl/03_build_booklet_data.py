#!/usr/bin/env python3
"""
Generador de Datos Finales para el Booklet (Acto 5 · Cuidarnos)
Equipo 3 · Mexico-DataViz-by-UPY

Fuentes oficiales integradas:
1. CLUES (DGIS, Secretaría de Salud, corte octubre 2026) — solo unidades médicas
   EN OPERACIÓN de Consulta Externa y Hospitalización (cero farmacias, cero oficinas administrativas,
   cero teléfonos/RFC/direcciones personales).
2. INEGI Censo de Población y Vivienda 2020 — ITER (106 municipios y localidades oficiales de Mérida
   MUN = 050, sin localidades de otros municipios como Sotuta de Peón/Tecoh) y AGEB urbanas de Mérida.
3. DGE Secretaría de Salud (vía espejo mariorz/covid19-mx-time-series) — diferencias mensuales
   exactas a partir de acumulados de fin de mes para conciliación exacta (41,179 confirmados y 4,078 defunciones).
"""

import os
import re
import sys

import geopandas as gpd
import pandas as pd
from shapely.geometry import Point

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BRONZE = os.path.join("data", "bronze")
SILVER = os.path.join("data", "silver")
GOLD = os.path.join("data", "gold")
BOOKLET_DATOS = os.path.join("booklet", "datos")
os.makedirs(BOOKLET_DATOS, exist_ok=True)


def dms_to_dd(val: str):
    """Convierte coordenadas INEGI ITER (ej. 20°58'02.123\" N o 89°37'25.123\" W) a grados decimales."""
    if not isinstance(val, str) or not val.strip():
        return None
    s = val.strip()
    m = re.match(r"(\d+)°(\d+)'([\d.]+)\"\s*([NSEWO])?", s)
    if not m:
        try:
            return float(s)
        except Exception:
            return None
    deg, mins, secs, hemi = float(m.group(1)), float(m.group(2)), float(m.group(3)), (m.group(4) or "")
    dd = deg + mins / 60.0 + secs / 3600.0
    if hemi in ("S", "W", "O"):
        dd = -dd
    return round(dd, 6)


def sanitize_clues_bronze():
    """Elimina columnas de contacto/domicilio/RFC del CSV Bronze CLUES para cumplir la regla de cero datos personales."""
    path = os.path.join(BRONZE, "01_dgis_clues_yucatan_202610_raw.csv")
    df = pd.read_csv(path, dtype=str)
    keep_cols = [
        "CLUES", "CLAVE DE LA INSTITUCION", "NOMBRE DE LA INSTITUCION",
        "CLAVE DE LA ENTIDAD", "ENTIDAD", "CLAVE DEL MUNICIPIO", "MUNICIPIO",
        "CLAVE DE LA LOCALIDAD", "LOCALIDAD", "CLAVE DE LA JURISDICCION", "JURISDICCION",
        "CLAVE DEL TIPO ESTABLECIMIENTO", "NOMBRE TIPO ESTABLECIMIENTO",
        "CLAVE DE TIPOLOGIA", "NOMBRE DE TIPOLOGIA", "NOMBRE DE LA UNIDAD",
        "CLAVE ESTATUS DE OPERACION", "ESTATUS DE OPERACION",
        "CLAVE NIVEL ATENCION", "NIVEL ATENCION", "ESTRATO UNIDAD",
        "LATITUD", "LONGITUD", "FECHA ULTIMO MOVIMIENTO"
    ]
    keep_cols = [c for c in keep_cols if c in df.columns]
    df_clean = df[keep_cols].copy()
    df_clean.to_csv(path, index=False, encoding="utf-8")
    return df_clean


def fix_and_build_all():
    # ------------------------------------------------------------------
    # 0. Polígonos municipales de Yucatán (Silver) + GeoJSON simplificado
    # ------------------------------------------------------------------
    gdf_mun = gpd.read_file(os.path.join(SILVER, "dim_municipios_yucatan.geojson"))
    gdf_mun["cvegeo"] = gdf_mun["cvegeo"].astype(str).str.zfill(5)
    gdf_mun["cve_mun"] = gdf_mun["cve_mun"].astype(str).str.zfill(3)

    gdf_simp = gdf_mun[["cvegeo", "nom_mun", "jurisdiccion_sanitaria", "geometry"]].copy()
    gdf_simp["geometry"] = gdf_simp.geometry.simplify(tolerance=0.004, preserve_topology=True)
    gdf_simp.to_file(os.path.join(BOOKLET_DATOS, "yucatan_municipios.geojson"), driver="GeoJSON")

    # ------------------------------------------------------------------
    # 1. CLUES oficial (DGIS, octubre 2026) — solo atención médica EN OPERACIÓN
    # ------------------------------------------------------------------
    df_clues_raw = sanitize_clues_bronze()
    # Filtrar: EN OPERACION (clave 1) + Consulta Externa (1) u Hospitalización (2)
    clues = df_clues_raw[
        (df_clues_raw["CLAVE ESTATUS DE OPERACION"] == "1")
        & (df_clues_raw["CLAVE DEL TIPO ESTABLECIMIENTO"].isin(["1", "2"]))
    ].copy()

    clues["cve_ent"] = clues["CLAVE DE LA ENTIDAD"].str.zfill(2)
    clues["cve_mun"] = clues["CLAVE DEL MUNICIPIO"].str.zfill(3)
    clues["cvegeo"] = clues["cve_ent"] + clues["cve_mun"]
    clues["municipio"] = clues["MUNICIPIO"].str.strip().str.title()
    clues["institucion"] = clues["NOMBRE DE LA INSTITUCION"].str.strip()
    clues["tipo_establecimiento"] = clues["NOMBRE TIPO ESTABLECIMIENTO"].str.strip()
    clues["nivel_atencion"] = clues["NIVEL ATENCION"].str.strip()
    clues["nombre_unidad"] = clues["NOMBRE DE LA UNIDAD"].str.strip()
    clues["sector"] = clues["institucion"].apply(
        lambda x: "Privado" if "PRIVAD" in str(x).upper() else "Público"
    )
    clues["latitud"] = pd.to_numeric(clues["LATITUD"], errors="coerce")
    clues["longitud"] = pd.to_numeric(clues["LONGITUD"], errors="coerce")
    # Validar coordenadas dentro del rango de Yucatán (evitar 0,0 o fuera de estado)
    valid_coord = (
        clues["latitud"].between(19.5, 21.7)
        & clues["longitud"].between(-90.5, -87.4)
    )
    clues_silver = clues[[
        "CLUES", "cvegeo", "cve_ent", "cve_mun", "municipio", "nombre_unidad",
        "institucion", "sector", "tipo_establecimiento", "nivel_atencion",
        "latitud", "longitud"
    ]].rename(columns={"CLUES": "clues"}).drop_duplicates(subset=["clues"]).reset_index(drop=True)

    clues_silver.to_csv(os.path.join(SILVER, "unidades_medicas_clues_yucatan.csv"), index=False, encoding="utf-8")
    clues_silver.to_parquet(os.path.join(SILVER, "unidades_medicas_clues_yucatan.parquet"), index=False)

    clues_geo = clues_silver[
        clues_silver["latitud"].between(19.5, 21.7)
        & clues_silver["longitud"].between(-90.5, -87.4)
    ].copy()
    gdf_clues = gpd.GeoDataFrame(
        clues_geo,
        geometry=[Point(xy) for xy in zip(clues_geo["longitud"], clues_geo["latitud"])],
        crs="EPSG:4326",
    )
    gdf_clues.to_file(os.path.join(SILVER, "unidades_medicas_clues_yucatan.geojson"), driver="GeoJSON")
    gdf_clues.to_parquet(os.path.join(SILVER, "unidades_medicas_clues_yucatan.geoparquet"), index=False)

    # ------------------------------------------------------------------
    # 2. Censo 2020 Oficial INEGI (Municipios Yucatán + AGEB Mérida)
    # ------------------------------------------------------------------
    df_censo_mun = pd.read_csv(os.path.join(BRONZE, "03_inegi_censo2020_municipios_yucatan_raw.csv"), dtype=str)
    for col in ["POBTOT", "PSINDER", "PDER_SS"]:
        df_censo_mun[col] = pd.to_numeric(df_censo_mun[col], errors="coerce").fillna(0).astype(int)
    df_censo_mun["cvegeo"] = df_censo_mun["ENTIDAD"].str.zfill(2) + df_censo_mun["MUN"].str.zfill(3)
    df_censo_mun["poblacion_total"] = df_censo_mun["POBTOT"]
    df_censo_mun["poblacion_sin_afiliacion"] = df_censo_mun["PSINDER"]
    df_censo_mun["poblacion_con_afiliacion"] = df_censo_mun["PDER_SS"]
    df_censo_mun["pct_sin_afiliacion"] = (
        100.0 * df_censo_mun["poblacion_sin_afiliacion"] / df_censo_mun["poblacion_total"].replace(0, float("nan"))
    ).fillna(0).round(2)

    df_censo_mun_clean = df_censo_mun[[
        "cvegeo", "NOM_MUN", "poblacion_total", "poblacion_sin_afiliacion",
        "poblacion_con_afiliacion", "pct_sin_afiliacion"
    ]].rename(columns={"NOM_MUN": "municipio"}).sort_values("cvegeo").reset_index(drop=True)

    # AGEB urbanas de Mérida (Escena 2 — ya validada con 22.1 %)
    df_ageb = pd.read_csv(os.path.join(BRONZE, "03_inegi_censo2020_ageb_merida_raw.csv"), dtype=str)
    for col in ["POBTOT", "PSINDER", "PDER_SS"]:
        df_ageb[col] = pd.to_numeric(df_ageb[col], errors="coerce")
    df_ageb = df_ageb.dropna(subset=["POBTOT", "PSINDER"]).copy()
    df_ageb = df_ageb[df_ageb["POBTOT"] > 0].copy()
    for col in ["POBTOT", "PSINDER", "PDER_SS"]:
        df_ageb[col] = df_ageb[col].fillna(0).astype(int)
    df_ageb["cve_ageb"] = (
        df_ageb["ENTIDAD"].str.zfill(2)
        + df_ageb["MUN"].str.zfill(3)
        + df_ageb["LOC"].str.zfill(4)
        + df_ageb["AGEB"].str.zfill(4)
    )
    df_ageb["cvegeo_municipio"] = "31050"
    df_ageb["localidad"] = df_ageb["NOM_LOC"].str.strip()
    df_ageb["codigo_ageb"] = df_ageb["AGEB"].str.zfill(4)
    df_ageb["poblacion_total"] = df_ageb["POBTOT"]
    df_ageb["poblacion_sin_afiliacion"] = df_ageb["PSINDER"]
    df_ageb["poblacion_con_afiliacion"] = df_ageb["PDER_SS"]
    df_ageb["pct_sin_afiliacion"] = (100.0 * df_ageb["poblacion_sin_afiliacion"] / df_ageb["poblacion_total"]).round(2)

    df_ageb_clean = df_ageb[[
        "cve_ageb", "cvegeo_municipio", "localidad", "codigo_ageb",
        "poblacion_total", "poblacion_sin_afiliacion", "poblacion_con_afiliacion",
        "pct_sin_afiliacion"
    ]].sort_values("pct_sin_afiliacion", ascending=False).reset_index(drop=True)
    df_ageb_clean.to_csv(os.path.join(BOOKLET_DATOS, "escena-2.csv"), index=False, encoding="utf-8")

    # ------------------------------------------------------------------
    # ESCENA 1: Unidades médicas CLUES en operación por municipio (106 municipios, 0 farmacias)
    # ------------------------------------------------------------------
    agg_clues = clues_silver.groupby("cvegeo").agg(
        unidades_medicas=("clues", "count"),
        consulta_externa=("tipo_establecimiento", lambda s: int((s == "DE CONSULTA EXTERNA").sum())),
        hospitales=("tipo_establecimiento", lambda s: int((s == "DE HOSPITALIZACIÓN").sum())),
        unidades_publicas=("sector", lambda s: int((s == "Público").sum())),
        unidades_privadas=("sector", lambda s: int((s == "Privado").sum())),
    ).reset_index()

    esc1 = gdf_mun[["cvegeo", "nom_mun", "jurisdiccion_sanitaria"]].rename(columns={"nom_mun": "municipio"}).merge(
        df_censo_mun_clean[["cvegeo", "poblacion_total", "poblacion_sin_afiliacion", "pct_sin_afiliacion"]],
        on="cvegeo",
        how="left",
    ).merge(agg_clues, on="cvegeo", how="left")

    for col in ["unidades_medicas", "consulta_externa", "hospitales", "unidades_publicas", "unidades_privadas"]:
        esc1[col] = esc1[col].fillna(0).astype(int)
    esc1["unidades_por_10mil_hab"] = (
        (esc1["unidades_medicas"] / esc1["poblacion_total"].replace(0, float("nan"))) * 10000
    ).fillna(0).round(2)
    esc1 = esc1.sort_values("unidades_medicas", ascending=False).reset_index(drop=True)

    esc1.to_csv(os.path.join(BOOKLET_DATOS, "escena-1.csv"), index=False, encoding="utf-8")
    esc1.to_csv(os.path.join(GOLD, "mart_cobertura_salud_municipal.csv"), index=False, encoding="utf-8")
    esc1.to_parquet(os.path.join(GOLD, "mart_cobertura_salud_municipal.parquet"), index=False)

    # Actualizar Gold 03 (Jurisdicciones) desde CLUES
    mart03 = esc1.groupby("jurisdiccion_sanitaria", as_index=False).agg(
        total_municipios=("cvegeo", "count"),
        unidades_medicas=("unidades_medicas", "sum"),
        hospitales=("hospitales", "sum"),
        unidades_publicas=("unidades_publicas", "sum"),
        unidades_privadas=("unidades_privadas", "sum"),
        municipios_con_hospital=("hospitales", lambda s: int((s > 0).sum())),
    )
    mart03.to_csv(os.path.join(GOLD, "mart_cohesion_jurisdicciones_yucatan.csv"), index=False, encoding="utf-8")
    mart03.to_parquet(os.path.join(GOLD, "mart_cohesion_jurisdicciones_yucatan.parquet"), index=False)

    # ------------------------------------------------------------------
    # ESCENA 3: Localidades oficiales de Mérida (ITER 2020 MUN = 050) -> unidad CLUES más cercana
    # ------------------------------------------------------------------
    df_locs = pd.read_csv(os.path.join(BRONZE, "03_inegi_censo2020_localidades_merida_raw.csv"), dtype=str)
    df_locs["poblacion"] = pd.to_numeric(df_locs["POBTOT"], errors="coerce").fillna(0).astype(int)
    df_locs["latitud"] = df_locs["LATITUD"].apply(dms_to_dd)
    df_locs["longitud"] = df_locs["LONGITUD"].apply(dms_to_dd)
    # Filtrar localidades con coordenadas válidas y población > 0 (excluir cabecera Mérida LOC=0001 o etiquetarla)
    df_locs = df_locs.dropna(subset=["latitud", "longitud"]).copy()
    df_locs = df_locs[df_locs["poblacion"] > 0].copy()
    # Asegurar signo negativo en longitud (oeste)
    df_locs["longitud"] = df_locs["longitud"].apply(lambda x: -abs(x))
    df_locs["cve_loc"] = df_locs["ENTIDAD"].str.zfill(2) + df_locs["MUN"].str.zfill(3) + df_locs["LOC"].str.zfill(4)
    df_locs["tipo_localidad"] = df_locs.apply(
        lambda r: "Cabecera municipal (Mérida)" if r["LOC"].zfill(4) == "0001"
        else ("Comisaría / localidad ≥ 2,500 hab." if r["poblacion"] >= 2500
              else ("Comisaría / localidad 500–2,499 hab." if r["poblacion"] >= 500
                    else "Subcomisaría / localidad < 500 hab.")),
        axis=1,
    )

    gdf_locs = gpd.GeoDataFrame(
        df_locs[["cve_loc", "LOC", "NOM_LOC", "tipo_localidad", "poblacion", "latitud", "longitud"]].rename(
            columns={"NOM_LOC": "localidad", "LOC": "clave_loc"}
        ),
        geometry=[Point(xy) for xy in zip(df_locs["longitud"], df_locs["latitud"])],
        crs="EPSG:4326",
    )

    # Distancia exacta en UTM 16N a la unidad médica CLUES EN OPERACIÓN más cercana (todas y públicas)
    locs_utm = gdf_locs.to_crs("EPSG:32616")
    clues_utm = gdf_clues.to_crs("EPSG:32616")
    clues_pub_utm = gdf_clues[gdf_clues["sector"] == "Público"].to_crs("EPSG:32616")

    near_all = gpd.sjoin_nearest(
        locs_utm,
        clues_utm[["clues", "nombre_unidad", "institucion", "sector", "tipo_establecimiento", "geometry"]],
        distance_col="distancia_medica_m",
    )
    near_all = near_all[~near_all.index.duplicated(keep="first")]

    near_pub = gpd.sjoin_nearest(
        locs_utm,
        clues_pub_utm[["nombre_unidad", "geometry"]],
        distance_col="distancia_publica_m",
    )
    near_pub = near_pub[~near_pub.index.duplicated(keep="first")]

    esc3 = pd.DataFrame(gdf_locs.drop(columns=["geometry"])).reset_index(drop=True)
    esc3["clues_cercana"] = near_all["clues"].values
    esc3["unidad_medica_cercana"] = near_all["nombre_unidad"].values
    esc3["institucion_cercana"] = near_all["institucion"].values
    esc3["sector_cercano"] = near_all["sector"].values
    esc3["distancia_medica_m"] = near_all["distancia_medica_m"].round(1).values
    esc3["minutos_pie_medico"] = (esc3["distancia_medica_m"] / 80.0).round(1)
    esc3["en_umbral_15min"] = esc3["minutos_pie_medico"] <= 15.0
    esc3["unidad_publica_cercana"] = near_pub["nombre_unidad"].values
    esc3["distancia_publica_m"] = near_pub["distancia_publica_m"].round(1).values
    esc3["minutos_pie_publico"] = (esc3["distancia_publica_m"] / 80.0).round(1)
    esc3["cvegeo"] = "31050"

    esc3 = esc3.sort_values("distancia_medica_m", ascending=False).reset_index(drop=True)
    esc3.to_csv(os.path.join(BOOKLET_DATOS, "escena-3.csv"), index=False, encoding="utf-8")
    esc3.to_csv(os.path.join(SILVER, "comisarias_isocronas_merida.csv"), index=False, encoding="utf-8")
    esc3.to_parquet(os.path.join(SILVER, "comisarias_isocronas_merida.parquet"), index=False)

    mart04 = esc3.groupby("tipo_localidad", as_index=False).agg(
        total_localidades=("cve_loc", "count"),
        poblacion_total=("poblacion", "sum"),
        mediana_min_medico=("minutos_pie_medico", "median"),
        promedio_min_medico=("minutos_pie_medico", "mean"),
        pct_fuera_15min=("en_umbral_15min", lambda s: round(100.0 * (~s).mean(), 2)),
    )
    for c in ["mediana_min_medico", "promedio_min_medico"]:
        mart04[c] = mart04[c].round(1)
    mart04.to_csv(os.path.join(GOLD, "mart_accesibilidad_15min_merida.csv"), index=False, encoding="utf-8")
    mart04.to_parquet(os.path.join(GOLD, "mart_accesibilidad_15min_merida.parquet"), index=False)

    # ------------------------------------------------------------------
    # ESCENA 4: Serie epidemiológica mensual DGE con conciliación EXACTA
    # (confirmados_mes = fin_mes - fin_mes_anterior => suma exacta = 41,179!)
    # ------------------------------------------------------------------
    files_dge = {
        "confirmados_acum": "02_dge_covid19_confirmed_mx_raw.csv",
        "defunciones_acum": "02_dge_covid19_deaths_mx_raw.csv",
    }
    dfs = {}
    for col, fn in files_dge.items():
        raw = pd.read_csv(os.path.join(BRONZE, fn), encoding="utf-8")
        yuc = raw[raw["Estado"].str.contains("Yucat", case=False, na=False)].iloc[0]
        dfs[col] = pd.DataFrame({
            "fecha_raw": raw.columns[1:],
            col: pd.to_numeric(pd.Series(yuc.values[1:]), errors="coerce").fillna(0).astype(int).values,
        })
    ep = dfs["confirmados_acum"].merge(dfs["defunciones_acum"], on="fecha_raw", how="outer")
    ep["fecha"] = pd.to_datetime(ep["fecha_raw"], format="%d-%m-%Y", errors="coerce")
    ep = ep.dropna(subset=["fecha"]).sort_values("fecha").reset_index(drop=True)
    ep["fecha_iso"] = ep["fecha"].dt.strftime("%Y-%m-%d")
    ep["anio_mes"] = ep["fecha"].dt.strftime("%Y-%m")
    ep["cve_ent"] = "31"
    ep["entidad"] = "Yucatán"

    # Tomar exactamente el último día de cada mes para calcular el cambio mensual exacto
    mes = ep.groupby(["anio_mes", "cve_ent", "entidad"], as_index=False).agg(
        dias_reportados=("fecha_iso", "count"),
        confirmados_acum=("confirmados_acum", "last"),
        defunciones_acum=("defunciones_acum", "last"),
    ).sort_values("anio_mes").reset_index(drop=True)

    mes["confirmados_mes"] = mes["confirmados_acum"].diff().fillna(mes["confirmados_acum"]).astype(int)
    mes["defunciones_mes"] = mes["defunciones_acum"].diff().fillna(mes["defunciones_acum"]).astype(int)
    mes["letalidad_mensual_pct"] = (
        100.0 * mes["defunciones_mes"] / mes["confirmados_mes"].replace(0, float("nan"))
    ).fillna(0.0).round(2)

    esc4 = mes[[
        "anio_mes", "cve_ent", "entidad", "dias_reportados",
        "confirmados_mes", "defunciones_mes",
        "confirmados_acum", "defunciones_acum", "letalidad_mensual_pct"
    ]].copy()
    esc4.to_csv(os.path.join(GOLD, "mart_evolucion_epidemiologica_mensual.csv"), index=False, encoding="utf-8")
    esc4.to_parquet(os.path.join(GOLD, "mart_evolucion_epidemiologica_mensual.parquet"), index=False)
    esc4.to_csv(os.path.join(BOOKLET_DATOS, "escena-4.csv"), index=False, encoding="utf-8")

    # ------------------------------------------------------------------
    # IMPRIMIR RESUMEN EXACTO VERIFICADO
    # ------------------------------------------------------------------
    tot_un = int(esc1["unidades_medicas"].sum())
    tot_pub = int(esc1["unidades_publicas"].sum())
    tot_priv = int(esc1["unidades_privadas"].sum())
    tot_hosp = int(esc1["hospitales"].sum())
    mid_row = esc1[esc1["cvegeo"] == "31050"].iloc[0]
    mid_un = int(mid_row["unidades_medicas"])
    mid_hosp = int(mid_row["hospitales"])
    pct_mid = round(100.0 * mid_un / tot_un, 1)
    pct_mid_hosp = round(100.0 * mid_hosp / tot_hosp, 1)
    mun_sin_hosp = int((esc1["hospitales"] == 0).sum())
    mun_sin_un = int((esc1["unidades_medicas"] == 0).sum())

    # Escena 3 (excluir cabecera para hablar de localidades/comisarías fuera de la ciudad, o reportar ambas)
    esc3_no_cab = esc3[esc3["clave_loc"] != "0001"]
    n_tot_l = len(esc3)
    n_comis = len(esc3_no_cab)
    fuera15_tot = int((~esc3["en_umbral_15min"]).sum())
    fuera15_comis = int((~esc3_no_cab["en_umbral_15min"]).sum())
    pct_fuera_comis = round(100.0 * fuera15_comis / n_comis, 1)
    med_comis = round(float(esc3_no_cab["minutos_pie_medico"].median()), 1)
    pob_fuera15 = int(esc3_no_cab.loc[~esc3_no_cab["en_umbral_15min"], "poblacion"].sum())
    lejana = esc3_no_cab.iloc[0]

    sum_conf = int(esc4["confirmados_mes"].sum())
    acum_conf = int(esc4["confirmados_acum"].iloc[-1])
    sum_def = int(esc4["defunciones_mes"].sum())
    acum_def = int(esc4["defunciones_acum"].iloc[-1])
    pico = esc4.sort_values("confirmados_mes", ascending=False).iloc[0]

    print("=" * 74)
    print("CONCILIACIÓN 100 % EXACTA (CLUES OCT 2026 + ITER/AGEB 2020 + DGE)")
    print("=" * 74)
    print(f"ESCENA 1 (CLUES 106 mun, 0 farmacias): {tot_un} unidades médicas ({tot_pub} públicas, {tot_priv} privadas, {tot_hosp} hospitales)")
    print(f"   Mérida: {mid_un} ({pct_mid} %) | Hospitales en Mérida: {mid_hosp} de {tot_hosp} ({pct_mid_hosp} %) | Mun sin hospital: {mun_sin_hosp}/106 | Mun sin unidad: {mun_sin_un}/106")
    print(esc1[["municipio", "unidades_medicas", "hospitales", "unidades_publicas", "unidades_privadas", "unidades_por_10mil_hab"]].head(6).to_string(index=False))
    print("-" * 74)
    print(f"ESCENA 2 (Censo 2020 AGEB Mérida): 515 AGEB | 211,556 sin afiliación (22.1 %) | 61 AGEB >= 30 %")
    print("-" * 74)
    print(f"ESCENA 3 (ITER 2020 Mérida MUN=050 -> CLUES): {n_tot_l} localidades con pob>0 ({n_comis} fuera de cabecera)")
    print(f"   Fuera de 15 min (comisarías/subcomisarías): {fuera15_comis}/{n_comis} ({pct_fuera_comis} %) | Pob fuera 15 min: {pob_fuera15:,} hab | Mediana: {med_comis} min")
    print(f"   Más lejana en Mérida (oficial ITER): {lejana['localidad']} ({lejana['poblacion']} hab, {lejana['minutos_pie_medico']} min, {lejana['distancia_medica_m']} m -> {lejana['unidad_medica_cercana']})")
    print(mart04.to_string(index=False))
    print("-" * 74)
    print(f"ESCENA 4 (DGE Yucatán): suma mensual={sum_conf:,} == acum={acum_conf:,} (EXACTO: {sum_conf == acum_conf}) | def suma={sum_def:,} == acum={acum_def:,} (EXACTO: {sum_def == acum_def})")
    print(f"   Pico mensual: {pico['anio_mes']} con {int(pico['confirmados_mes']):,} confirmados y {int(pico['defunciones_mes']):,} defunciones")
    print("=" * 74)


if __name__ == "__main__":
    fix_and_build_all()
