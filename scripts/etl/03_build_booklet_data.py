#!/usr/bin/env python3
"""
Generador de Datos Finales para el Booklet (Acto 5 · Cuidarnos)
y Corrección de Métricas Silver / Gold (Equipo 3 · Mexico-DataViz-by-UPY)

1. Corrige la serie epidemiológica DGE (los valores crudos son acumulados; calcula incrementos diarios y mensuales reales).
2. Filtra espacialmente localidades/comisarías estrictamente dentro del polígono de Mérida (cvegeo == '31050').
3. Integra Censo de Población y Vivienda 2020 oficial de INEGI (municipios de Yucatán y 526 AGEB urbanas de Mérida).
4. Exporta los 4 CSV finales en booklet/datos/ (columnas en español, minúsculas y guion bajo) + GeoJSON simplificado.
"""

import json
import os
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


def fix_and_build_all():
    # ------------------------------------------------------------------
    # 0. Cargar polígonos oficiales de 106 municipios de Yucatán (Silver)
    # ------------------------------------------------------------------
    gdf_mun = gpd.read_file(os.path.join(SILVER, "dim_municipios_yucatan.geojson"))
    gdf_mun["cvegeo"] = gdf_mun["cvegeo"].astype(str).str.zfill(5)
    gdf_mun["cve_mun"] = gdf_mun["cve_mun"].astype(str).str.zfill(3)
    gdf_merida_poly = gdf_mun[gdf_mun["cvegeo"] == "31050"][["cvegeo", "geometry"]].copy()

    # GeoJSON simplificado para D3 (< 150 KB)
    gdf_simp = gdf_mun[["cvegeo", "nom_mun", "jurisdiccion_sanitaria", "geometry"]].copy()
    gdf_simp["geometry"] = gdf_simp.geometry.simplify(tolerance=0.004, preserve_topology=True)
    gdf_simp.to_file(os.path.join(BOOKLET_DATOS, "yucatan_municipios.geojson"), driver="GeoJSON")

    # ------------------------------------------------------------------
    # 1. Censo 2020 Oficial INEGI (Municipios Yucatán + AGEB Mérida)
    # ------------------------------------------------------------------
    df_censo_mun = pd.read_csv(os.path.join(BRONZE, "03_inegi_censo2020_municipios_yucatan_raw.csv"), dtype=str)
    for col in ["POBTOT", "PSINDER", "PDER_SS", "PDER_IMSS", "PDER_ISTE", "PDER_SEGP"]:
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
    df_censo_mun_clean.to_csv(os.path.join(SILVER, "censo2020_afiliacion_municipios_yucatan.csv"), index=False, encoding="utf-8")
    df_censo_mun_clean.to_parquet(os.path.join(SILVER, "censo2020_afiliacion_municipios_yucatan.parquet"), index=False)

    # AGEB urbanas de Mérida
    df_ageb = pd.read_csv(os.path.join(BRONZE, "03_inegi_censo2020_ageb_merida_raw.csv"), dtype=str)
    for col in ["POBTOT", "PSINDER", "PDER_SS", "PDER_IMSS", "PDER_ISTE", "PDER_SEGP"]:
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
    df_ageb_clean.to_csv(os.path.join(SILVER, "censo2020_afiliacion_ageb_merida.csv"), index=False, encoding="utf-8")
    df_ageb_clean.to_parquet(os.path.join(SILVER, "censo2020_afiliacion_ageb_merida.parquet"), index=False)
    df_ageb_clean.to_csv(os.path.join(GOLD, "mart_sin_afiliacion_ageb_merida.csv"), index=False, encoding="utf-8")
    df_ageb_clean.to_parquet(os.path.join(GOLD, "mart_sin_afiliacion_ageb_merida.parquet"), index=False)

    # ------------------------------------------------------------------
    # ESCENA 1: Unidades de salud por municipio en Yucatán (106 municipios)
    # ------------------------------------------------------------------
    m1 = pd.read_csv(os.path.join(GOLD, "mart_cobertura_salud_municipal.csv"), dtype={"cvegeo": str})
    m1["cvegeo"] = m1["cvegeo"].str.zfill(5)
    esc1 = m1.merge(
        df_censo_mun_clean[["cvegeo", "poblacion_total", "poblacion_sin_afiliacion", "pct_sin_afiliacion"]],
        on="cvegeo",
        how="left",
    )
    esc1["unidades_por_10mil_hab"] = (
        (esc1["total_unidades_salud"] / esc1["poblacion_total"].replace(0, float("nan"))) * 10000
    ).fillna(0).round(2)
    esc1_out = esc1[[
        "cvegeo", "nom_mun", "jurisdiccion_sanitaria", "poblacion_total",
        "hospital", "clinic", "doctors", "pharmacy", "dentist",
        "total_unidades_salud", "unidades_por_10mil_hab", "pct_sin_afiliacion"
    ]].rename(columns={
        "nom_mun": "municipio",
        "hospital": "hospitales",
        "clinic": "clinicas",
        "doctors": "consultorios",
        "pharmacy": "farmacias",
        "dentist": "dentistas",
    }).sort_values("total_unidades_salud", ascending=False).reset_index(drop=True)
    esc1_out.to_csv(os.path.join(BOOKLET_DATOS, "escena-1.csv"), index=False, encoding="utf-8")
    # Actualizar Gold 01 con población y tasa por 10 mil hab
    esc1_out.to_csv(os.path.join(GOLD, "mart_cobertura_salud_municipal.csv"), index=False, encoding="utf-8")
    esc1_out.to_parquet(os.path.join(GOLD, "mart_cobertura_salud_municipal.parquet"), index=False)

    # ------------------------------------------------------------------
    # ESCENA 2: Porcentaje sin afiliación a salud por AGEB urbana en Mérida (Censo 2020)
    # ------------------------------------------------------------------
    df_ageb_clean.to_csv(os.path.join(BOOKLET_DATOS, "escena-2.csv"), index=False, encoding="utf-8")

    # ------------------------------------------------------------------
    # ESCENA 3: Distancia a la unidad médica más cercana DENTRO de Mérida (31050)
    # ------------------------------------------------------------------
    gdf_places = gpd.read_file(os.path.join(SILVER, "comisarias_isocronas_merida.geojson"))
    gdf_places_mid = gpd.sjoin(gdf_places, gdf_merida_poly, how="inner", predicate="within").drop(
        columns=["index_right", "cvegeo_right"], errors="ignore"
    )
    if "cvegeo_left" in gdf_places_mid.columns:
        gdf_places_mid = gdf_places_mid.rename(columns={"cvegeo_left": "cvegeo"})
    gdf_places_mid = gdf_places_mid.reset_index(drop=True)

    # Guardar versión corregida en Silver y Gold
    gdf_places_mid.to_file(os.path.join(SILVER, "comisarias_isocronas_merida.geojson"), driver="GeoJSON")
    gdf_places_mid.to_parquet(os.path.join(SILVER, "comisarias_isocronas_merida.geoparquet"), index=False)
    tab_mid = pd.DataFrame(gdf_places_mid.drop(columns=["geometry"]))
    tab_mid.to_csv(os.path.join(SILVER, "comisarias_isocronas_merida.csv"), index=False, encoding="utf-8")
    tab_mid.to_parquet(os.path.join(SILVER, "comisarias_isocronas_merida.parquet"), index=False)

    tipo_es = {
        "suburb": "Colonia / Fraccionamiento",
        "neighbourhood": "Barrio / Zona urbana",
        "village": "Comisaría",
        "hamlet": "Subcomisaría / Ranchería",
        "town": "Localidad urbana",
    }
    esc3 = tab_mid.copy()
    esc3["tipo_localidad"] = esc3["tipo_asentamiento"].map(tipo_es).fillna("Localidad")
    esc3_out = esc3[[
        "id_localidad", "nombre_localidad", "tipo_localidad", "cvegeo",
        "latitud", "longitud", "salud_mas_cercana", "dist_salud_m",
        "min_caminata_salud", "cumple_ciudad_15min_salud",
        "parque_mas_cercano", "dist_parque_m", "min_caminata_parque"
    ]].rename(columns={
        "nombre_localidad": "localidad",
        "salud_mas_cercana": "unidad_salud_cercana",
        "dist_salud_m": "distancia_salud_m",
        "min_caminata_salud": "minutos_pie_salud",
        "cumple_ciudad_15min_salud": "en_umbral_15min_salud",
        "dist_parque_m": "distancia_parque_m",
        "min_caminata_parque": "minutos_pie_parque",
    }).sort_values("distancia_salud_m", ascending=False).reset_index(drop=True)
    esc3_out.to_csv(os.path.join(BOOKLET_DATOS, "escena-3.csv"), index=False, encoding="utf-8")

    # Actualizar Gold 04 con localidades estrictamente dentro de Mérida
    mart04 = esc3_out.groupby("tipo_localidad", as_index=False).agg(
        total_localidades=("id_localidad", "count"),
        distancia_media_salud_m=("distancia_salud_m", "mean"),
        minutos_pie_salud_prom=("minutos_pie_salud", "mean"),
        pct_salud_15min=("en_umbral_15min_salud", lambda s: round(100.0 * s.mean(), 2)),
        distancia_media_parque_m=("distancia_parque_m", "mean"),
        minutos_pie_parque_prom=("minutos_pie_parque", "mean"),
    )
    for c in ["distancia_media_salud_m", "minutos_pie_salud_prom", "distancia_media_parque_m", "minutos_pie_parque_prom"]:
        mart04[c] = mart04[c].round(2)
    mart04.to_csv(os.path.join(GOLD, "mart_accesibilidad_15min_merida.csv"), index=False, encoding="utf-8")
    mart04.to_parquet(os.path.join(GOLD, "mart_accesibilidad_15min_merida.parquet"), index=False)

    # ------------------------------------------------------------------
    # ESCENA 4: Serie epidemiológica mensual corregida (DGE Yucatán)
    # (Los valores en covid19_*_mx_raw.csv son ACUMULADOS diarios)
    # ------------------------------------------------------------------
    files_dge = {
        "confirmados_acum": "02_dge_covid19_confirmed_mx_raw.csv",
        "defunciones_acum": "02_dge_covid19_deaths_mx_raw.csv",
        "negativos_acum": "02_dge_covid19_negatives_mx_raw.csv",
        "sospechosos_acum": "02_dge_covid19_suspects_mx_raw.csv",
    }
    dfs = {}
    for col, fn in files_dge.items():
        raw = pd.read_csv(os.path.join(BRONZE, fn), encoding="utf-8")
        yuc = raw[raw["Estado"].str.contains("Yucat", case=False, na=False)].iloc[0]
        dfs[col] = pd.DataFrame({
            "fecha_raw": raw.columns[1:],
            col: pd.to_numeric(pd.Series(yuc.values[1:]), errors="coerce").fillna(0).astype(int).values,
        })
    ep = dfs["confirmados_acum"]
    for col in ["defunciones_acum", "negativos_acum", "sospechosos_acum"]:
        ep = ep.merge(dfs[col], on="fecha_raw", how="outer")
    ep["fecha"] = pd.to_datetime(ep["fecha_raw"], format="%d-%m-%Y", errors="coerce")
    ep = ep.dropna(subset=["fecha"]).sort_values("fecha").reset_index(drop=True)
    ep["fecha_iso"] = ep["fecha"].dt.strftime("%Y-%m-%d")
    ep["anio_mes"] = ep["fecha"].dt.strftime("%Y-%m")
    ep["cve_ent"] = "31"
    ep["nom_ent"] = "Yucatán"
    # Incrementos diarios reales
    ep["confirmados_nuevos"] = ep["confirmados_acum"].diff().fillna(ep["confirmados_acum"]).clip(lower=0).astype(int)
    ep["defunciones_nuevas"] = ep["defunciones_acum"].diff().fillna(ep["defunciones_acum"]).clip(lower=0).astype(int)
    ep["tasa_letalidad_acum_pct"] = (
        100.0 * ep["defunciones_acum"] / ep["confirmados_acum"].replace(0, float("nan"))
    ).fillna(0.0).round(2)

    ep_silver = ep[[
        "fecha_iso", "anio_mes", "cve_ent", "nom_ent",
        "confirmados_nuevos", "defunciones_nuevas",
        "confirmados_acum", "defunciones_acum",
        "negativos_acum", "sospechosos_acum", "tasa_letalidad_acum_pct"
    ]].copy()
    ep_silver.to_csv(os.path.join(SILVER, "serie_epidemiologica_yucatan.csv"), index=False, encoding="utf-8")
    ep_silver.to_parquet(os.path.join(SILVER, "serie_epidemiologica_yucatan.parquet"), index=False)

    # Agregación mensual real
    esc4 = ep_silver.groupby(["anio_mes", "cve_ent", "nom_ent"], as_index=False).agg(
        dias_reportados=("fecha_iso", "count"),
        confirmados_mes=("confirmados_nuevos", "sum"),
        defunciones_mes=("defunciones_nuevas", "sum"),
        confirmados_acum=("confirmados_acum", "max"),
        defunciones_acum=("defunciones_acum", "max"),
    )
    esc4["letalidad_mensual_pct"] = (
        100.0 * esc4["defunciones_mes"] / esc4["confirmados_mes"].replace(0, float("nan"))
    ).fillna(0.0).round(2)
    esc4 = esc4.rename(columns={"nom_ent": "entidad"})
    esc4.to_csv(os.path.join(GOLD, "mart_evolucion_epidemiologica_mensual.csv"), index=False, encoding="utf-8")
    esc4.to_parquet(os.path.join(GOLD, "mart_evolucion_epidemiologica_mensual.parquet"), index=False)
    esc4.to_csv(os.path.join(BOOKLET_DATOS, "escena-4.csv"), index=False, encoding="utf-8")

    # ------------------------------------------------------------------
    # IMPRIMIR RESUMEN VERIFICADO PARA FICHA Y GRÁFICAS
    # ------------------------------------------------------------------
    tot_un = int(esc1_out["total_unidades_salud"].sum())
    mid_un = int(esc1_out.loc[esc1_out["cvegeo"] == "31050", "total_unidades_salud"].iloc[0])
    pct_mid = round(100.0 * mid_un / tot_un, 1)
    mun_cero = int((esc1_out["total_unidades_salud"] == 0).sum())

    tot_pob_yuc = int(df_censo_mun_clean["poblacion_total"].sum())
    tot_sin_yuc = int(df_censo_mun_clean["poblacion_sin_afiliacion"].sum())
    pct_sin_yuc = round(100.0 * tot_sin_yuc / tot_pob_yuc, 1)

    tot_pob_mid_ageb = int(df_ageb_clean["poblacion_total"].sum())
    tot_sin_mid_ageb = int(df_ageb_clean["poblacion_sin_afiliacion"].sum())
    pct_sin_mid = round(100.0 * tot_sin_mid_ageb / tot_pob_mid_ageb, 1)
    ageb_mas_30 = int((df_ageb_clean["pct_sin_afiliacion"] >= 30.0).sum())
    ageb_max = df_ageb_clean.iloc[0]

    loc_mid_n = len(esc3_out)
    fuera_15 = int((~esc3_out["en_umbral_15min_salud"]).sum())
    pct_fuera_15 = round(100.0 * fuera_15 / loc_mid_n, 1)
    mediana_min = round(float(esc3_out["minutos_pie_salud"].median()), 1)
    comisarias = esc3_out[esc3_out["tipo_localidad"].isin(["Comisaría", "Subcomisaría / Ranchería"])]
    colonias = esc3_out[esc3_out["tipo_localidad"].isin(["Colonia / Fraccionamiento", "Barrio / Zona urbana"])]
    med_comis = round(float(comisarias["minutos_pie_salud"].median()), 1) if len(comisarias) else 0
    med_col = round(float(colonias["minutos_pie_salud"].median()), 1) if len(colonias) else 0
    loc_lejos = esc3_out.iloc[0]

    dge_conf_tot = int(esc4["confirmados_acum"].max())
    dge_def_tot = int(esc4["defunciones_acum"].max())
    pico_row = esc4.sort_values("confirmados_mes", ascending=False).iloc[0]

    print("=" * 72)
    print("CIFRAS EXACTAS VERIFICADAS DESDE booklet/datos/escena-*.csv")
    print("=" * 72)
    print(f"ESCENA 1 (Yucatán 106 mun): {tot_un} unidades | Mérida: {mid_un} ({pct_mid}%) | {mun_cero} de 106 municipios con 0 registros OSM")
    print(f"ESCENA 2 (Censo 2020 AGEB Mérida): {len(df_ageb_clean)} AGEB con población | Pob AGEB: {tot_pob_mid_ageb:,} | Sin afiliación: {tot_sin_mid_ageb:,} ({pct_sin_mid}%) | Yucatán estatal: {pct_sin_yuc}% | AGEB >=30% sin afiliación: {ageb_mas_30} | Máx AGEB: {ageb_max['codigo_ageb']} ({ageb_max['localidad']}, {ageb_max['pct_sin_afiliacion']}%, pob {ageb_max['poblacion_total']})")
    print(f"ESCENA 3 (Mérida 31050 localidades): {loc_mid_n} localidades dentro de Mérida | Fuera de 15 min: {fuera_15} ({pct_fuera_15}%) | Mediana global: {mediana_min} min | Mediana comisarías ({len(comisarias)}): {med_comis} min vs colonias/barrios ({len(colonias)}): {med_col} min | Más lejana: {loc_lejos['localidad']} ({loc_lejos['minutos_pie_salud']} min, {loc_lejos['distancia_salud_m']} m)")
    print(f"ESCENA 4 (DGE Yucatán {esc4['anio_mes'].min()} a {esc4['anio_mes'].max()}): {dge_conf_tot:,} confirmados acum. | {dge_def_tot:,} defunciones acum. | Pico mensual: {pico_row['anio_mes']} con {int(pico_row['confirmados_mes']):,} confirmados y {int(pico_row['defunciones_mes']):,} defunciones")
    print("=" * 72)


if __name__ == "__main__":
    fix_and_build_all()
